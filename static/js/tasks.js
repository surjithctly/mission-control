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
   * // Utils Functions
   * //  random hex string generator
   * // Used to provide unique ID to Cards & Sites
   * -----------------------------------------------------------------------------------
   */

  var randHex = function (len) {
    var maxlen = 8,
      min = Math.pow(16, Math.min(len, maxlen) - 1),
      max = Math.pow(16, Math.min(len, maxlen)) - 1,
      n = Math.floor(Math.random() * (max - min + 1)) + min,
      r = n.toString(16);
    while (r.length < len) {
      r = r + randHex(len - maxlen);
    }
    return r;
  };

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
  const dbName = "todo_list";
  let tasksList = new Array();
  chrome.storage.local.get(dbName, function (storage) {
    if (dbName in storage) {
      tasksList = storage[dbName];
      $("#loader").hide();
    } else {
      // user is first time or database not found
      storage = {};
      storage[dbName] = [];

      // sample Tasks to start with
      const todaytasks = [
        {
          completed: true,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Install Mission Control",
        },
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Add New Tasks for Today",
        },
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Add New Bookmarks",
        },
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Share this extension",
        },
      ];

      const tomorrowtasks = [
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Your Tasks for Tomorrow",
        },
        {
          completed: true,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Mark it as completed",
        },
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Try Drag & Drop",
        },
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Delete these tasks",
        },
      ];

      const latertasks = [
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Tasks without a date",
        },
        {
          completed: true,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Create as many cards you like",
        },
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "You may also backup to Github",
        },
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Organize your bookmarks",
        },
      ];

      // Create New Category
      var newCat = [
        {
          label: "Today",
          starred: false,
          id: 1,
          cid: randHex(24),
          date: new Date().getTime(),
          tasks: todaytasks,
        },
        {
          label: "Next",
          starred: false,
          id: 2,
          cid: randHex(24),
          date: new Date().getTime(),
          tasks: tomorrowtasks,
        },
        {
          label: "Later",
          starred: false,
          id: 3,
          cid: randHex(24),
          date: new Date().getTime(),
          tasks: latertasks,
        },
      ];
      // push to the storage

      for (var i = 0; i < newCat.length; i++) {
        //newwebsites.push(i);
        storage[dbName].push(newCat[i]);
      }

      chrome.storage.local.set(storage, function () {}.bind(this));
      $("#loader").hide();
    }
    console.log(tasksList);
    //displaying the old items
    for (var i = 0; i < tasksList.length; i++) {
      console.log(tasksList[i]);
      addTaskCards(tasksList[i]);
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

  const newCardTemplate = ({
    card_title,
    card_id,
    starred,
    tasks,
  }) => ` <!-- tasks Block -->
  <div class="js__tasks_card relative w-1/5 m-5 bg-white shadow-md  h-25 ${
    starred ? "starred border-t-4 border-red-300" : ""
  }" data-card="${card_id}" data-star="${starred}">

      <div
          class="p-5 overflow-y-auto scrolling-touch overflow__block h-25 scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray">

          <div class="content">
              <div class="header">
                  <p class="tracking-wide text-gray-400">${card_title}</p>


                  <div class="relative flex flex-wrap items-stretch w-full my-3 mb-5">
                      <span
                          class="absolute z-10 items-center justify-center w-8 h-full py-3 pl-3 text-base font-normal leading-snug text-center text-gray-400 bg-transparent rounded">
                          <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              stroke="currentColor" viewbox="0 0 24 24">
                              <path d="M12 4v16m8-8H4"></path>
                          </svg>
                      </span>
                      <input type="text" id="todo_title" name="todo_title" placeholder="Add new task..."
                          autocomplete="off"
                          class="relative w-full px-3 py-3 pl-10 text-sm text-gray-700 placeholder-gray-400 bg-white rounded shadow outline-none focus:outline-none focus:shadow-outline" />
                  </div>


              </div>
          </div>
          <div class="content">
              <div class="ui small feed">

                  <div class="relative">
<!--
                      <div class="text-center" id="loader">
                          <div class="inline-block w-8 h-8">
                              <div class="stroke-current"><svg class="text-red-200 stroke-current spinner"
                                      viewbox="0 0 50 50">
                                      <circle class="path" cx="25" cy="25" r="20" fill="none"
                                          stroke-width="5">
                                      </circle>
                                  </svg></div>
                          </div>
                      </div> -->

                      ${tasks}
                  </div>


              </div>
          </div>



      </div>
  </div>`;

  const TaskTemplate = ({ task_id, task_title, task_completed }) => `

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

  /*
   * -----------------------------------------------------------------------------------
   * // Function to Add Cards to DOM
   * // It will fetch the Card Template from above
   * -----------------------------------------------------------------------------------
   */

  function addTaskCards(taskarray) {
    var tasklist = addCardLists(taskarray.tasks);

    $("#task_cards").append(
      [
        {
          card_title: taskarray.label,
          card_id: taskarray.cid,
          starred: taskarray.starred,
          tasks: tasklist,
        },
      ]
        .map(newCardTemplate)
        .join("")
    );
  }

  function addCardLists(task) {
    var tasklist = "";
    // console.log("task");
    for (var i = 0; i < task.length; i++) {
      //addSiteCards(cardarray[i]);
      tasklist =
        [
          {
            task_id: task[i].id,
            task_title: task[i].title,
            task_completed: task[i].completed ? "completed" : "active",
          },
        ]
          .map(TaskTemplate)
          .join("") + tasklist;
    }
    return tasklist;
  }

  /* END */

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
