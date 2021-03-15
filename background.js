// background.js
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Sample Context Menu",
    contexts: ["selection"],
  });
});

// (function () {
//   "use strict";

//   // chrome.browserAction.onClicked.addListener(function (tab) {
//   //   chrome.tabs.create(
//   //     { url: chrome.extension.getURL("index.html") },
//   //     function (tab) {
//   //       // Tab opened.
//   //     }
//   //   );
//   // });

//   chrome.contextMenus.create({
//     title: "Add this Website to Mission Control",
//     id: "mc-add",
//     contexts: ["all"],
//   });

//   chrome.contextMenus.onClicked.addListener(async (info, tab) => {
//     console.log(info);
//     console.log(tab);
//     const { menuItemId } = info;
//     if (menuItemId === "mc-add") {
//       console.log("yup");
//       await addToAWMT(info);
//     }
//   });

//   chrome.browserAction.onClicked.addListener(async (tab) => {
//     const { url } = tab;
//     addToAWMT({ webpage: url });
//   });

//   async function addToAWMT(info) {
//     const { srcUrl, selectionText, webpage } = info;
//     console.log("goko");
//     chrome.tabs.getSelected(null, (tab) => {
//       const source = tab.url;

//       if (srcUrl) {
//         console.log({ type: "Image", url: srcUrl, source });
//       }

//       if (selectionText) {
//         console.log({ content: selectionText, source });
//       }

//       if (webpage) {
//         console.log({ type: "WebPage", url: webpage, source });
//       }
//     });
//   }

//   // var xhr = new XMLHttpRequest();
//   // xhr.open("GET", "https://yahoo.com/", true);
//   // xhr.onreadystatechange = function () {
//   //   if (xhr.readyState == 4) {
//   //     // JSON.parse does not evaluate the attacker's scripts.
//   //     var title = /<title>(.*?)<\/title>/m.exec(xhr.responseText)[1];
//   //     console.log(title);
//   //   }
//   // };
//   // xhr.send();

//   // chrome.runtime.onMessage.addListener(
//   //   function(request, sender, sendResponse) {
//   //     if (request.contentScriptQuery == "queryPrice") {
//   //       var url = "https://another-site.com/price-query?itemId=" +
//   //               encodeURIComponent(request.itemId);
//   //       fetch(url)
//   //           .then(response => response.text())
//   //           .then(text => parsePrice(text))
//   //           .then(price => sendResponse(price))
//   //           .catch(error => ...)
//   //       return true;  // Will respond asynchronously.
//   //     }
//   //   });
// })();
