(function () {
  "use strict";

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
      chrome.storage.sync.set(storage, function () {}.bind(this));
      $("#b_loader").hide();
    }
    console.log(bookmarks);
    //displaying the old items
    for (var i = 0; i < bookmarks.length; i++) {
      addBookmarkItem(bookmarks[i]);
    }
  });

  $("#addBookmarkform").on("submit", function (e) {
    e.preventDefault();
    var title = $("#bookmark_title").val();
    var getURL = $("#bookmark_url").val();
    if (getURL != "" && title != "") {
      e.preventDefault();

      var newItem = {
        title: title.trim(),
        category: "General",
        id: new Date().getTime(),
        url: getURL,
      };
      addBookmarkItem(newItem);

      bookmarks.push(newItem);

      //reset value
      $("#addBookmarkform")[0].reset();

      chrome.storage.sync.set({ [dbName]: bookmarks }, function () {
        console.log(bookmarks);
      });

      //   addItem(e);
      //   console.log("You pressed enter!");
    } else {
      alert("Fill all details");
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
      class=" border border-gray-400 rounded-sm w-5 h-5 bg-gray-100 cursor-pointer hover:bg-white">
      <img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmarks_url}" alt="favicon">
  </div>

  <a href="${bookmarks_url}" target="_blank" id="js--bookmarks__title" class="flex-1 text-xl ml-3 h-8 leading-snug mr-auto truncate"
      title="${bookmarks_title}"> <span class="title">${bookmarks_title} </span>  <span class="link text-sm text-blue-500 hidden">${bookmarks_url} </span>   </a>

  <div class="remove w-5 h-5-"><a href="#!">
          <svg class="text-gray-400" fill="none" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="2" stroke="currentColor"
              viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
      </a></div>


</div>


`;

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

  chrome.bookmarks.getTree(process_bookmark);

  chrome.topSites.get((arr) => {
    console.log(arr);
  });

  // end fn
})();
