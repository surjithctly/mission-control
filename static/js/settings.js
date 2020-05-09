(function () {
  "use strict";

  var dbName = "settings";
  var settings = new Array();
  chrome.storage.sync.get(dbName, function (storage) {
    if (dbName in storage) {
      settings = storage[dbName];
      // $("#b_loader").hide();
    } else {
      storage = {};
      storage[dbName] = [
        {
          defaultTab: "tasks",
        },
      ];
      chrome.storage.sync.set(storage, function () {}.bind(this));
      // $("#b_loader").hide();
    }
    console.log(settings);
    var preftab = settings[0].defaultTab;
    //displaying the old items
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
    chrome.storage.sync.get([dbName], function (storage) {
      var settings = storage[dbName];

      for (let key in settings) {
        if (settings.hasOwnProperty(key)) {
          if (preftab != settings[key].defaultTab) {
            settings[key].defaultTab = preftab;
            break;
          }
        }
      }

      chrome.storage.sync.set({ [dbName]: settings }, function () {
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
})();
