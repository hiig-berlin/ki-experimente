const MODEL_BASE_URL = '/static/models'

export const loadModels = (options = {}) => {
	const {withRecognition} = options
	const models = [
		faceapi.loadSsdMobilenetv1Model(MODEL_BASE_URL),
		faceapi.loadTinyFaceDetectorModel(MODEL_BASE_URL)
	]

	if (withRecognition) {
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
	const { withRecognition, withImage } = options

	if (withRecognition) {
		detector = faceapi.detectAllFaces(cvs, detectorOptions)
			.withFaceLandmarks()
			.withFaceDescriptors()
	} else {
		detector = faceapi.detectAllFaces(cvs, detectorOptions)
	}

	return detector.then(descriptions => {
		const faces = descriptions.map(d => {
			const box = withRecognition ? d.detection._box : d._box
			const score = withRecognition ? d.detection._score : d._score
			const imageData = withImage ? getImageData(cvs, box) : null
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
		if (withImage) {
			return Promise.all(faces.map(addBitmapImage))
		} else {
			return faces
		}
	})
}

const addBitmapImage = face => {
	return createImageBitmap(face.imageData).then(bmp => {
		face.image = bmp
		return face
	})
}
