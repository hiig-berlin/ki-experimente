import videoCanvas from "./video-canvas.js"
const MODEL_BASE_URL = '/static/models'

const printDebug = data => {
	const dbg = document.querySelector(".debug-output")
	dbg.innerHTML = data.map(d => [
		`s: ${Math.floor(100 * d._score)}`,
		`b: ${Math.floor(d._box._x)},${Math.floor(d._box._y)}`
	].join("\n")).join("\n---\n")
}

	//const detectorOptions = new faceapi.TinyFaceDetectorOptions()
	const detectorOptions = new faceapi.SsdMobilenetv1Options()

const frameHandler = (vid, cvs) => {
		return models.then(() => {
			return faceapi.detectAllFaces(vid, detectorOptions)
		}).then(faceDescriptions => {
			faceapi.draw.drawDetections(cvs, faceDescriptions)
			printDebug(faceDescriptions)
		})
}

videoCanvas(document.querySelector("#experiment-a"), 10, frameHandler)

const models = Promise.all([
	faceapi.loadSsdMobilenetv1Model(MODEL_BASE_URL),
	faceapi.loadTinyFaceDetectorModel(MODEL_BASE_URL),
	//faceapi.loadFaceLandmarkModel(MODEL_BASE_URL),
	//faceapi.loadFaceRecognitionModel(MODEL_BASE_URL),
])

