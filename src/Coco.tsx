import { useEffect, useRef } from 'react'
import 'twin.macro'

import modelURL from './assets/yolov5n6.onnx?url'

async function getCam() {
  // https://stackoverflow.com/a/56095482
  // have to use HTMLVideoElement to decode for now

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      height: 640,
      width: 640,
    },
  })

  const video = document.createElement('video')
  video.srcObject = stream
  video.onloadedmetadata = () => video.play()

  return video
}

/** Convert ImageData from Canvas Context into ONNX Tensor */
function preprocessImgData(input: ImageData | ImageData[]) {
  const imgs = Array.isArray(input) ? input : [input]

  // assumption made that imgs have same shape
  // TODO: padding, or explicitly throw error
  // padding doesnt make sense since webcam res shouldnt change
  const { width: w, height: h } = imgs[0]
  const n = imgs.length
  const nwhc_rgba = nj
    .array(imgs.map((img) => img.data) as any, 'float32')
    .reshape(n, w, h, 4)

  const nchw_rgb = nwhc_rgba.slice(null, null, null, [3]).reshape(n, 3, h, w)

  // shape is specifically for yolov5... use most common shape then reshape?
  const tensor = new ort.Tensor(new Float32Array(n * 3 * w * h), [n, 3, h, w])
  tensor.data.set(nchw_rgb.selection.data as Float32Array)
  return tensor
}

function postprocessTensor(input: ort.Tensor) {}

// Promise that waits till next animation frame & resolves to the frame's timestamp in milliseconds
function waitAnimFrame() {
  return new Promise(requestAnimationFrame)
}

// TODO: profile for bottlenecks...
function startLoop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw 'Canvas context already initialized to different type!'

  let stopFlag = false
  // async loop part
  ;(async () => {
    const video = await getCam()

    //https://onnxruntime.ai/docs/api/js/interfaces/InferenceSession.SessionOptions.html
    const session = await ort.InferenceSession.create(modelURL, {
      executionProviders: ['webgl'],
      //executionMode: 'parallel',
      //graphOptimizationLevel: 'all',
    })

    let prev = -1
    let fpsQueue = []

    while (!stopFlag) {
      const time: DOMHighResTimeStamp = await waitAnimFrame()

      // draw cam footage
      console.time('draw cam')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      console.timeEnd('draw cam')

      console.time('screenshot')
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
      console.timeEnd('screenshot')
      console.time('matrix math')
      const tensor = preprocessImgData(img)
      console.timeEnd('matrix math')

      // use https://netron.app/ to inspect model input/output
      console.time('forward')
      const inputs = { images: tensor }
      const outputs = await session.run(inputs)
      console.timeEnd('forward')

      // nap has shape [n aka batch_size, a aka anchors, p aka predictions]
      const nap = outputs['output']
      const lol = postprocessTensor(nap)
      //console.log(nap)

      if (prev > 0) {
        const delta = time - prev
        const fps = 1000 / delta
        fpsQueue.push(fps)
        if (fpsQueue.length > 5) fpsQueue.shift()
        console.log(
          `FPS: ${fpsQueue.reduce((acc, v, i, a) => acc + v / a.length, 0)}`,
        )
      }
      prev = time
    }
  })()

  return () => {
    stopFlag = true
  }
}

export default function CocoPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // start webcam capture
  useEffect(() => {
    const canvasElem = canvasRef.current
    if (!canvasElem) return

    const stopLoop = startLoop(canvasElem)
    return stopLoop
  }, [canvasRef])

  // note CSS size is independent of canvas size. Similar to SVG viewbox.
  return (
    <canvas
      tw='fixed h-[640px] w-[640px] top-10 inset-x-0 mx-auto'
      ref={canvasRef}
      width={640}
      height={640}
    ></canvas>
  )
}
