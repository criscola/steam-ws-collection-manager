/** Globals **/
const appId = 255710 // associated with Cities Skylines

// noinspection JSUnresolvedVariable
/** HTTP requests manipulation **/

function subscribeToItem(url) {
    console.log("subscribing to item...")
    // get cookies
    let sessionId;
    let cookies = getCookies()
    console.log("cookies: " + cookies)
    let cookiesHeader = "";

    for (let cookie in cookies) {
        cookiesHeader += `${cookie.name}:${cookie.value}; `
        // Needed in request body
        if (cookie.name === "sessionid") {
            sessionId = cookie.value
        }
    }

    let urlObj = new URL(url);
    let id = urlObj.searchParams.get("id");
    let body = `id=${id}&appId=${appId}&sessionid=${sessionId}`

    // construct post request
    // set headers and body

    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "https://steamcommunity.com/sharedfiles/subscribe", false);
    xhttp.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*");
    xhttp.setRequestHeader("Accept-Language", "en");
    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.setRequestHeader("X-Prototype-Version", "1.7");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    //xhttp.setRequestHeader("Origin", "https://steamcommunity.com");
    //xhttp.setRequestHeader("Referer", url);
    //xhttp.setRequestHeader("Cookie", cookiesHeader);
    xhttp.send(body)
    // check answer
}

async function getCookies() {
    console.log("getting cookies...");

    return await Promise.resolve(browser.cookies.getAll({url: "https://steamcommunity.com"}).then(function (cookies) {
        return cookies
    }));
}

/** Addon messaging **/

function handleMessage(request, sender, sendResponse) {
    console.log("received message on background");
    subscribeToItem(request.msg.args.url);
    sendResponse({ response: "OK" });
}

function logCookies(cookies) {
    for (let cookie of cookies) {
        console.log(cookie.value);
    }
}

browser.runtime.onMessage.addListener(handleMessage);

