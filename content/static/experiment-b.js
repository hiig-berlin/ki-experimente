import videoCanvas from "./video-canvas.js"
import {circleFaceBoundingBox} from "./lib/graphics.js"
import { loadModels, detectFaces } from "./lib/detection.js"

const printDebug = (data) => {
	const dbg = document.querySelector(".debug-output")
	dbg.innerHTML = [
		`Distance: ${data.distance}`
	].join("\n")
}

const drawDetections = (cvs, faces) => {
	const ctx = cvs.getContext("2d")
	faces.forEach(f => {
	const q = f.score * 2 - 1
		circleFaceBoundingBox(ctx, f.bounds, q)
		//ctx.putImageData(f.imageData, 0,0)
	})
}

const frameHandler = (cvs, state) => {
		return detectFaces(cvs, {withImage: true, withRecognotion: true}).then(faces => {
			drawDetections(cvs, faces)
			if (faces.length > 0) {
				const match = state.matcher.findBestMatch(faces[0].descriptor)
				const labelIndex = parseInt(match._label,0)
				if (!isNaN(labelIndex)) {
					const referenceFace = state.referenceFaces[labelIndex]
					const ctx = cvs.getContext("2d")
					ctx.drawImage(referenceFace.image, 0, 0, 100, 100)
					printDebug({distance: match._distance})
				}
			}
		})
}

const loadReferenceImage = () => {
	const element = document.querySelector("#experiment-b .reference")
	return new Promise((resolve) => {
		const img = document.createElement("img")
		img.setAttribute("src", "/assets/reference-4.jpg")
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
	return detectFaces(state.referenceCvs, {withImage: true, withRecognotion: true}).then(faces => {
		state.referenceFaces = faces
		state.referenceDescriptors = faces.map((f,i) => {
			
			return new faceapi.LabeledFaceDescriptors(i.toString(), [f.descriptor] )
		})
		return state
	})
}

const drawReferenceFaces = state => {
	drawDetections(state.referenceCvs, state.referenceFaces)
	return state
}

const startVideo = state => {
	state.matcher = new faceapi.FaceMatcher(state.referenceDescriptors)
	videoCanvas(document.querySelector("#experiment-b .video-canvas"), 10, (cvs) => frameHandler(cvs, state))
}

const inspect = state => {
	console.log(state)

	return state
}

const models = loadModels({withRecognotion: true})

Promise.all([models, loadReferenceImage()])
	.then(([_, referenceCvs]) => ({referenceCvs}))
	.then(detectReferenceFaces)
	.then(drawReferenceFaces)
	.then(inspect)
	.then(startVideo)

