const buildElement = () => {
	const video = document.createElement("video")
	video.setAttribute("autoplay", true)
	video.setAttribute("playsinline", true)
	video.setAttribute("tabindex", "-1")

	return video
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

const video = () => {
	return initCamera().then(stream => {
		const videoElement = buildElement()
		videoElement.srcObject = stream
		return videoElement
	})
}

export default video
