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

function onClickSpecialSub() {
	const item = Parser.parseSingleItem(document);
	console.log(item);
}

class WorkshopItem {
	readonly description: string | null;
	readonly category: string[] | null;
	readonly subscribed: boolean;

	constructor(description: string | null, category: string[] | null, subscribed: boolean) {
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
		// Get category
		const category = doc.querySelector(categoryClassName);
		if (category === null) {
			console.error("cannot find category");
			return null;
		}

		// If split returns undefined, cast to null
		const categories = category?.textContent?.trim().substring(7).split(",").map((s) => s.trim()) ?? null

		const description = doc.querySelector(descriptionId);
		if (description === null) {
			console.error("cannot find description");
			return null;
		}

		const subscribed = doc.querySelector(subscribeButtonId);
		if (subscribed === null || subscribed?.classList.length === 0) {
			console.error("cannot find subscribe button");
			return null;
		}

		// TODO: DEBUG
		console.log("category: " + category?.textContent?.trim());
		console.log("description: " + description);
		console.log("subscribed: " + subscribed);

		return new WorkshopItem(description?.textContent, categories, subscribed?.classList.contains("toggled"));
	}
	static parseCollection(doc: Document): WorkshopItem[] | null {
		doc
		return null;
	}
}

/**
 * Tagger receives objects of type WorkshopItem and tries to assign them one or more tags.
 */
class Tagger {
	readonly config: any;

	constructor(config: any) {
		this.config = config;
	}

	static tagSingleItem(item: WorkshopItem) : string | null {
		if (!item.subscribed) {
			// Do stuff, filter out subscribed items before calling methods
		}
		return null;
	}

	static tagCollection(items: WorkshopItem[]): Record<string, WorkshopItem> | null {
		items.length
		return null;
	}
}

// TODO: Check which page are currently on and dispatch accordingly
injectSpecialSubButton();



