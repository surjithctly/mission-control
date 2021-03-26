// background.js
(function () {
  "use strict";

  chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      id: "AddpagetoBookmarks",
      title: "Add this Page to Mission Control",
      contexts: ["page"],
    });
    chrome.contextMenus.create({
      id: "AddLinktoBookmarks",
      title: "Add this link to Mission Control",
      contexts: ["link"],
    });
    chrome.contextMenus.create({
      id: "AddtoTasks",
      title: "Add as Task  in Mission Control",
      contexts: ["selection"],
    });
  });

  chrome.action.onClicked.addListener(handleBrowserActionClicked);

  function handleBrowserActionClicked(tab) {
    const opts = {
      url: chrome.runtime.getURL("index.html"),
    };
    chrome.tabs.create(opts, handleCallback);
  }

  chrome.alarms.create({ delayInMinutes: 0.1 });
  console.log("alarn");

  chrome.alarms.onAlarm.addListener(() => {
    console.log("alarm run");
    if (chrome.notifications) {
      console.log("yup run");
      show();
    }
  });

  // function show() {
  //   var opt = {
  //     iconUrl:
  //       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" +
  //       "AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO" +
  //       "9TXL0Y4OHwAAAABJRU5ErkJggg==",
  //     type: "basic",
  //     title: "Primary Title",
  //     message: "Primary message to display",
  //     priority: 1,
  //   };
  //   chrome.notifications.create(
  //     "1",
  //     {
  //       iconUrl:
  //         "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" +
  //         "AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO" +
  //         "9TXL0Y4OHwAAAABJRU5ErkJggg==",
  //       title: "This should be a notification",
  //       type: "basic",
  //       message: "Notification body",
  //       isClickable: true,
  //       priority: 2,
  //     },
  //     function (id) {
  //       console.log("Last error:", chrome.runtime.lastError);
  //     }
  //   );
  // }

  // items: [
  //   { title: "Item1", message: "This is item 1." },
  //   { title: "Item2", message: "This is item 2." },
  //   { title: "Item3", message: "This is item 3." },
  // ],

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
})();
