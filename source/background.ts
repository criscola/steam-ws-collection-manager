import Cookie = browser.cookies.Cookie;
class SteamApi {
	private static readonly APP_ID: "255710";

	static async SubscribeToSingleItem(id: string): Promise<Response> {
		const sessionId = await this.getSessionId();
		if (sessionId === null) {
			console.error("could not find sessionid in cookies");
			throw new Error("sessionid cannot be null");
		}
		const rawBody = this.formatRequestBody(id, sessionId);

		return fetch("https://steamcommunity.com/sharedfiles/subscribe", {
			method: 'POST',
			headers: this.getBaseHeaders(),
			body: rawBody,
			redirect: 'follow'
		});
	}

	static SubscribeToCollection() {

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
	/*
	private static getBaseRequest(method: string, body: string): Request {
		let baseHeaders = this.getBaseHeaders();

		return new Request("https://steamcommunity.com/sharedfiles/subscribe", {
			method: method,
			headers: baseHeaders,
			body: body,
			redirect: 'follow',
		});
	}*/

	private static async getSessionId(): Promise<string | null> {
		const cookies = await getCookies();
		console.log(cookies);
		return cookies.find(i => i.name === "sessionid")?.value ?? null;
	}

	private static formatRequestBody(itemId: string, sessionId: string): string {
		return "id="+itemId+"&appid="+SteamApi.APP_ID+"&sessionid="+sessionId;

	}

	/*
	private static getItemIdFromUrl(url: string) {
		const urlObj = new URL(url);
		return urlObj.searchParams.get("id");
	}*/

	/*
	private static formatCookieHeader(cookies: Cookie[]): string {
		let cookiesHeader = "";
		for (let cookie: Cookie in cookies) {
			cookiesHeader += `${cookie.name}:${cookie.value}; `
			// Needed in request body
			if (cookie.name === "sessionid") {
				sessionId = cookie.value
			}
		}
	}*/
}

async function getCookies() {
	return browser.cookies.getAll({url: "https://steamcommunity.com"});
}

// TODO: Implement connection-based instead of one-off
function handleMessage(request, _, sendResponse) {
	console.log("Message from the content script: ");
	console.log(request.msg[0].id);
	/*
	Promise.resolve(SteamApi.SubscribeToSingleItem(request.msg[0].id))
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	*/
	SteamApi.SubscribeToSingleItem(request.msg[0].id)
		.then(response => response.text())
		.then(result => console.log(result))
		.then(() => sendResponse("Item subscribed!"))
		.catch(error => console.log('error', error));
}

browser.runtime.onMessage.addListener(handleMessage);
