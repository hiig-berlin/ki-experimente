
class Experiment {
	constructor(element) {
		this.container = element
		this.paused = true
		this.loopDelay = 40
		this.loadModels()
		.then(() => this.buildElements())
		.then(() => this.start())
		.then(() => this.bindEvents())
	}

	bindEvents(){}

	drawVideoFrame() {
		this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
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

export default Experiment

