
class Experiment {
	constructor(element) {
		this.container = element
		this.paused = true
		this.loopDelay = 40
		this.loadModels()
		.then(() => this.buildElements())
		.then(() => this.start())
		.then(() => this.bindEvents())

		this.offScreenCanvas = document.createElement("canvas")
		this.setOffScreenDimensions(640, 480)
		this.offScreenCtx = this.offScreenCanvas.getContext("2d")
		this.currentFrameHandler = Promise.resolve()
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

