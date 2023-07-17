const MODEL_BASE_URL = '/static/models'

export const loadModels = (withRecognotion = false) => {
	const models = [
		faceapi.loadSsdMobilenetv1Model(MODEL_BASE_URL),
		faceapi.loadTinyFaceDetectorModel(MODEL_BASE_URL)
	]

	if (withRecognotion) {
		models.push(faceapi.loadFaceLandmarkModel(MODEL_BASE_URL))
		models.push(faceapi.loadFaceRecognitionModel(MODEL_BASE_URL))
	}

	return Promise.all(models)
}

const getImageData = (cvs, box) => {
	const {_x, _y, _width, _height, } = box
	const ctx = cvs.getContext("2d")
	return ctx.getImageData(_x, _y , _width, _height)
}

const detectorOptions = new faceapi.SsdMobilenetv1Options()

export const detectFaces = (cvs, options = {}) => {
	let detector
	const { withRecognotion, withImageData } = options

	if (withRecognotion) {
		detector = faceapi.detectAllFaces(cvs, detectorOptions)
			.withFaceLandmarks()
			.withFaceDescriptors()
	} else {
		detector = faceapi.detectAllFaces(cvs, detectorOptions)
	}

	return detector.then(descriptions => {
		const faces = descriptions.map(d => {
			const box = withRecognotion ? d.detection._box : d._box
			const score = withRecognotion ? d.detection._score : d._score
			const imageData = withImageData ? getImageData(cvs, box) : null
			return {
				bounds: {
					x: box._x,
					y: box._y,
					w: box._width,
					h: box._height
				},
				imageData,
				score,
				descriptor: d.descriptor
			}
		})
		return faces
	})
}
