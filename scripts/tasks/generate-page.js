import { readFileSync, writeFileSync, mkdirSync } from "fs"

const pagesWithFooter = [
	"./content/index.html"
]

const generatePage = (pageFile, templateFile, outputPath) => {
	const page = readFileSync(pageFile)
	const template = readFileSync(templateFile, {encoding: "utf-8"})
	const footer = readFileSync("./templates/footer.html", {encoding: "utf-8"})

	let fullPage = template.replace("{{content}}", page)

	if (pagesWithFooter.indexOf(pageFile) !== -1) {
		fullPage = fullPage.replace("{{footer}}", footer)
	} else {
		fullPage = fullPage.replace("{{footer}}", "")
	}

	mkdirSync(outputPath, { recursive: true })

	writeFileSync(`${outputPath}/index.html`, fullPage)
}


export default generatePage

