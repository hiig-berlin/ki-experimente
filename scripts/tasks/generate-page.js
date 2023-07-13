import { readFileSync, writeFileSync, mkdirSync } from "fs";

const generatePage = (pageFile, templateFile, outputPath) => {
	const page = readFileSync(pageFile);
	const template = readFileSync(templateFile, {encoding: "utf-8"});

	const fullPage = template.replace("{{content}}", page);

	mkdirSync(outputPath, { recursive: true });

	writeFileSync(`${outputPath}/index.html`, fullPage);
};


export default generatePage;
