import videoCanvas from "./video-canvas.js"
import {circleFaceBoundingBox} from "./lib/graphics.js"
import { loadModels, detectFaces } from "./lib/detection.js"


const printDebug = data => {
	const dbg = document.querySelector(".debug-output")
	dbg.innerHTML = data.map(d => [
		`s: ${Math.floor(100 * d.score)}`,
		`b: ${Math.floor(d.bounds.x)},${Math.floor(d.bounds.y)}`
	].join("\n")).join("\n---\n")
}

const drawDetections = (cvs, faces) => {
	const ctx = cvs.getContext("2d")
	faces.forEach(f => {
	const q = f.score * 2 - 1
		circleFaceBoundingBox(ctx, f.bounds, q)
		//ctx.drawImage(f.image, 0, 0, 100, 100)
	})
}

const frameHandler = (cvs) => {
		return detectFaces(cvs, {withImage: true})
		.then(faces => {
			drawDetections(cvs, faces)
			printDebug(faces)
		})
}


loadModels().then(() => {
	videoCanvas(document.querySelector("#experiment-a"), 20, frameHandler)
})
