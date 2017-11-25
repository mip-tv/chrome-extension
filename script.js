chrome.browserAction.onClicked.addListener(function (activeTab) {
    var newURL = "startbootstrap-sb-admin-gh-pages/index.html";
    chrome.tabs.create({
        url: newURL
    });

});