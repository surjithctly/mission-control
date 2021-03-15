(function () {
  "use strict";

  //   chrome.runtime.onInstalled.addListener(function () {
  //     chrome.storage.local.set({ color: "#3aa757" }, function () {
  //       console.log("The color is green.");
  //     });
  //   });

  //   storage["todo_list"] = { todos: [] };

  //   chrome.storage.local.get(dbName, function (storage) {
  //     // optional callback
  //     console.log(d);
  //     if (dbName in storage) {
  //     }
  //   });

  //   chrome.storage.local.get(dbName, function (storage) {
  //     var todos = storage[dbName];
  //   });

  //   if (storage["todo_list"]) {
  //     chrome.storage.local.set(storage, function () {
  //       // optional callback
  //       console.log("ok");
  //     });
  //   }
  // When the enter key is pressed fire the addItem method.

  /*
   * -----------------------------------------------------------------------------------
   * // SET UNSAVED TO TRUE
   * // To Sync with Github
   * -----------------------------------------------------------------------------------
   */

  function setUnsavedChanges() {
    //console.log("inside setUnsavedChanges");
    chrome.storage.local.get("settings", function (storage) {
      // console.log("hey", storage);
      const settings = storage.settings;
      // console.log("hooy", settings);
      // console.log(settings);
      for (let key in settings) {
        // console.log("kye" + key);
        if (settings.hasOwnProperty(key)) {
          settings[key].unsaved_changes = true;
        }
      }

      chrome.storage.local.set({ settings }, function () {
        // do nothing
        console.log("done");
      });
    });
  }
  /*
   * -----------------------------------------------------------------------------------
   * // TASKS / TODAY Function
   * //
   * -----------------------------------------------------------------------------------
   */
  //   var storage = {};
  var dbName = "todo_list";
  var tasksList = new Array();
  chrome.storage.local.get(dbName, function (storage) {
    if (dbName in storage) {
      tasksList = storage[dbName];
      $("#loader").hide();
    } else {
      storage = {};
      storage[dbName] = [];
      chrome.storage.local.set(storage, function () {}.bind(this));
      $("#loader").hide();
    }
    console.log(tasksList);
    //displaying the old items
    for (var i = 0; i < tasksList.length; i++) {
      addListItem(tasksList[i]);
    }
  });

  $("#todo_title").on("keypress", function (e) {
    var title = $("#todo_title").val();
    if (e.which == 13 && title != "") {
      e.preventDefault();

      var newItem = {
        title: title.trim(),
        completed: 0,
        id: new Date().getTime(),
      };
      addListItem(newItem);

      tasksList.push(newItem);

      //reset value
      $("#todo_title").val("");

      chrome.storage.local.set({ [dbName]: tasksList }, function () {
        console.log(tasksList);
      });

      //   addItem(e);
      //   console.log("You pressed enter!");
    }
  });

  const TaskTemplate = ({ task_id, task_completed, task_title }) => `

  <div class="item flex flex-row align-middle items-middle items-center hover:bg-gray-100 py-1 -mx-5 px-5 ${task_completed}"
  data-id="${task_id}">

  <div
      class="checkbox border border-gray-400 rounded-sm w-5 h-5 bg-gray-100 cursor-pointer hover:bg-white">
      <svg id="check-icon" class="check-icon" fill="none" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7"></path>
      </svg>
  </div>

  <h3 contenteditable="true" id="js--task__title" class="flex-1 text-xl ml-3 h-8 leading-snug mr-auto truncate"
      title="${task_title}">${task_title}</h3>

  <div class="remove w-5 h-5-"><a href="#!">
          <svg class="text-gray-400" fill="none" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="2" stroke="currentColor"
              viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
      </a></div>


</div>


`;

  function addListItem(tasksList) {
    // $("#showtasklist").prepend(
    //   '    <div data-id="' +
    //     tasksList.id +
    //     '" class="item ' +
    //     (tasksList.completed == 0 ? "active" : "completed") +
    //     ' ">  <div class="ui checkbox">  <input type="checkbox" tabindex="0" class="hidden">  <label>' +
    //     tasksList.title +
    //     '</label>  </div> <a href="#!"><i class="close icon right floated">X</i></a><div class="content">  </div> </div> '
    // );

    $("#showtasklist").prepend(
      [
        {
          task_id: tasksList.id,
          task_completed: tasksList.completed == 0 ? "active" : "completed",
          task_title: tasksList.title,
        },
      ]
        .map(TaskTemplate)
        .join("")
    );

    $("#loader").hide();
  }

  $("#showtasklist").on("click", "a", function () {
    var chosenID = $(this).closest(".item").data("id");
    removeItem(chosenID);
    $(this).closest(".item").remove();
    console.log(chosenID);
  });

  $("#showtasklist").on("click", ".checkbox", function () {
    var chosenID = $(this).closest(".item").data("id");
    //removeItem(chosenID);
    updateItem(chosenID);
    $(this).closest(".item").toggleClass("completed");
    //console.log(chosenID);
  });

  function removeItem(chosenID) {
    console.log("removeitem");
    chrome.storage.local.get([dbName], function (storage) {
      var tasksList = storage[dbName];
      var NewtasksList = $.grep(tasksList, function (e) {
        // console.log(e.id);
        return e.id != chosenID;
      });
      console.log(NewtasksList);
      //   tasksList = storage[dbName];
      //   tasksList.splice(itemIndex, 1);
      //   console.log("new list", tasksList);

      chrome.storage.local.set({ [dbName]: NewtasksList }, function () {
        console.log(NewtasksList);
      });
    });
  }

  function updateItem(chosenID) {
    console.log("update");
    chrome.storage.local.get([dbName], function (storage) {
      var tasksList = storage[dbName];

      for (let key in tasksList) {
        if (tasksList.hasOwnProperty(key)) {
          if (chosenID === tasksList[key].id) {
            if (0 === tasksList[key].completed) {
              tasksList[key].completed = 1;
            } else {
              tasksList[key].completed = 0;
            }
            break;
          }
        }
      }

      chrome.storage.local.set({ [dbName]: tasksList }, function () {
        console.log(tasksList);
      });
    });
  }

  $("#showtasklist").on("keypress", "#js--task__title", function (e) {
    var newTitle = $("#js--task__title").text();
    var chosenID = $(this).closest(".item").data("id");
    if (e.which == 13 && newTitle != "") {
      e.preventDefault();
      changeTitle(newTitle, chosenID);
      $(this).blur();
    }
  });

  function changeTitle(newTitle, chosenID) {
    console.log("newTitle: " + newTitle);

    chrome.storage.local.get([dbName], function (storage) {
      var tasksList = storage[dbName];

      for (let key in tasksList) {
        if (tasksList.hasOwnProperty(key)) {
          if (chosenID === tasksList[key].id) {
            if (newTitle === tasksList[key].title) {
              // do nothing
            } else {
              tasksList[key].title = newTitle;
            }
            break;
          }
        }
      }

      chrome.storage.local.set({ [dbName]: tasksList }, function () {
        console.log(tasksList);
      });
    });
  }

  // // UI Changes

  // $(".ui.checkbox").checkbox();
  // // End UI Changes

  // $("#showtasklist").on("click", ".ui.checkbox", function () {
  //   if ($(this).hasClass("checked")) {
  //     $(this).closest(".item").addClass("completed");
  //   } else {
  //     $(this).closest(".item").removeClass("completed");
  //   }
  // });

  //   function addItem(e) {
  //     var title = $("#todo_title").val();

  //     var callback = callback || function () {};

  //     var newItem = {
  //       title: title.trim(),
  //       completed: 0,
  //       id: new Date().getTime(),
  //     };

  //     Store(newItem, callback);
  //     console.log("here!");
  //   }

  //   function Store(newItem, callback) {
  //     var data;
  //     console.log("storing!");
  //     callback = callback || function () {};

  //     chrome.storage.local.get(
  //       dbName,
  //       function (storage) {
  //         if (dbName in storage) {
  //           callback.call(this, storage[dbName].todos);
  //           console.log("saveTodos!");

  //           var todos = storage[dbName].todos;
  //           saveTodos(newItem, todos);
  //         } else {
  //           storage = {};
  //           storage[dbName] = { todos: [] };
  //           console.log("nope!");
  //           chrome.storage.local.set(
  //             storage,
  //             function () {
  //               callback.call(this, storage[dbName].todos);
  //             }.bind(this)
  //           );
  //         }
  //       }.bind(this)
  //     );
  //   }

  //   function saveTodos(newItem, todos) {
  //     todos.push(newItem);
  //     chrome.storage.local.set(
  //       storage,
  //       function () {
  //           //callback.call(this, [newItem]);

  //       }.bind(this)
  //     );
  //   }

  //   testChromeStorage();

  //   function testChromeStorage() {
  //     console.log("Saving");
  //     chrome.storage.local.set({ value: "theValue" }, function () {
  //       console.log("Settings saved");
  //     });
  //     chrome.storage.local.get("value", function (retVal) {
  //       console.log("Got it? " + retVal.value);
  //     });
  //     }
})();
