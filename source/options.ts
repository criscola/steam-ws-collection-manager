function saveOptions(e) {
	e.preventDefault();
	const p = Promise.resolve(browser.storage.sync.set({
		color: document.querySelector<HTMLInputElement>('#color')!.value
	}));

	p.then(() => console.log("Options synced to storage."));
}

function restoreOptions() {
	let setCurrentChoice = (result) => {
		document.querySelector<HTMLInputElement>('#color')!.value = result.color || "blue";
	}
	let onError = (error) => {
		console.log(`Error: ${error}`);
	}
	let getting = browser.storage.sync.get("color");
	getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form")?.addEventListener("submit", saveOptions);


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
