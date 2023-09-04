import { mkdirSync, cpSync } from "fs"
import generatePage from "./generate-page.js"

const createDirs = () => {
	mkdirSync("./site", {recursive: true} )
}

const copyStaticFiles = () => {
	cpSync("./content/static", "./site/static", {recursive: true})
	cpSync("./content/assets", "./site/assets", {recursive: true})
}

const generatePages = () => {
	[
		["./content/index.html", "./templates/main.html", "./site/"],
		["./content/gesichter-finden.html", "./templates/main.html", "./site/gesichter-finden/"],
		["./content/gesichter-erkennen.html", "./templates/main.html", "./site/gesichter-erkennen/"],
		["./content/ueber-das-projekt.html", "./templates/main.html", "./site/ueber-das-projekt/"],
	].map(item => generatePage(item[0], item[1], item[2]))
}

const build = () => {
	createDirs()
	copyStaticFiles()
	generatePages()
}

export default build
