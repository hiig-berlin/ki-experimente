
class Experiment {
	constructor(element) {
		this.container = element
		this.container.classList.add("experiment")
		this.paused = true
		this.loopDelay = 40
		this.showLoader()
		this.loadModels()
		.then(() => this.buildElements())
		.then(() => this.start())
		.then(() => this.bindEvents())
		.then(() => this.clearLauncher())
		.then(() => this.hideLoader())
		.catch(err => {
			this.showError(err.message)
		})

		this.offScreenCanvas = document.createElement("canvas")
		this.setOffScreenDimensions(640, 480)
		this.offScreenCtx = this.offScreenCanvas.getContext("2d")
		this.currentFrameHandler = Promise.resolve()
	}

	clearLauncher() {
		const launcher = this.container.querySelector(".launcher")

		if (launcher) {
			this.container.removeChild(launcher)
		}
	}

	freezeCurrentDimensions() {
		const tempHeight = this.container.clientHeight
		const tempWidth = this.container.clientWidth
		this.container.setAttribute("style", `height: ${tempHeight}px; width:${tempWidth}px; overflow:hidden;`)
	}

	unfreezeCurrentDimensions() {
		this.container.removeAttribute("style")
	}

	cameraError() {
		return new Error("Kamera konnte nicht aktiviert werden.<br><br>Bitte lade die Seite neu und erlaube den Kamerazugriff wenn dein Browser dich dazu auffordert.")
	}

	showLoader() {
		this.freezeCurrentDimensions()
		if (this.container.querySelector(".loader")) { return }

		const loader = document.createElement("div")
		loader.classList.add("loader")
		this.container.appendChild(loader)
	}

	hideLoader() {
		this.unfreezeCurrentDimensions()
		const loader = this.container.querySelector(".loader")
		if (loader) {
			this.container.removeChild(loader)
		}
	}

	showError(message) {
		this.freezeCurrentDimensions()

		let errorElement = this.container.querySelector(".error")
		if (!errorElement) {
			errorElement = document.createElement("div")
			errorElement.classList.add("error")
			this.container.appendChild(errorElement)
		}

		errorElement.innerHTML = `<h2>Fehler</h2><div class="message">${message}</div>`
	}

	bindEvents(){}

	drawVideoFrame() {
		this.ctx.drawImage(this.offScreenCanvas, 0, 0, this.canvas.width, this.canvas.height)
	}

	loadVideoFrame() {
		this.offScreenCtx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
	}

	setOffScreenDimensions(w, h) {
		this.offScreenCanvas.width = w
		this.offScreenCanvas.height = h
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
		this.currentFrameHandler = this.frameHandler()
		this.currentFrameHandler.then(() => {
			this.loopTimer = setTimeout(() => this.loop(), this.loopDelay)
		})
	}
}

export default Experiment

