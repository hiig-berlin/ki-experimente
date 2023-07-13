import { mkdirSync, cpSync } from "fs";
import generatePage from "./generate-page.js";

const createDirs = () => {
	mkdirSync("./output", {recursive: true} );
};

const copyStaticFiles = () => {
	cpSync("./content/static", "./output/static", {recursive: true});
};

const generatePages = () => {
	generatePage("./content/index.html", "./templates/main.html", "./output/");
};

const build = () => {
	createDirs();
	copyStaticFiles();
	generatePages();
}

export default build;
