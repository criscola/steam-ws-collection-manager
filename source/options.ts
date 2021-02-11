import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { Config } from "./options-storage";

function saveOptions(e) {
	e.preventDefault();

	const p = Promise.resolve(browser.storage.sync.set({
		// TODO: Add way to add multiple full collections. Note: parametrize, another similar list will be needed
		[Config.fullCollections]: [document.querySelector<HTMLInputElement>('#full-collection')!.value]
	}));

	p.then(() => console.log("Options synced to storage."));
}

function initOptions() {
	const setCurrentValues = (result) => {
		document.querySelector<HTMLInputElement>('#full-collection')!.value = result.fullCollections[0];
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

	const getting = browser.storage.sync.get(Config.fullCollections);
	getting.then(setCurrentValues, onErrorSetCurrentValues)
		.then(initHtml, onErrorInitHtml)
		.then(initEventListeners, onErrorInitEventListeners);
}

document.addEventListener("DOMContentLoaded", initOptions);

