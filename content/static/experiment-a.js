import video from "./lib/video.js"
import Experiment from "./lib/experiment.js"
import {circleFaceBoundingBox, drawNoFaceFoundMessage} from "./lib/graphics.js"
import { loadModels, detectFaces } from "./lib/detection.js"

class ExperimentA extends Experiment {
	loadModels() {
		return loadModels({withRecognition: false})
	}

	buildElements() {
		return video()
		.then(v => {
			const canvas = document.createElement("canvas")
			canvas.width = 1920
			canvas.height = 1080
			canvas.classList.add("live-canvas")
			v.addEventListener("play", () => {
				const vAspect = v.videoWidth / v.videoHeight
				canvas.width = Math.max(v.videoWidth, 1200)
				canvas.height = Math.floor(canvas.width / vAspect)
				this.setOffScreenDimensions(canvas.width, canvas.height)
			})
			this.container.appendChild(v)
			this.container.appendChild(canvas)
			this.canvas = canvas
			this.ctx = canvas.getContext("2d")
			this.video = v
		})
		.catch(_ => {
			throw this.cameraError()
		})
	}

	frameHandler() {
		this.loadVideoFrame()

		return detectFaces(this.offScreenCanvas, {withImage: true})
		.then(faces => {
			this.drawVideoFrame()
			this.drawDetections(faces)

			if (faces.length === 0) {
				drawNoFaceFoundMessage(this.ctx)
			}
		})
	}

	drawDetections(faces) {
		faces.forEach(f => {
		const q = f.score * 2 - 1
			circleFaceBoundingBox(this.ctx, f.bounds, q)
		})
	}

	start() {
		this.paused = false
		this.loop()
	}

	stop() {
		this.paused = true
		clearTimeout(this.loopTimer)
	}

	loop() {
		clearTimeout(this.loopTimer)
		if(this.paused) { return }
		this.frameHandler().then(() => {
			this.loopTimer = setTimeout(() => this.loop(), this.loopDelay)
		})
	}
}

document.querySelector("#experiment-a .launcher button").addEventListener("click", () => {
	new ExperimentA(document.querySelector("#experiment-a"))
})
