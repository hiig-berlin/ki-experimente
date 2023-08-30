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
		["./content/experiment-a.html", "./templates/main.html", "./site/experiment-a/"],
		["./content/experiment-b.html", "./templates/main.html", "./site/experiment-b/"],
	].map(item => generatePage(item[0], item[1], item[2]))
}

const build = () => {
	createDirs()
	copyStaticFiles()
	generatePages()
}

export default build
