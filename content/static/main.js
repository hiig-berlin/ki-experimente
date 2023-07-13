// cspell:disable
const MODEL_BASE_URL = '/static/models'

const findCameraDevice = () => {
	navigator.mediaDevices.enumerateDevices()
		.then(devices => {
			return devices.filter(d => d.kind === "videoinput")
		})
		.then(videoDevices => console.log(videoDevices))
}

//findCameraDevice()

const cameraView = (element) => {
	const constraints = {
		video: true,
		audio: false,
		facingMode: {
			exact: "user"
		}
	}
	navigator.mediaDevices.getUserMedia(constraints)
		.then(function (stream) {
			console.log(stream)
			element.srcObject = stream
		})
		.catch(function (err) {
			console.log("Error", err)
		})
}

const vid = document.querySelector("#camera-video")
const cvs = document.querySelector("#camera-canvas")
const ctx = cvs.getContext("2d")
let faceDescriptions

vid.addEventListener("play", () => {
	cvs.width = vid.videoWidth
	cvs.height = vid.videoHeight

	//const detectorOptions = new faceapi.TinyFaceDetectorOptions()
	const detectorOptions = new faceapi.SsdMobilenetv1Options()

	let loopTimer
	const loop = () => {
		ctx.drawImage(vid, 0, 0)
		models.then(() => {
			return faceapi.detectAllFaces(vid, detectorOptions)
		}).then(faceDescriptions => {
			faceapi.draw.drawDetections(cvs, faceDescriptions)

			clearTimeout(loopTimer)
			loopTimer = setTimeout(loop, 1)
		})
	}

	loop()
})

cameraView(vid)

const models = Promise.all([
	faceapi.loadSsdMobilenetv1Model(MODEL_BASE_URL),
	faceapi.loadTinyFaceDetectorModel(MODEL_BASE_URL),
	//faceapi.loadFaceLandmarkModel(MODEL_BASE_URL),
	//faceapi.loadFaceRecognitionModel(MODEL_BASE_URL),
])

