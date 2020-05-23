(function () {
  "use strict";

  // Calc Time Since for Github Last Sync
  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  var dbName = "settings";
  var settings = new Array();
  chrome.storage.local.get(dbName, function (storage) {
    if (dbName in storage) {
      settings = storage[dbName];
      var preftab = settings[0].defaultTab;
      // $("#b_loader").hide();

      // Fill Default Settings Value from Storage
      if (settings[0].git_token) $("#g__token").val(settings[0].git_token);
      if (settings[0].git_public)
        $("#g__public").prop("checked", settings[0].git_public);
      if (settings[0].last_sync)
        $("#last_sync_info").text(
          "Last Synced " + timeSince(new Date(settings[0].last_sync)) + " ago"
        );
      if (settings[0].gist_id) {
        $("#g__id")
          .val(settings[0].gist_id)
          .closest(".hidden")
          .removeClass("hidden");
        $("#g__public").prop("disabled", true);
      }
    } else {
      storage = {};
      storage[dbName] = [
        {
          defaultTab: "tasks",
          git_public: true,
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

  $("#g__token").on("keyup change paste input", function (e) {
    //console.log(this.value);
    if (this.value != "") {
      const new_token = this.value;
      chrome.storage.local.get(dbName, function (storage) {
        if (dbName in storage) {
          settings = storage[dbName];
          //console.log("keeeeee" + storage[dbName].git_token);

          for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
              settings[key].git_token = new_token;
            }
          }

          chrome.storage.local.set(storage, function () {}.bind(this));
        }
      });
    }
  });

  $("#g__public").on("change", function () {
    var ischecked = $(this).is(":checked");

    chrome.storage.local.get(dbName, function (storage) {
      if (dbName in storage) {
        settings = storage[dbName];
        //console.log("keeeeee" + storage[dbName].git_token);

        for (let key in settings) {
          if (settings.hasOwnProperty(key)) {
            if (!ischecked) {
              settings[key].git_public = false;
            } else {
              settings[key].git_public = true;
            }
          }
        }

        chrome.storage.local.set(storage, function () {}.bind(this));
      }
    });
  });

  $("#g__syncData").on("click", function (e) {
    e.preventDefault();
    $("#last_sync_info").text("Syncing...");
    exportToGithub();
  });

  $("#delete__existing_gist").on("click", function (e) {
    e.preventDefault();

    if (
      confirm(
        "Are you sure you want to delete this GIST ID?\nIt will not delete from Github.\nWe will create a new GIST next time you sync."
      )
    ) {
      chrome.storage.local.get(dbName, function (storage) {
        if (dbName in storage) {
          settings = storage[dbName];
          //console.log("keeeeee" + storage[dbName].git_token);

          for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
              settings[key].gist_id = "";
            }
          }

          chrome.storage.local.set(
            storage,
            function () {
              $("#g__id").val("");

              $("#g__public").prop("disabled", false);
            }.bind(this)
          );
        }
      });
    } else {
    }
  });

  function setDefaultView(preftab) {
    if (preftab == "tasks") {
      $("#tasks").addClass("active").removeClass("hidden");
      $("#bookmarks").addClass("hidden").removeClass("active");
    } else {
      $("#bookmarks").addClass("active").removeClass("hidden");
      $("#tasks").addClass("hidden").removeClass("active");
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

  $("#defaultViewToggle").on("click", function (e) {
    e.preventDefault();
    $("span", this).toggleClass("hidden");
    var preftab = $("span:not(.hidden)", this).data("pref");
    //console.log(preftab);
    changeDefaultView(preftab);
  });

  /*
   *
   * Download Data as JSON
   *
   */

  $("#download__as_json").on("click", function (e) {
    chrome.storage.local.get(null, function (storage) {
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
  /*
   *
   * Open Settings Page
   *
   */

  function showSettings() {
    if ($(this).hasClass("settings__is_open")) {
      $("#tasks.active, #bookmarks.active").removeClass("hidden");
      $(this).removeClass("settings__is_open");
      $("#settings").addClass("hidden");
      $("#defaultViewToggle").show();
    } else {
      $("#tasks, #bookmarks").addClass("hidden");
      $(this).addClass("settings__is_open");
      $("#settings").removeClass("hidden");
      $("#defaultViewToggle").hide();
    }
  }

  $("#showSettings").on("click", showSettings);

  /*
   *
   * Export To Github Gists
   *
   */

  function exportToGithub() {
    chrome.storage.local.get(null, function (storage) {
      if (dbName in storage) {
        settings = storage[dbName];
        const gittoken = settings[0].git_token;
        const gist_id = settings[0].gist_id;
        const git_public = settings[0].git_public;
        const sitesTasksArray = Object.keys(storage).reduce((object, key) => {
          if (key !== dbName) {
            object[key] = storage[key];
          }
          return object;
        }, {});

        console.log(sitesTasksArray);

        // const jsondata = escape(JSON.stringify(storage));
        // null , 4 used for formatting :)
        const jsondata = JSON.stringify(sitesTasksArray, null, 4);
        //console.log(jsondata);
        const escapeJSON = function (str) {
          return str
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
        };
        console.log(escapeJSON(jsondata));
        var ajsettings = {
          async: true,
          crossDomain: true,
          url: gist_id
            ? "https://api.github.com/gists/" + gist_id
            : "https://api.github.com/gists",
          method: "POST",
          headers: {
            Authorization: "Bearer " + gittoken,
            "content-type": "application/json;charset=utf-8",
            "cache-control": "no-cache",
            "postman-token": "a7ac1f6f-eb59-69ce-4907-9a58c89f6b5f",
          },
          processData: false,
          data: `{\r\n  "description": "Mission Control Chrome Extension Backup Data",\r\n  "public": "${git_public}",\r\n  "files": {\r\n    "mission_control_ext_bkp.json": {\r\n      "content": "${escapeJSON(
            jsondata
          )}"\r\n    }\r\n    }\r\n    }`,
        };

        $.ajax(ajsettings).done(function (response) {
          console.log(response);

          for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
              settings[key].gist_id = response.id;
              settings[key].last_sync = response.updated_at;
            }
          }
          console.log(storage);

          chrome.storage.local.set(
            storage,
            function () {
              $("#last_sync_info").text(
                "Last Synced " +
                  timeSince(new Date(settings[0].last_sync)) +
                  " ago"
              );
            }.bind(this)
          );
        });
      }
    });
  }
  // make it work on click after getting API
})();
