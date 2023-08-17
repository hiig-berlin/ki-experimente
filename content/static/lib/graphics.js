export const circleFaceBoundingBox = (ctx, bounds, q) => {
	const { x, y, w, h } = bounds
	const xc = x + w/2
	const yc = y + h/2
	const pi = Math.PI
	const r = Math.max(w, h) / 2
	const scaleFactor = getScaleFactor(ctx)
	const gaugeThickness = 6 * scaleFactor
	const fontSize = 12 * scaleFactor
	ctx.save()

	ctx.strokeStyle = "#aaa"
	ctx.fillStyle = "#fff"
	ctx.beginPath()
	ctx.arc(xc, yc, r, 0, pi * 2)
	ctx.closePath()
	ctx.arc(xc, yc, r - gaugeThickness, 0, 2 * pi, true)

	const labelw = 38 * scaleFactor
	const labelh = 1.5 * fontSize
	const labelc = 8 * scaleFactor
	ctx.roundRect(xc - labelw / 2, yc + r + gaugeThickness/2, labelw, labelh, labelc)

	ctx.stroke()
	ctx.fill()

	ctx.strokeStyle = `hsl(${110*q},90%,40%)`
	ctx.fillStyle = ctx.strokeStyle

	ctx.lineWidth = gaugeThickness - 2
	ctx.beginPath()
	ctx.arc(xc, yc, r - gaugeThickness/2, pi / 2, pi / 2 + 2 * pi * q)
	ctx.stroke()

	ctx.font = `${Math.floor(fontSize)}px sans-serif`
	ctx.textAlign = "center"
	ctx.fillText(`${Math.floor(q * 100)}%`, xc, yc +  r + 1.3 * fontSize)
	ctx.restore()
}

export const drawFaceThumbnail = (ctx, face, xc, yc, r) => {
	ctx.save()
	const scaleFactor = getScaleFactor(ctx)
	r = r * scaleFactor

	const borderWidth = 4
	
	ctx.fillStyle = "#fff"
	ctx.beginPath()
	ctx.arc(xc, yc , r, 0, 2 * Math.PI)
	ctx.fill()

	const r2 = r - borderWidth * scaleFactor
	ctx.beginPath()
	ctx.arc(xc, yc, r2, 0, 2 * Math.PI)
	ctx.clip()
	drawImageSquare(ctx, face.image, xc - r2, yc - r2 , 2*r2)
	
	ctx.restore()
}

export const getScaleFactor = (ctx) => {
	return ctx.canvas.width / ctx.canvas.clientWidth
}

const drawImageSquare = (ctx, image, x, y, size) => {
	const a = image.width
	const b = image.height
	const s = Math.min(a, b)
	
	const da = (a - s) / 2
	const db = (b - s) / 2

	ctx.drawImage(image, da, db, s, s, x, y, size, size)
}

export const drawNoFaceFoundMessage = (ctx) => {
	const scaleFactor = getScaleFactor(ctx)

	const x = ctx.canvas.width / 2
	const y = ctx.canvas.height - 25 * scaleFactor

	const message = "Keine Gesichter gefunden"

	ctx.save()
	ctx.strokeStyle = "#000"
	ctx.fillStyle = "#fff"
	ctx.textAlign = "center"
	ctx.font = ` bold ${24*scaleFactor}px sans-serif`
	ctx.fillText(message, x, y)
	ctx.strokeText(message, x, y)
 ctx.restore()
}
