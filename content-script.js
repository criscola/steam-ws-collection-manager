/** Information retrieval **/

function getCategoryFromDesc() {
    let desc = document.getElementById("highlightContent").textContent;
    if (desc.includes("high density commercial")) {
        return "high density commercial";
    }
}

/** Events **/

function onSpecialSubClick() {
    let cat = getCategoryFromDesc();

    if (cat !== undefined) {
        alert("The element was added to: " + cat);
        sendMsgToBkgScript({
            action: "subscribe",
            args: { category: cat, url: window.location.href }
        });
    } else {
        alert("Couldn't find appropriate collection for item");
    }
}

/** Addon messaging **/

function sendMsgToBkgScript(msg) {
    console.log("Sending message to background script")
    let sending = browser.runtime.sendMessage({msg});
    sending.then(handleResponse, handleError)
}

function handleResponse(message) {
    console.log(`Message from the background script: ${message.response}`);
    //console.log("Response: ")
    //console.log(message.response);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

/** Execution code **/

let test = document.createElement('button');
test.addEventListener("click", onSpecialSubClick);

test.textContent = "special subscribe";

document.getElementsByClassName("game_area_purchase_game").item(0).appendChild(test);

