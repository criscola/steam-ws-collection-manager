import { Config, Collection } from "./options-storage";

class SteamApi {
	static readonly subscribeUri = "https://steamcommunity.com/sharedfiles/subscribe";
	static readonly addToCollectionUri = "https://steamcommunity.com/sharedfiles/ajaxaddtocollections"

	static async SubscribeToSingleItem(id: string): Promise<Response> {
		const sessionId = await this.getSessionId();
		if (sessionId === null) {
			console.error("could not find sessionid in cookies");
			throw new Error("sessionid cannot be null");
		}

		return fetch(this.subscribeUri, {
			method: "POST",
			headers: this.getBaseHeaders(),
			body: new URLSearchParams({
				"id": id,
				"appid": this.getAppId(),
				"sessionid": sessionId
			}),
			redirect: "follow"
		});
	}

	static async AddItemToFullCollection(itemId: string): Promise<Response> {
		console.log("Adding item to full collection...");
		const sessionId = await this.getSessionId();
		if (sessionId === null) {
			console.error("could not find sessionid in cookies");
			throw new Error("sessionid cannot be null");
		}

		const fullCollection = await this.getNextFullCollection(Config.fullCollections);
		if (fullCollection === null) {
			console.error("could not find the next full collection");
			throw new Error("fullCollection cannot be null");
		}
		const itemShouldBeAddedKey = "collections["+fullCollection.id+"][add]";
		const collectionTitleKey = "collections["+fullCollection.id+"][title]";

		return fetch(this.addToCollectionUri, {
			method: "POST",
			headers: this.getBaseHeaders(),
			body: new URLSearchParams({
				"sessionID": sessionId,
				"publishedfileid": itemId,
				[itemShouldBeAddedKey]: "true",
				[collectionTitleKey]: fullCollection.title,
			}),
			redirect: "follow"
		});
	}

	static async SubscribeToCollection() {
		// https://steamcommunity.com/sharedfiles/ajaxaddtocollections
		const sessionId = await this.getSessionId();
		if (sessionId === null) {
			console.error("could not find sessionid in cookies");
			throw new Error("sessionid cannot be null");
		}
	}

	static ListCollections() {

	}

	private static getBaseHeaders(): Headers {
		const myHeaders = new Headers();
		myHeaders.append("Accept", "text/javascript, text/html, application/xml, text/xml, */*");
		myHeaders.append("X-Requested-With", "XMLHttpRequest");
		myHeaders.append("X-Prototype-Version", "1.7");
		myHeaders.append("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
		myHeaders.append("Connection", "keep-alive");
		return myHeaders;
	}

	private static getAppId(): string {
		return "255710";
	}

	private static async getSessionId(): Promise<string | null> {
		const cookies = await getCookies();
		console.log(cookies);
		return cookies.find(i => i.name === "sessionid")?.value ?? null;
	}

	// Returns the next available full collection. "Next available" in this context means the first full collection
	// which can hold at least one new item. E.g. there are 3 full collections, 'a', 'b' and 'c'. 'a' contains 1000
	// items thus is at full capacity. 'b' contains 999 elements, consequently 'b' is returned as it's the first
	// available collection from the list. If no available collections are present, null is returned.
	// TODO: Imagine having 200 items to add, requesting 200 times if an item can be added to a collection will generate 200 HTTP requests --> very undesirable.
	// TODO: Refactor to return count of items for each full collection and let the caller handle it.
	private static async getNextFullCollection(configKey: string): Promise<Collection | null>  {
		const result = await browser.storage.sync.get(configKey);
		if (result[configKey].length < 1) {
			console.error("could not find any full collection in config");
			return null;
		}
		for (let elem of result[configKey]) {
			const collection = await this.parseCollectionPage(elem);
			if (collection.count <= 1000) {
				return collection;
			}
		}
		return null;
	}

	private static async parseCollectionPage(collectionId: string): Promise<Collection> {
		const sessionId = await this.getSessionId();
		if (sessionId === null) {
			console.error("could not find sessionid in cookies");
			throw new Error("sessionid cannot be null");
		}

		const response = await fetch("https://steamcommunity.com/sharedfiles/filedetails/?id="+collectionId, {
			method: "GET",
			headers: this.getBaseHeaders(),
		});

		const body = await response.text();
		const html = new DOMParser().parseFromString(body, 'text/html');

		const title = html.querySelector(".collectionHeaderContent")?.querySelector(".workshopItemTitle")?.textContent;
		if (title === null || title === undefined) {
			console.error("could not find title in collection page");
			throw new Error("title cannot be null");
		}
		const itemsCountElement = html.querySelector(".workshopItemDescriptionTitle")?.querySelector(".childCount")?.textContent;
		if (itemsCountElement === null || itemsCountElement === undefined) {
			console.error("could not find itemsCount in collection page");
			throw new Error("itemsCountElement cannot be null");
		}
		const itemsCount = Number(itemsCountElement?.substring(1, itemsCountElement.length - 1));
		return new Collection(collectionId, title, itemsCount);
	}
}

async function getCookies() {
	return browser.cookies.getAll({url: "https://steamcommunity.com"});
}

// TODO: Implement connection-based instead of one-off
function handleMessage(request, _, sendResponse) {
	console.log("Message from the content script: ");
	console.log(request.msg[0].id);

	SteamApi.SubscribeToSingleItem(request.msg[0].id)
		.then(response => response.text())
		.then(result => console.log(result))
		.then(() => SteamApi.AddItemToFullCollection(request.msg[0].id))
		.then(response => response.text())
		.then(result => console.log(result))
		.then(() => sendResponse("item subscribed!"))
		.catch(error => console.log("error while subscribing to item", error));
}

browser.runtime.onMessage.addListener(handleMessage);
