chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    sendResponse({
        closeTrans: typeof localStorage.closeTrans == 'undefined' ? 0 : localStorage.closeTrans,
        hiddenDelay: typeof localStorage.hiddenDelay == 'undefined' ? 3 : localStorage.hiddenDelay
    });
});