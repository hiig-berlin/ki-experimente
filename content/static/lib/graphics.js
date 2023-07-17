export const circleFaceBoundingBox = (ctx, bounds, q) => {
	const { x, y, w, h } = bounds
	const pi = Math.PI

	ctx.strokeStyle = `hsl(${110*q},100%,50%)`
	ctx.fillStyle = `hsl(${110*q},100%,50%)`

	ctx.lineWidth = 1
	ctx.beginPath()
	ctx.arc(x + w/2, y + h/2, Math.max(w, h) / 2, 0, 2 * pi)
	ctx.stroke()

	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.arc(x + w/2, y + h/2, Math.max(w, h) / 2 - 4, pi / 2, pi / 2 + 2 * pi * q)
	ctx.stroke()
}

