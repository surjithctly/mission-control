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
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Share this extension",
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
          title: "Add New Tasks for Today",
        },
        {
          completed: true,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Install Mission Control",
        },
      ];

      const tomorrowtasks = [
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
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Your Tasks for Tomorrow",
        },
      ];

      const latertasks = [
        {
          completed: false,
          id: randHex(24),
          date: new Date().getTime(),
          title: "Tasks without a deadline",
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
          showCompleted: true,
        },
        {
          label: "Next",
          starred: false,
          id: 2,
          cid: randHex(24),
          date: new Date().getTime(),
          tasks: tomorrowtasks,
          showCompleted: true,
        },
        {
          label: "Later",
          starred: false,
          id: 3,
          cid: randHex(24),
          date: new Date().getTime(),
          tasks: latertasks,
          showCompleted: true,
        },
      ];
      // push to the storage

      for (var i = 0; i < newCat.length; i++) {
        //newwebsites.push(i);
        storage[dbName].push(newCat[i]);
      }

      chrome.storage.local.set(
        storage,
        function () {
          // Render cards once added to DB
          for (var i = 0; i < newCat.length; i++) {
            //console.log(newCat[i]);
            addTaskCards(newCat[i]);
          }
        }.bind(this)
      );
      $("#loader").hide();
    }
    console.log(tasksList);
    //
    //displaying the existing items (if user is not new user)
    //
    for (var i = 0; i < tasksList.length; i++) {
      console.log(tasksList[i]);
      addTaskCards(tasksList[i]);
    }
  });
  $(document).on("keyup", ".js__todo-title", function (e) {
    var title = $(this).val();
    console.log(title);
    // if (e.which == 13 && title != "") {
    //   e.preventDefault();

    //   var newItem = {
    //     title: title.trim(),
    //     completed: 0,
    //     id: new Date().getTime(),
    //   };
    //   addListItem(newItem);

    //   tasksList.push(newItem);

    //   //reset value
    //   $("#todo_title").val("");

    //   chrome.storage.local.set({ [dbName]: tasksList }, function () {
    //     console.log(tasksList);
    //   });

    //   //   addItem(e);
    //   //   console.log("You pressed enter!");
    // }
  });

  const newCardTemplate = ({
    card_title,
    card_id,
    starred,
    tasks,
    showCompleted,
  }) => ` <!-- tasks Block -->
  <div class="js__tasks_card relative w-full sm:w-1/3 lg:w-1/3 m-5 bg-white shadow-md  h-25 ${
    starred ? "starred border-t-4 border-red-300" : ""
  } ${
    showCompleted ? "" : "hide_completed"
  }" data-card="${card_id}" data-star="${starred}" data-show-completed="${showCompleted}">

      <div
          class="p-5 overflow-y-auto scrolling-touch overflow__block h-25 scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray">

          <div class="header flex relative grabbable items-center mb-3 ">
          <span class="draggable-svg absolute text-gray-400 z-10 grabbable"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="17" viewBox="0 0 6 17" fill="none">
          <circle cx="1" cy="1" r="1" fill="currentcolor"/>
          <circle cx="1" cy="6" r="1" fill="currentcolor"/>
          <circle cx="1" cy="11" r="1" fill="currentcolor"/>
          <circle cx="1" cy="16" r="1" fill="currentcolor"/>
          <circle cx="5" cy="1" r="1" fill="currentcolor"/>
          <circle cx="5" cy="6" r="1" fill="currentcolor"/>
          <circle cx="5" cy="11" r="1" fill="currentcolor"/>
          <circle cx="5" cy="16" r="1" fill="currentcolor"/>
          </svg></span>
          <input type="text" class="hidden js__card_title_input px-1 py-1 text-lg tracking-wide text-gray-700 placeholder-gray-400  relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-64  mr-auto" plaseholder="Ente Card Titile" name="card_title" value="${card_title}">
          <p class="px-1 py-1 cursor-pointer text-gray-500 js__card_title_text text-lg tracking-wide mr-auto truncate w-64" title="Click to Edit">${card_title}</p>
          <div class="card__actions flex">
          <a href="#!" class="modal-open js__add_tasks my-1 block w-6 h-6 p-1 bg-indigo-500 shadow-sm rounded-full overflow-hidden text-white" title="Add New Task">
          <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg> </span></a>
          <div class="relative">
          <a href="#!" class="js__task_settings ml-2 my-1 block w-6 h-6  bg-white   shadow-sm rounded-full overflow-hidden text-gray-400 hover:text-indigo-400" title="Card Settings">
          <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </span>
          </a>
          <div class="js__task_menu hidden absolute right-0 mt-2 py-2 w-48 z-10 bg-white border rounded-lg shadow-xl">
          <a href="#" class="js__hide_completed block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
           <span class="hook_show_completed ${showCompleted ? "hidden" : ""}"> 
           <svg class="inline text-gray-400 stroke-current w-4 h-4 -mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
</svg>
           Show Completed  </span>
           <span class="hook_hide_completed ${!showCompleted ? "hidden" : ""}"> 
           <svg class="inline text-gray-400 stroke-current w-4 h-4 -mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
</svg>
           Hide Completed  </span> 
           
           </a> </div>

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

  <div class="item flex flex-row align-middle items-middle items-center  hover:bg-gray-100 py-2 -mx-5 px-5 ${task_completed}"
  data-id="${task_id}">

  <div
      class="checkbox border border-gray-400 rounded-full flex justify-center items-center w-6 h-6 bg-gray-100 text-black cursor-pointer hover:bg-white">
   

      <svg id="check-icon" class="check-icon" width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.65188 0.901926C8.81807 0.737186 9.04242 0.644471 9.27642 0.643826C9.51043 0.64318 9.73528 0.734656 9.90238 0.898476C10.0695 1.0623 10.1654 1.2853 10.1694 1.51927C10.1734 1.75324 10.0851 1.97938 9.92369 2.1488L5.18319 8.07443C5.10172 8.16218 5.00339 8.2326 4.89407 8.28149C4.78476 8.33037 4.66671 8.35671 4.54699 8.35892C4.42727 8.36114 4.30832 8.33919 4.19728 8.29439C4.08623 8.24959 3.98536 8.18285 3.90069 8.09818L0.759754 4.95605C0.672251 4.87451 0.602067 4.77619 0.553389 4.66694C0.504711 4.55769 0.478536 4.43976 0.476426 4.32017C0.474317 4.20059 0.496315 4.0818 0.541108 3.9709C0.585902 3.86001 0.652574 3.75927 0.737146 3.67469C0.821718 3.59012 0.922458 3.52345 1.03336 3.47866C1.14426 3.43386 1.26304 3.41186 1.38262 3.41397C1.50221 3.41608 1.62014 3.44226 1.72939 3.49094C1.83864 3.53961 1.93697 3.6098 2.0185 3.6973L4.50513 6.18274L8.62813 0.928051C8.63552 0.918883 8.64345 0.910159 8.65188 0.901926ZM7.55938 7.00567L8.65188 8.09818C8.73653 8.18267 8.83732 8.24925 8.94826 8.29394C9.0592 8.33863 9.178 8.36052 9.29757 8.35831C9.41716 8.35609 9.53506 8.32981 9.64427 8.28104C9.75347 8.23227 9.85173 8.162 9.93319 8.07443L14.6737 2.1488C14.7588 2.06473 14.8262 1.96436 14.8717 1.85368C14.9172 1.743 14.9399 1.62429 14.9385 1.50463C14.9371 1.38497 14.9116 1.26682 14.8636 1.15724C14.8155 1.04765 14.7458 0.948876 14.6587 0.866811C14.5716 0.784746 14.4689 0.721074 14.3567 0.679598C14.2444 0.638121 14.125 0.61969 14.0054 0.625406C13.8859 0.631122 13.7687 0.660868 13.661 0.712867C13.5532 0.764865 13.457 0.83805 13.3781 0.928051L9.25394 6.18274L8.678 5.60561L7.55819 7.00567H7.55938Z" fill="currentColor"/>
</svg>

  </div>

  <h3  class="js--task__title task__title flex-1 text-lg ml-3  leading-snug mr-auto truncate"
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
    console.log("here");
    $("#task_cards").append(
      [
        {
          card_title: taskarray.label,
          card_id: taskarray.cid,
          starred: taskarray.starred,
          tasks: tasklist,
          showCompleted: taskarray.showCompleted,
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

  /*
   * -----------------------------------------------------------------------------------
   * // Function to Add Tasks
   * //
   * -----------------------------------------------------------------------------------
   */

  $(document).on("click", ".js__add_tasks", function (e) {
    e.preventDefault();
    var catID = $(this).closest(".js__tasks_card").data("card");
    $("#addtaskform #task_category_id").val(catID);
    toggleModal();
  });

  function toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("modal-active");
    $("#addtaskform").toggleClass("hidden");
    $("#dynamicModalTitle").text("Add New task");
    $("#todo_title").focus();
    console.log("Toggle Modal");
  }

  /* END */
  /*
   * -----------------------------------------------------------------------------------
   * // Form Submit to Add Tasks
   * //
   * -----------------------------------------------------------------------------------
   */

  $("#addtaskform").on("submit", function (e) {
    e.preventDefault();
    var title = $("#todo_title").val();
    var task_time = $("#task_time :selected").val();
    var catID = $("#task_category_id").val();
    if (task_time != "" && title != "") {
      e.preventDefault();

      var newItem = {
        date: new Date().getTime(),
        id: randHex(24),
        title: title.trim(),
        time: task_time,
        completed: false,
      };

      chrome.storage.local.get([dbName], function (storage) {
        var tasksList = storage[dbName];
        //bookmarks.push(newItem);

        for (let key in tasksList) {
          if (tasksList.hasOwnProperty(key)) {
            if (catID === tasksList[key].cid) {
              if (tasksList[key].tasks) {
                console.log("tasks found in this cat");
                tasksList[key].tasks.push(newItem);
              }
              break;
            }
          }
        }

        //reset value
        $("#addtaskform")[0].reset();
        toggleModal();

        $('.js__tasks_card[data-card="' + catID + '"] .content').prepend(
          [
            {
              task_id: newItem.id,
              task_title: newItem.title,
              task_completed: newItem.completed ? "completed" : "active",
            },
          ]
            .map(TaskTemplate)
            .join("")
        );

        // $("#bookmarkMoreForm").addClass("hidden");

        chrome.storage.local.set({ [dbName]: tasksList }, function () {
          // console.log(siteList);
          // console.log("running submit");
          setUnsavedChanges();
        });
      });

      //   addItem(e);
      //   console.log("You pressed enter!");
    } else {
      alert("Fill all details");
    }
  });

  /* END */

  /*
   * -----------------------------------------------------------------------------------
   * // Card Actions
   * -----------------------------------------------------------------------------------
   */

  $("#task_cards").on("click", ".js__task_settings", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".js__task_menu").not($(this).next(".js__task_menu")).addClass("hidden");
    $(this).next(".js__task_menu").toggleClass("hidden");
  });

  $(document).on("click", function (e) {
    $(".js__task_menu").addClass("hidden");
  });

  /* END */

  /*
   * -----------------------------------------------------------------------------------
   * // Show / Hide Completed
   * -----------------------------------------------------------------------------------
   */

  $("#task_cards").on("click", ".js__hide_completed", function (e) {
    e.preventDefault();
    var $closestcard = $(this).closest(".js__tasks_card");
    var showCompleted = $closestcard.attr("data-show-completed");
    var catid = $closestcard.data("card");
    showCompletedCard(showCompleted, catid);
    if (showCompleted === "true") {
      $(this).find("span").addClass("hidden");
      $(this).find(".hook_show_completed").removeClass("hidden");
      $closestcard.attr("data-show-completed", false);
      $closestcard.addClass("hide_completed");
    } else if (showCompleted === "false") {
      $(this).find("span").addClass("hidden");
      $(this).find(".hook_hide_completed").removeClass("hidden");
      $closestcard.attr("data-show-completed", true);
      $closestcard.removeClass("hide_completed");
    }
    // return;
    //  console.log(showCompleted);
  });

  function showCompletedCard(showCompleted, catid) {
    console.log("show hide completed ");
    console.log(showCompleted);
    chrome.storage.local.get([dbName], function (storage) {
      var tasksList = storage[dbName];

      for (let key in tasksList) {
        if (tasksList.hasOwnProperty(key)) {
          if (catid === tasksList[key].cid) {
            tasksList[key].showCompleted = !tasksList[key].showCompleted;
            break;
          }
        }
      }

      chrome.storage.local.set({ [dbName]: tasksList }, function () {
        console.log(tasksList);
        setUnsavedChanges();
      });
    });
  }
  /*
   * -----------------------------------------------------------------------------------
   * // Double Click to Edit
   * -----------------------------------------------------------------------------------
   */

  $("#task_cards").on("dblclick", ".js--task__title", function (e) {
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  $(document).mouseup(function (e) {
    var container = $(".js--task__title");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $(".js--task__title").attr("contenteditable", "false");
    }
  });

  /* END */
  // ---------------------------------------------------------------------------------------------------------------------------
  // OLD SCRIPT
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
