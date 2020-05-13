(function () {
  "use strict";

  //  random hex string generator
  // used to provide unique ID
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

  //   var storage = {};
  var dbName = "bookmarks";
  var bookmarks = new Array();
  chrome.storage.sync.get(dbName, function (storage) {
    if (dbName in storage) {
      bookmarks = storage[dbName];
      $("#b_loader").hide();
    } else {
      storage = {};
      storage[dbName] = [];

      chrome.topSites.get((arr) => {
        // console.log(arr);

        for (var i = 0; i < arr.length; i++) {
          //  console.log(arr[i].title);
          //Do something
          var newItem = {
            title: arr[i].title,
            category: "Top Sites",
            id: randHex(24),
            date: new Date().getTime(),
            url: arr[i].url,
          };
          storage[dbName].push(newItem);
          bookmarks.push(newItem);
          // display after adding top sites for first time
          addBookmarkItem(arr[i]);
        }

        chrome.storage.sync.set(storage, function () {}.bind(this));
        $("#b_loader").hide();

        console.log(bookmarks);
      });
    }

    //displaying the old items
    for (var i = 0; i < bookmarks.length; i++) {
      addBookmarkItem(bookmarks[i]);
    }
  });

  const bookTemplate = ({
    bookmarks_id,
    bookmarks_category,
    bookmarks_title,
    bookmarks_url,
  }) => `

  <div class="item flex flex-row align-middle items-middle items-center hover:bg-gray-100 py-1 -mx-5 px-5 ${bookmarks_category}"
  data-id="${bookmarks_id}">

  <div
      class="w-5 h-5 bg-gray-100 cursor-pointer hover:bg-white"> 
  
  <img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmarks_url}" alt="">  
  </div>

  <a href="${bookmarks_url}" target="_blank" id="js--bookmarks__title" class="flex-1 text-xl ml-3 h-8 leading-snug mr-auto truncate"
      title="${bookmarks_title}"> <span class="title">${bookmarks_title} </span>  <span class="link text-sm text-blue-500 hidden">
      ${bookmarks_url} </span>   </a>

  <div class="remove w-5 h-5-"><a href="#!">
          <svg class="text-gray-400" fill="none" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="2" stroke="currentColor"
              viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
      </a></div>


</div>


`;

  function alersst(param) {
    alert("ok");
  }

  function addBookmarkItem(bookmarks) {
    $("#showBookmarks").prepend(
      [
        {
          bookmarks_id: bookmarks.id,
          bookmarks_category: bookmarks.category,
          bookmarks_title: bookmarks.title,
          bookmarks_url: bookmarks.url,
        },
      ]
        .map(bookTemplate)
        .join("")
    );

    $("#b_loader").hide();
  }

  $("#showBookmarks").on("mouseenter", "#js--bookmarks__title", function (e) {
    $("span.title", this).addClass("hidden");
    $("span.link", this).removeClass("hidden");
  });
  $("#showBookmarks").on("mouseleave", "#js--bookmarks__title", function (e) {
    $("span.link", this).addClass("hidden");
    $("span.title", this).removeClass("hidden");
  });

  // Process Chrome Bookmarks as Folder

  function process_bookmark(bookmarks, folder) {
    console.log(bookmarks);
    for (var i = 0; i < bookmarks.length; i++) {
      var bookmark = bookmarks[i];
      if (bookmark.url) {
        console.log(
          "bookmark: " +
            folder +
            " =  " +
            bookmark.title +
            " ~  " +
            bookmark.url
        );
      }

      if (bookmark.children) {
        process_bookmark(bookmark.children, bookmark.title);
      }
    }
  }

  // chrome.bookmarks.getTree(process_bookmark);

  function getTopSites() {
    var bookmarks = new Array();

    chrome.topSites.get((arr) => {
      // console.log(arr);

      for (var i = 0; i < arr.length; i++) {
        //  console.log(arr[i].title);
        //Do something
        var newItem = {
          title: arr[i].title,
          category: "General",
          id: randHex(24),
          date: new Date().getTime(),
          url: arr[i].url,
        };
        bookmarks.push(newItem);
      }

      //console.log(bookmarks);
      return bookmarks;
    });
  }

  getTopSites();

  // END ///// Process Chrome Bookmarks as Folder

  $("#bookmark_url").on("keyup change paste input", function (e) {
    // console.log(this.value);
    if (this.value != "") {
      // $("#bookmarkMoreForm").removeClass("hidden");
      var url_result = validURL(this.value);
      if (url_result) {
        // var xhr = new XMLHttpRequest();
        // xhr.open("GET", url_result, true);
        // xhr.onreadystatechange = function () {
        //   if (xhr.readyState == 4) {
        //     // JSON.parse does not evaluate the attacker's scripts.
        //     var title = /<title>(.*?)<\/title>/m.exec(xhr.responseText);
        //     console.log(title);
        //   }
        // };
        // xhr.send();

        // $(url_result)
        //   .promise()
        //   .done(function () {
        //     console.log(url_result);
        //     getTitlefromURL(url_result);
        //   });

        // url_result.then(function (url_result) {
        //   console.log(url_result);
        // });
        // doAjax(url_result);

        // Function declared as async so await can be used
        async function fetchContent() {
          // Instead of using fetch().then, use await
          // let content = await fetch("/");
          let text = await $("#bookmark_url").val();

          // Inside the async function text is the request body
          // console.log(text);
          getTitlefromURL(text);
          // Resolve this async function with the text
          return text;
        }

        // Use the async function
        var promise = fetchContent();

        // const run = async () => {
        //   const url_result = await url_result;
        //   getTitlefromURL(url_result);
        // };

        // getTitlefromURL(url_result);

        // $.ajax({
        //   url: "https://developer.chrome.com/extensions/runtime",
        //   async: true,
        //   success: function (data) {
        //     var matches = data.match(/<title>(.*?)<\/title>/);
        //     alert(matches[0]);
        //   },
        // });
      }
    } else {
      //  $("#bookmarkMoreForm").addClass("hidden");
    }
  });

  function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  function getTitlefromURL(url_result) {
    //  alert(url_result);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url_result, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.responseText) {
        if (xhr.responseText.indexOf("<title>") != -1) {
          var title = /<title>(.*?)<\/title>/m.exec(xhr.responseText)[1];

          console.log(title);
          addTitletoDom(title);
        } else {
          console.log("title not found;");
        }
      } else {
        //console.log(xhr);
      }
    };
    xhr.onerror = function (e) {
      console.log("xhr onerror");
      console.log(e);
    };
    xhr.send();
  }

  function addTitletoDom(title) {
    if ($("#bookmark_title").val() === "") {
      $("#bookmark_title").val(title);
      // console.log(this.value);
    }
  }

  $("#showBookmarks").on("click", "a", function () {
    var chosenID = $(this).closest(".item").data("id");
    removeItem(chosenID);
    $(this).closest(".item").remove();
    console.log(chosenID);
  });

  function removeItem(chosenID) {
    console.log("removeitem");
    chrome.storage.sync.get([dbName], function (storage) {
      var tasksList = storage[dbName];
      var NewtasksList = $.grep(tasksList, function (e) {
        // console.log(e.id);
        return e.id != chosenID;
      });
      console.log(NewtasksList);
      //   tasksList = storage[dbName];
      //   tasksList.splice(itemIndex, 1);
      //   console.log("new list", tasksList);

      chrome.storage.sync.set({ [dbName]: NewtasksList }, function () {
        console.log(NewtasksList);
      });
    });
  }

  // async function doAjax(url_result) {
  //   let result;

  //   try {
  //     result = await getTitlefromURL(url_result);

  //     return result;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // chrome.runtime.sendMessage(
  //   {contentScriptQuery: "queryPrice", itemId: 12345},
  //   price => ...);

  // end fn

  const newCardTemplate = ({ card_title, card_id, websites }) => `

  <div
  class="js__bookamrk_card m-5 bg-white p-5 shadow-md w-1/5 h-25 overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch" data-card="${card_id}">

  
  <div class="header flex  items-center mb-3 ">
  <p class="text-gray-500   text-lg tracking-wide mr-auto">${card_title}</p>
  <a href="#!" class="modal-open js__add_bookmark my-1 block w-6 h-6 p-1 bg-indigo-500 shadow-sm rounded-full overflow-hidden text-white" title="Add New Bookmark">
  <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg> </span></a>
  <a href="#!" class="ml-2 my-1 block w-6 h-6  bg-white   shadow-sm rounded-full overflow-hidden text-gray-400 hover:text-indigo-400" title="Add New Bookmark">
  <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span></a>
  </div>

  <div class="content">
  ${websites}
  </div>


</div>


`;

  const bookmarklist = ({ bookmarks_id, bookmarks_title, bookmarks_url }) => `

<div class="item flex flex-row align-middle items-middle items-center hover:bg-gray-100 py-1 -mx-5 px-5"
data-id="${bookmarks_id}">

<div
    class="w-5 h-5 bg-gray-100 cursor-pointer hover:bg-white"> 

<img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmarks_url}" alt="">  
</div>

<a href="${bookmarks_url}" target="_blank" class="js--bookmarks__title flex-1 text-xl ml-3 h-8 leading-snug mr-auto truncate"
    title="${bookmarks_title}"> <span class="title">${bookmarks_title} </span>  <span class="link text-sm text-blue-500 hidden">
    ${bookmarks_url} </span>   </a>

<div class="remove w-5 h-5-"><a href="#!">
        <svg class="text-gray-400" fill="none" stroke-linecap="round"
            stroke-linejoin="round" stroke-width="2" stroke="currentColor"
            viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    </a></div>


</div>


`;

  // TEST SECTION XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  var carddb = "sites";

  var cardarray = new Array();

  chrome.storage.sync.get(carddb, function (storage) {
    if (carddb in storage) {
      cardarray = storage[carddb];
      console.log(carddb);
      console.log(storage);
      console.log(cardarray);
    } else {
      storage = {};
      storage[carddb] = [];

      chrome.topSites.get((arr) => {
        var newCat = {
          label: "Top Sites",
          starred: false,
          id: 1,
          cid: randHex(24),
          date: new Date().getTime(),
          websites: {},
        };
        storage[carddb].push(newCat);

        console.log(storage);
        console.log(storage[carddb]);
        var topbook = storage[carddb];

        // console.log(topbook[websites]);
        var newwebsites = new Array();
        for (var i = 0; i < arr.length; i++) {
          var newItem = {
            title: arr[i].title,
            id: randHex(24),
            date: new Date().getTime(),
            url: arr[i].url,
            desc: "",
          };
          newwebsites.push(newItem);
        }

        for (let key in topbook) {
          if (topbook.hasOwnProperty(key)) {
            if (1 === topbook[key].id) {
              topbook[key].websites = newwebsites;
              break;
            }
          }
        }
        console.log(storage);

        chrome.storage.sync.set(storage, function () {}.bind(this));
      });
    }

    //displaying the old items
    for (var i = 0; i < cardarray.length; i++) {
      addSiteCards(cardarray[i]);
    }
  });

  function addSiteCards(cardarray) {
    var websitelist = addSiteLists(cardarray.websites);
    //console.log(websitelist);
    // for (var i = 0; i < cardarray.websites.length; i++) {
    //   //addSiteCards(cardarray[i]);

    //  // console.log(cardarray.websites[i].title);

    // }

    $("#bookmark_cards").prepend(
      [
        {
          card_title: cardarray.label,
          card_id: cardarray.cid,
          websites: websitelist,
        },
      ]
        .map(newCardTemplate)
        .join("")
    );
  }

  function addSiteLists(websites) {
    var websitelist = "";
    console.log("websites");
    console.log(websitelist);
    for (var i = 0; i < websites.length; i++) {
      //addSiteCards(cardarray[i]);
      websitelist =
        [
          {
            bookmarks_id: websites[i].id,
            bookmarks_title: websites[i].title,
            bookmarks_url: websites[i].url,
          },
        ]
          .map(bookmarklist)
          .join("") + websitelist;
    }

    return websitelist;
  }

  $("#bookmark_cards").on("mouseenter", ".js--bookmarks__title", function (e) {
    $("span.title", this).addClass("hidden");
    $("span.link", this).removeClass("hidden");
  });
  $("#bookmark_cards").on("mouseleave", ".js--bookmarks__title", function (e) {
    $("span.link", this).addClass("hidden");
    $("span.title", this).removeClass("hidden");
  });

  // ---
  // Remove Bookmark Items
  // ---

  $("#bookmark_cards").on("click", "a", function () {
    var chosenID = $(this).closest(".item").data("id");
    var catID = $(this).closest(".js__bookamrk_card").data("card");
    removeItem(chosenID, catID);
    $(this).closest(".item").remove();
    console.log(chosenID, catID);
  });

  function removeItem(chosenID, catID) {
    console.log("removeitem");
    chrome.storage.sync.get([carddb], function (storage) {
      var siteList = storage[carddb];
      console.log(siteList);

      for (let key in siteList) {
        if (siteList.hasOwnProperty(key)) {
          if (catID === siteList[key].cid) {
            if (siteList[key].websites) {
              console.log("sites found in this cat");
              // var result = siteList.websites.filter(i=>!i.errorMsg)

              // console.log(result)

              var NewsiteList = $.grep(siteList[key].websites, function (e) {
                // console.log(e.id);
                return e.id != chosenID;
              });
              siteList[key].websites = NewsiteList;
              //console.log(NewsiteList);
            }
            break;
          }
        }
      }

      //  console.log(siteList);

      chrome.storage.sync.set({ [carddb]: siteList }, function () {
        console.log(siteList);
      });
    });
  }

  // Adding Website to a Category Card
  // Inside Popup

  $("#addBookmarkform").on("submit", function (e) {
    e.preventDefault();
    var title = $("#bookmark_title").val();
    var getURL = $("#bookmark_url").val();
    var desc = $("#bookmark_desc").val();
    var catID = $("#category_id").val();
    if (getURL != "" && title != "") {
      e.preventDefault();

      var newItem = {
        date: new Date().getTime(),
        id: randHex(24),
        title: title.trim(),
        url: getURL,
        desc: desc,
      };
      // addBookmarkItem(newItem);
      chrome.storage.sync.get([carddb], function (storage) {
        var siteList = storage[carddb];
        //bookmarks.push(newItem);

        for (let key in siteList) {
          if (siteList.hasOwnProperty(key)) {
            if (catID === siteList[key].cid) {
              if (siteList[key].websites) {
                console.log("sites found in this cat");
                siteList[key].websites.push(newItem);
              }
              break;
            }
          }
        }

        //reset value
        $("#addBookmarkform")[0].reset();
        toggleModal();

        $('.js__bookamrk_card[data-card="' + catID + '"] .content').prepend(
          [
            {
              bookmarks_id: newItem.id,
              bookmarks_title: newItem.title,
              bookmarks_url: newItem.url,
            },
          ]
            .map(bookmarklist)
            .join("")
        );

        // $("#bookmarkMoreForm").addClass("hidden");

        chrome.storage.sync.set({ [carddb]: siteList }, function () {
          console.log(siteList);
        });
      });

      //   addItem(e);
      //   console.log("You pressed enter!");
    } else {
      alert("Fill all details");
    }
  });

  $("#addNewBookmarkUI").click(function (e) {
    e.preventDefault();

    chrome.storage.sync.get([carddb], function (storage) {
      var newCat = {
        label: "Untitled Group",
        starred: false,
        id: 1,
        cid: randHex(24),
        date: new Date().getTime(),
        websites: {},
      };
      storage[carddb].push(newCat);
      console.log("adding New Category");
      console.log(storage);
      $("#addNewBookmarkUI").before(
        [
          {
            card_title: newCat.label,
            card_id: newCat.cid,
            websites: newCat.websites,
          },
        ]
          .map(newCardTemplate)
          .join("")
      );

      chrome.storage.sync.set(
        storage,
        function () {
          console.log("cat added to db");
        }.bind(this)
      );
    });
  });

  function toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("modal-active");
  }
})();
