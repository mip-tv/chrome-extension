chrome.browserAction.onClicked.addListener(function (activeTab) {
    var newURL = "background.html";
    chrome.tabs.create({
        url: newURL
    });

});