
const findCameraDevice = () => {
	navigator.mediaDevices.enumerateDevices()
		.then(devices => {
			return devices.filter(d => d.kind === "videoinput")
		})
		.then(videoDevices => console.log(videoDevices))
}

//findCameraDevice()
