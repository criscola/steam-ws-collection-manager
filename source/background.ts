import Cookie = browser.cookies.Cookie;
class SteamApi {
	static async SubscribeToSingleItem(id: string): Promise<Response> {
		const sessionId = await this.getSessionId();
		if (sessionId === null) {
			console.error("could not find sessionid in cookies");
			throw new Error("sessionid cannot be null");
		}

		return fetch("https://steamcommunity.com/sharedfiles/subscribe", {
			method: 'POST',
			headers: this.getBaseHeaders(),
			body: new URLSearchParams({
				'id': id,
				'appid': this.getAppId(),
				'sessionid': sessionId
			}),
			redirect: 'follow'
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
		.then(() => sendResponse("Item subscribed!"))
		.catch(error => console.log('error', error));
}

browser.runtime.onMessage.addListener(handleMessage);
