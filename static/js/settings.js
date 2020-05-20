(function () {
  "use strict";

  var dbName = "settings";
  var settings = new Array();
  chrome.storage.local.get(dbName, function (storage) {
    if (dbName in storage) {
      settings = storage[dbName];
      var preftab = settings[0].defaultTab;
      // $("#b_loader").hide();
    } else {
      storage = {};
      storage[dbName] = [
        {
          defaultTab: "tasks",
        },
      ];
      chrome.storage.local.set(
        storage,
        function () {
          // console.log("storage");
          // console.log(storage);
          // var preftab = settings.defaultTab;
          // console.log(preftab);
          // setDefaultView(preftab);
        }.bind(this)
      );
      // console.log("First Settings");
      settings = storage[dbName];
      preftab = settings[0].defaultTab;
      // console.log(preftab);
      // setDefaultView(preftab);
      // $("#b_loader").hide();
    }
    setDefaultView(preftab);
  });

  function setDefaultView(preftab) {
    if (preftab == "tasks") {
      $("#tasks").removeClass("hidden");
      $("#bookmarks").addClass("hidden");
    } else {
      $("#bookmarks").removeClass("hidden");
      $("#tasks").addClass("hidden");
    }
    $('#defaultViewToggle span[data-pref="' + preftab + '"]').removeClass(
      "hidden"
    );
  }

  function changeDefaultView(preftab) {
    console.log("update");
    chrome.storage.local.get([dbName], function (storage) {
      var settings = storage[dbName];

      for (let key in settings) {
        if (settings.hasOwnProperty(key)) {
          if (preftab != settings[key].defaultTab) {
            settings[key].defaultTab = preftab;
            break;
          }
        }
      }

      chrome.storage.local.set({ [dbName]: settings }, function () {
        //console.log(settings);
        setDefaultView(preftab);
      });
    });
  }

  $("#defaultViewToggle").click(function (e) {
    e.preventDefault();
    $("span", this).toggleClass("hidden");
    var preftab = $("span:not(.hidden)", this).data("pref");
    //console.log(preftab);
    changeDefaultView(preftab);
  });

  $("#ExportData").on("click", function (e) {
    // chrome.storage.local.get(carddb, function (storage) {
    //   if (carddb in storage) {
    //     cardarray = storage[carddb];

    // this.href = "data:application/json," + escape(JSON.stringify(localStorage));

    //   });

    chrome.storage.local.get(null, function (storage) {
      // null implies all items
      // Convert object to a string.
      //  var result = JSON.stringify(storage);

      // Save as file
      // var url =        "data:application/json;base64," + escape(JSON.stringify(storage));
      // chrome.downloads.download({
      //   url: url,
      //   filename: "mc_bkp.json",
      // });

      // var href = "data:application/json," + escape(JSON.stringify(storage));
      // $(".link-to-download").attr("href", href);
      // $(".link-to-download").attr(
      //   "download",
      //   `mission_backup_${Date.now()}.json`
      // );
      // $(".link-to-download")[0].click();

      let e = document.createElement("a");
      e.setAttribute(
        "href",
        `data:application/json;charset=utf-8,${escape(JSON.stringify(storage))}`
      );
      e.setAttribute("download", `mission_backup_${Date.now()}.json`);
      e.click();

      //  e.stopPropagation();
    });
  });

  // document.querySelector(".link-to-download").addEventListener(function () {
  //   chrome.storage.local.get(null, function (storage) {
  //     this.href = "data:application/json," + escape(JSON.stringify(storage));
  //     console.log(this.href);
  //   });
  // });
})();
