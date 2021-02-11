import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple';

function saveOptions(e) {
	e.preventDefault();
	const p = Promise.resolve(browser.storage.sync.set({
		color: document.querySelector<HTMLInputElement>('#color')!.value
	}));

	p.then(() => console.log("Options synced to storage."));
}

function initOptions() {
	const setCurrentValues = (result) => {
		document.querySelector<HTMLInputElement>('#color')!.value = result.color || "blue";
	}
	const onErrorSetCurrentValues = (error) => {
		console.error(`Error initializing current values: ${error}`);
	}
	const initHtml = () => {
		// Init Material UI components
		new MDCTextField(document.querySelector<HTMLInputElement>('.mdc-text-field')!);
		new MDCRipple(document.querySelector('.mdc-button')!);
	}
	const onErrorInitHtml = (error) => {
		console.error(`Error initializing HTML: ${error}`);
	}
	const initEventListeners = () => {
		document.querySelector("form")?.addEventListener("submit", saveOptions);
	}
	const onErrorInitEventListeners = (error) => {
		console.error(`Error initializing current values: ${error}`);
	}

	const getting = browser.storage.sync.get("color");
	getting.then(setCurrentValues, onErrorSetCurrentValues)
		.then(initHtml, onErrorInitHtml)
		.then(initEventListeners, onErrorInitEventListeners);
}

document.addEventListener("DOMContentLoaded", initOptions);

/*
class Config {
	private standardCollections: Record<string, string>;
	private customCollections: Record<string, string>;
	private fullCollections: Record<string, string>;

	constructor(standardCollections: Record<string, string>,
				customCollections: Record<string, string>,
				fullCollections: Record<string, string>) {
		this.standardCollections = standardCollections;
		this.customCollections = customCollections;
		this.fullCollections = fullCollections;
		// Should be built from data of the user
	}
}
*/
