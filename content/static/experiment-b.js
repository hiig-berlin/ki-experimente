import videoCanvas from "./video-canvas.js"
const MODEL_BASE_URL = '/static/models'

	//const detectorOptions = new faceapi.TinyFaceDetectorOptions()
	const detectorOptions = new faceapi.SsdMobilenetv1Options()

const printDebug = (data) => {
	const dbg = document.querySelector(".debug-output")
	dbg.innerHTML = [
		`Distance: ${data.distance}`
	].join("\n")
}

const drawDetections = (cvs, detections) => {
	const ctx = cvs.getContext("2d")
	ctx.lineWidth = 4
	ctx.font = "16px Arial"
	detections.forEach(face => {
		const d = face.detection
		const q = d._score * 2 - 1
		ctx.strokeStyle = `hsl(${110*q},100%,50%)`
		ctx.fillStyle = `hsl(${110*q},100%,50%)`
		const box = d._box
		if (!box) { return }
		ctx.strokeRect(box._x, box._y, box._width, box._height)
		ctx.fillText( `${Math.floor(d._score * 100)}%`, box._x + 6, box._y + 20)
	})
}

const detectFaces = (cvs) => {
	return faceapi.detectAllFaces(cvs, detectorOptions)
		.withFaceLandmarks()
		.withFaceDescriptors()
}

const frameHandler = (cvs, matcher) => {
		return detectFaces(cvs).then(faces => {
			//faceapi.draw.drawDetections(cvs, faceDescriptions)
			drawDetections(cvs, faces)
			if (faces.length > 0) {
				const match = matcher.findBestMatch(faces[0].descriptor)
				printDebug({distance: match._distance})
			}
		})
}

const loadReferenceImage = () => {
	const element = document.querySelector("#experiment-b .reference")
	return new Promise((resolve) => {
		const img = document.createElement("img")
		img.setAttribute("src", "/assets/reference-3.jpg")
		img.addEventListener("load", () => {
			element.width = img.width
			element.height = img.height
			const ctx = element.getContext("2d")
			ctx.drawImage(img, 0, 0)
			resolve(element)
		})
	})
}

const detectReferenceFaces = state => {
	return detectFaces(state.referenceCvs).then(faces => {
		state.referenceFaces = faces
		return state
	})
}

const drawReferenceFaces = state => {
	drawDetections(state.referenceCvs, state.referenceFaces)
	return state
}

const startVideo = state => {
	const matcher = new faceapi.FaceMatcher(state.referenceFaces)
	videoCanvas(document.querySelector("#experiment-b .video-canvas"), 10, (cvs) => frameHandler(cvs, matcher))
}

const inspect = state => {
	console.log(state)

	return state
}

const models = Promise.all([
	faceapi.loadSsdMobilenetv1Model(MODEL_BASE_URL),
	faceapi.loadTinyFaceDetectorModel(MODEL_BASE_URL),
	faceapi.loadFaceLandmarkModel(MODEL_BASE_URL),
	faceapi.loadFaceRecognitionModel(MODEL_BASE_URL),
])

Promise.all([models, loadReferenceImage()])
	.then(([_, referenceCvs]) => ({referenceCvs}))
	.then(detectReferenceFaces)
	.then(drawReferenceFaces)
	.then(inspect)
	.then(startVideo)

