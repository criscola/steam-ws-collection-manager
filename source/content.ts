const subButtonDivClassName = ".game_area_purchase_game";
const specialSubButtonClassName = ".special_sub";
const categoryClassName = ".rightDetailsBlock"
const descriptionId = "#highlightContent"
const subscribeButtonId = "#SubscribeItemBtn"

function injectSpecialSubButton() {
	const specialSubButton = document.createElement("button");
	specialSubButton.className = specialSubButtonClassName;
	specialSubButton.textContent = "special subscribe";
	document.querySelector(subButtonDivClassName)?.appendChild(specialSubButton);

	specialSubButton.addEventListener("click", onClickSpecialSub);
}

class WorkshopItem {
	readonly id: string;
	readonly description: string | null;
	readonly category: string[] | null;
	readonly subscribed: boolean;

	constructor(id: string, description: string | null, category: string[] | null, subscribed: boolean) {
		this.id = id;
		this.description = description;
		this.category = category;
		this.subscribed = subscribed;
	}
}

/**
 * Parser parses HTML pages. It tries to parse the page looking for specific HTML elements and then apply some string
 * transformations in order to return instances of objects such as WorkshopItem.
 */
class Parser {
	static parseSingleItem(doc: Document): WorkshopItem | null {
		const id = new URL(doc.URL).searchParams.get("id");
		if (id === null) {
			console.error("id cannot be null");
			return null;
		}
		const categories = this.getCategories(doc);
		const description = this.getDescription(doc);
		const subscribed = this.getSubscribed(doc);
		if (subscribed === null) {
			console.error("subscribed cannot be null");
			return null;
		}

		// TODO: DEBUG
		console.log("category: " + categories);
		console.log("description: " + description);
		console.log("subscribed: " + subscribed);

		return new WorkshopItem(id, description, categories, subscribed);
	}

	// If no categories are defined, return null. If no source of the categories if found, return undefined.
	private static getCategories(doc: Document): string[] | null {
		const category = doc.querySelector(categoryClassName);
		if (category === null) {
			console.error("cannot find category");
			return null;
		}

		// If split returns undefined, cast to null
		return category?.textContent?.trim().substring(7).split(",").map((s) => s.trim()) ?? null;
	}

	private static getDescription(doc: Document): string | null {
		const description = doc.querySelector(descriptionId);
		if (description === null) {
			console.error("cannot find description");
			return null;
		}

		return description?.textContent;
	}

	private static getSubscribed(doc: Document): boolean | null {
		const subscribed = doc.querySelector(subscribeButtonId);
		if (subscribed === null || subscribed?.classList.length === 0) {
			console.error("cannot find subscribe button");
			return null;
		}
		return subscribed?.classList.contains("toggled");
	}
}

/**
 * Tagger receives objects of type WorkshopItem and tries to assign them one or more tags.
 */
/*
class Tagger {
	readonly config: any;

	constructor(config: any) {
		this.config = config;
	}

	static tagSingleItem(item: WorkshopItem) : string | null {


		return null;
	}

	static tagCollection(items: WorkshopItem[]): Record<string, WorkshopItem> | null {
		items.length
		return null;
	}
}*/


async function sendToBackground(item: WorkshopItem[]) {
	await browser.runtime.sendMessage({msg: item});
}

function onClickSpecialSub() {
	const item = Parser.parseSingleItem(document);
	// TODO: Debug
	console.log(item);
	if (item !== null) {
		Promise.resolve(sendToBackground([item])).then();
	}
}

// TODO: Check which page are currently on and dispatch accordingly
injectSpecialSubButton();
