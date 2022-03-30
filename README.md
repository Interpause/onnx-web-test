# onnx-test

Testing onnx web runtime edge deployment

## Stupid

When faced with subpar maintenance, one might have to resort to extremes...

## ONNX Webruntime

YoloV5 repository exports ONNX wrongly, somewhere something is int64 and exceeds int32 limits. So the ONNX model can't load on webGL and lags on CPU. Matrix ops I am using currently are however also TOO LAGGY at 100ms. I need to find a more efficient library. Will test with the model used for ONNX web demo in case I am missing optimizations rather than the nano model somehow being too slow and the runtime actually being quite lag.
