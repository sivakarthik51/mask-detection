import * as faceapi from 'face-api.js';

export async function loadModels() {
    console.log("Loading Models");
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
    await faceapi.loadMtcnnModel(MODEL_URL);
  }

export async function faceDescriptions(blob, inputSize = 512, algorithm='tinyfacedetector') {
    let img = await faceapi.fetchImage(blob);
    let detections = null;
    var t0,t1;

    switch(algorithm) {
      case 'tinyfacedetector':
        
        t0 = performance.now();
        detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceExpressions();
        t1 = performance.now();
        console.log("Using Tiny Face Detector took:"+(t1-t0));

        break;
      case 'mtcnn':
        
        const mtcnnForwardParams = {
          // limiting the search space to larger faces for webcam detection
          minFaceSize: 200
        }
        t0 = performance.now();
        detections = await faceapi.mtcnn(img, mtcnnForwardParams );
        t1 = performance.now()
        console.log("Using MTCNN took:"+(t1-t0));
        break;
      default:
        detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceExpressions();

    }

    //const resizedDetections = faceapi.resizeResults(detections,displaySize);
    return detections;
}