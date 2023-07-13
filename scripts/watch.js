import build from "./tasks/build.js";
import hound from "hound";
import debounce from 'debounce';

const contentWatcher = hound.watch('./content');
const templateWatcher = hound.watch('./templates');

const handleChange = debounce((file) => {
	console.log(`Change in ${file}. Rebuilding …`);
	build();
}, 1000);

contentWatcher.on('create', handleChange);
contentWatcher.on('change', handleChange);
contentWatcher.on('delete', handleChange);

templateWatcher.on('create', handleChange);
templateWatcher.on('change', handleChange);
templateWatcher.on('delete', handleChange);

