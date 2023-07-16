const buildElements = parentElement => {
	parentElement.classList.add("video-canvas")
	parentElement.innerHTML = ""
	const vid = document.createElement("video")
	vid.setAttribute("autoplay", true)
	vid.setAttribute("playsinline", true)
	parentElement.appendChild(vid)

	const cvs = document.createElement("canvas")
	cvs.setAttribute("autoplay", true)
	cvs.setAttribute("playsinline", true)
	parentElement.appendChild(cvs)
	
	return [vid, cvs]
}

const initCamera = () => {
	const constraints = {
		video: true,
		audio: false,
		facingMode: {
			exact: "user"
		}
	}
	
	return navigator.mediaDevices.getUserMedia(constraints)
}


const videoCanvas = (el, frameTimeout, frameHandler) => {
	const [vid, cvs] = buildElements(el)
	const ctx = cvs.getContext("2d")

	vid.addEventListener("play", () => {
		cvs.width = vid.videoWidth
		cvs.height = vid.videoHeight

		let loopTimer
		const loop = () => {
			ctx.drawImage(vid, 0, 0)
			frameHandler(vid, cvs).then(() => {
				clearTimeout(loopTimer)
				loopTimer = setTimeout(loop, frameTimeout)
			})
		}

		loop()
	})

	initCamera().then(stream => {
		vid.srcObject = stream
	})
}

export default videoCanvas
