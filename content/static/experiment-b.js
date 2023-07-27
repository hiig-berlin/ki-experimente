import video from "./lib/video.js"
import {circleFaceBoundingBox, drawFaceThumbnail} from "./lib/graphics.js"
import { loadModels, detectFaces } from "./lib/detection.js"

class ExperimentB {
	constructor(element) {
		this.container = element
		this.paused = true
		this.loopDelay = 40
		this.loadModels()
		.then(() => this.buildElements())
		.then(() => this.start())
		.then(() => this.bindEvents())
	}

	bindEvents() {
		this.container.querySelector(".default-reference").addEventListener("click", () => {
			this.loadReference("/assets/reference-6.jpg")
			.then(() => this.detectReferenceFaces())
		})

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
			this.container.appendChild(v)
			this.container.appendChild(canvas)
			this.canvas = canvas
			this.ctx = canvas.getContext("2d")
			this.video = v
		})
	}

	drawVideoFrame() {
		this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
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
				const mx = f.bounds.x
				const my = f.bounds.y + f.bounds.h + 10
				drawFaceThumbnail(this.ctx, f, mx, my, 25)
			}
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
		const referenceDescriptors = this.refFaces.map((f,i) => {
			console.log(i, f)
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

window.exp = new ExperimentB(document.querySelector("#experiment-b"))
