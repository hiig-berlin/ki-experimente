import { mkdirSync, cpSync } from "fs"
import generatePage from "./generate-page.js"

const createDirs = () => {
	mkdirSync("./output", {recursive: true} )
}

const copyStaticFiles = () => {
	cpSync("./content/static", "./output/static", {recursive: true})
	cpSync("./content/assets", "./output/assets", {recursive: true})
}

const generatePages = () => {
	[
		["./content/index.html", "./templates/main.html", "./output/"],
		["./content/experiment-a.html", "./templates/main.html", "./output/experiment-a/"],
		["./content/experiment-b.html", "./templates/main.html", "./output/experiment-b/"],
		["./content/imprint.html", "./templates/main.html", "./output/imprint/"],
		["./content/privacy-policy.html", "./templates/main.html", "./output/privacy-policy/"],
	].map(item => generatePage(item[0], item[1], item[2]))
}

const build = () => {
	createDirs()
	copyStaticFiles()
	generatePages()
}

export default build
