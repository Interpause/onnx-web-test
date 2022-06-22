# onnx-test

Testing onnx web runtime edge deployment

## Archived

If onnx web matures, unarchive this and make it into a template or smth.

## Stupid

When faced with subpar maintenance, one might have to resort to extremes...

## ONNX Webruntime

YoloV5 repository exports ONNX wrongly, somewhere something is int64 and exceeds int32 limits. So the ONNX model can't load on webGL and lags on CPU. Matrix ops I am using currently are however also TOO LAGGY at 100ms. I need to find a more efficient library. Will test with the model used for ONNX web demo in case I am missing optimizations rather than the nano model somehow being too slow and the runtime actually being quite lag.

### Conclusion

I downloaded the exact same YoloV2-tiny they used for their web demo, and compared the inference times between the demo & my code. It is roughly the same, though somehow their timer ocassionally glitches out leading it to dividing the time by two. It is too slow even for a tiny-class model, taking ~500ms. This is for wasm mode however. When using WebGL backend, it had a 10x improvement to 50ms... still only 20FPS, on a tiny model. This suggests may ONNX Webruntime isnt mature yet. I will test tensorflow.js, but if it has similar speeds, it might be WebGL as a whole isn't suitable. In which case, using a efficient backend to stream to frontend might be necessary...
