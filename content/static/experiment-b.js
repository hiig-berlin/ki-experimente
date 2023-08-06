import video from "./lib/video.js"
import Experiment from "./lib/experiment.js"
import {circleFaceBoundingBox, drawFaceThumbnail, getScaleFactor} from "./lib/graphics.js"
import { loadModels, detectFaces } from "./lib/detection.js"

class ExperimentB extends Experiment {
	bindEvents() {
		/*
		this.container.querySelector(".default-reference").addEventListener("click", () => {
			this.loadReference("/assets/reference-6.jpg")
			.then(() => this.detectReferenceFaces())
		})
		*/

		this.container.querySelector(".capture-reference").addEventListener("click", () => {
			this.captureReference()
			.then(() => this.detectReferenceFaces())
		})
		
		this.container.querySelector(".image-upload").addEventListener("change", (ev) => {
			ev.preventDefault()
			const file = ev.target.files[0]
			const url = URL.createObjectURL(file)
			this.loadReference(url)
			.then(() => this.detectReferenceFaces())
		})

		this.container.querySelector(".confirm-reference").addEventListener("click", () => {
			this.saveReferenceFaces()
			this.start()
		})
	}

	loadModels() {
		return loadModels({withRecognition: true})
	}

	buildElements() {
		this.container.setAttribute("style", `height:${this.container.clientHeight}px`)
		this.container.innerHTML = ""
		this.container.classList.add("experiment")
		const refImg = document.createElement("img")
		refImg.classList.add("reference")

		this.container.appendChild(refImg)
		this.refImg = refImg

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
			})
			this.container.removeAttribute("style")
			this.container.appendChild(v)
			this.container.appendChild(canvas)
			this.canvas = canvas
			this.ctx = canvas.getContext("2d")
			this.video = v
			this.buildControls()
		})
	}

	buildControls() {
		const overlay = document.createElement("div")
		overlay.classList.add("overlay")
		overlay.innerHTML = [
			`<button class="confirm-reference">Confirm</button>`,
			`<button class="capture-reference">Capture</button>`,
			//`<button class="default-reference">Default</button>`,
			`<label for="image-upload">Upload</label>`,
			`<input type="file" class="image-upload" id="image-upload" />`,
		].join("")

		this.container.appendChild(overlay)
	}

	frameHandler() {
		this.drawVideoFrame()

		return detectFaces(this.canvas, {withRecognition: true})
		.then(faces => {
			if (this.matcher) {
				faces.forEach(f => {
					const match = this.matcher.findBestMatch(f.descriptor)
					const labelIndex = parseInt(match._label,0)
					if (!isNaN(labelIndex)) {
						f.match = match
						f.referenceFace = this.refFaces[labelIndex]
					}
				})
			}
			this.drawDetections(faces)
		})
	}

	drawDetections(faces) {
		faces.forEach(f => {
			const q = f.score * 2 - 1
			circleFaceBoundingBox(this.ctx, f.bounds, q)
			if (f.match) {
				const scaleFactor = getScaleFactor(this.ctx)
				const offset = 10 * scaleFactor
				const mx = f.bounds.x - offset
				const my = f.bounds.y + f.bounds.h + offset
				drawFaceThumbnail(this.ctx, f, mx, my, 25)
			}
		})
	}


	loadReference(src) {
		return new Promise(resolve => {
			this.stop()
			const onload = () => {
				this.refImg.removeEventListener("load", onload)
				this.drawReferenceImage()
				resolve()
			}
			this.refImg.addEventListener("load", onload)
			this.refImg.setAttribute("src", src)
		})
	}

	captureReference() {
		this.stop()
		this.drawVideoFrame()

		return Promise.resolve()
	}

	saveReferenceFaces() {
		if (this.refFaces.length === 0) {
			this.matcher = null
			return
		}

		const referenceDescriptors = this.refFaces.map((f,i) => {
			return new faceapi.LabeledFaceDescriptors(i.toString(), [f.descriptor] )
		})

		this.matcher = new faceapi.FaceMatcher(referenceDescriptors)
	}

	drawReferenceImage() {
		const refAspect = this.refImg.width / this.refImg.height
		const canvasAspect = this.canvas.width / this.canvas.height

		let x
		let y
		let w
		let h

		if (refAspect > canvasAspect) {
			w = this.canvas.width
			h = w / refAspect
			x = 0
			y = (this.canvas.height - h) / 2
		} else {
			h = this.canvas.height
			w = h * refAspect
			y = 0
			x = (this.canvas.width - w) / 2
		}

		this.ctx.fillStyle = "#000"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.refImg, x, y, w, h)
	}

	detectReferenceFaces() {
		return detectFaces(this.canvas, {withImage: true, withRecognition: true})
		.then(faces => {
			this.refFaces = faces
			this.drawDetections(this.refFaces)
			return faces
		})
	}
}

document.querySelector("#experiment-b .launcher button").addEventListener("click", () => {
	new ExperimentB(document.querySelector("#experiment-b"))
})
