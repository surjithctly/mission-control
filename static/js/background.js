(function () {
  "use strict";

  chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create(
      { url: chrome.extension.getURL("index.html") },
      function (tab) {
        // Tab opened.
      }
    );
  });
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", "https://yahoo.com/", true);
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState == 4) {
  //     // JSON.parse does not evaluate the attacker's scripts.
  //     var title = /<title>(.*?)<\/title>/m.exec(xhr.responseText)[1];
  //     console.log(title);
  //   }
  // };
  // xhr.send();

  // chrome.runtime.onMessage.addListener(
  //   function(request, sender, sendResponse) {
  //     if (request.contentScriptQuery == "queryPrice") {
  //       var url = "https://another-site.com/price-query?itemId=" +
  //               encodeURIComponent(request.itemId);
  //       fetch(url)
  //           .then(response => response.text())
  //           .then(text => parsePrice(text))
  //           .then(price => sendResponse(price))
  //           .catch(error => ...)
  //       return true;  // Will respond asynchronously.
  //     }
  //   });
})();
