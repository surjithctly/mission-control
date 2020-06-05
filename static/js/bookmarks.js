(function () {
  "use strict";

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
   * // Check if a String Valid URL
   * // Used to fetch Title from Link
   * -----------------------------------------------------------------------------------
   */

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

  /*
   * -----------------------------------------------------------------------------------
   * // Bookmark INPUT Function
   * // Functions to fetch Title
   * -----------------------------------------------------------------------------------
   */

  $("#bookmark_url").on("keyup change paste input", function (e) {
    if (this.value != "") {
      var url_result = validURL(this.value);
      if (url_result) {
        $("#bookmark_title").attr({
          disabled: true,
          placeholder: "Fetching Title... Please wait",
        });
        // Function declared as async so await can be used
        async function fetchContent() {
          // Instead of using fetch().then, use await
          let text = await $("#bookmark_url").val();

          // Inside the async function text is the request body
          getTitlefromURL(text);

          // Resolve this async function with the text
          return text;
        }

        // Use the async function
        var promise = fetchContent();
      }
    } else {
      //  Do Nothing
    }
  });

  /*
   * -----------------------------------------------------------------------------------
   * // Fetch <TITLE> from URL
   * // This requries manifest Persmission for <all_urls>
   * // content_security_policy also need to satisfy
   * -----------------------------------------------------------------------------------
   */

  function getTitlefromURL(url_result) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url_result, true);
    xhr.onreadystatechange = function () {
      $("#bookmark_title").attr({
        disabled: false,
        placeholder: "Enter Title",
      });
      if (xhr.readyState == 4 && xhr.responseText) {
        if (xhr.responseText.indexOf("<title>") != -1) {
          // console.log(xhr.responseText);
          var title = /<title>(.*?)<\/title>/m.exec(xhr.responseText)[1];
          console.log(title);
          addTitletoDom(title);
        } else {
          console.log(xhr.statusText);
          console.log("Title not found");
        }
      }
    };
    xhr.onerror = function (e) {
      console.log("xhr Fetch Error");
      //console.log(xhr.statusText);
    };
    xhr.send(null);
  }

  /*
   * -----------------------------------------------------------------------------------
   * // Add Fetched Title to DOM
   * // It will be blank if error or can't find title
   * -----------------------------------------------------------------------------------
   */

  function addTitletoDom(title) {
    if ($("#bookmark_title").val() === "" && $("#bookmark_url").val() !== "") {
      $("#bookmark_title").val(title);
      // console.log(this.value);
    }
  }

  /*
   * -----------------------------------------------------------------------------------
   * // CARD TEMPLATE
   * // USed in many Places to GENERATE CARD UI DOM
   * -----------------------------------------------------------------------------------
   */

  const newCardTemplate = ({ card_title, card_id, websites, starred }) => `

  <div
  class="js__bookamrk_card relative m-5 bg-white shadow-md w-1/5 h-25 ${
    starred ? "starred border-t-4 border-red-300" : ""
  }" data-card="${card_id}" data-star="${starred}">

  <div class="overflow__block  p-5  h-25 overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
  <div class="header flex  items-center mb-3 ">
  <input type="text" class="hidden js__card_title_input px-1 py-1 text-lg tracking-wide text-gray-700 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-64  mr-auto" plaseholder="Ente Card Titile" name="card_title" value="${card_title}">
  <p class="px-1 py-1 cursor-pointer text-gray-500 js__card_title_text text-lg tracking-wide mr-auto truncate w-64" title="Click to Edit">${card_title}</p>
  <div class="card__actions flex">
  <a href="#!" class="modal-open js__add_bookmark my-1 block w-6 h-6 p-1 bg-indigo-500 shadow-sm rounded-full overflow-hidden text-white" title="Add New Bookmark">
  <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg> </span></a>
  <div class="relative">
  <a href="#!" class="js__card_settings ml-2 my-1 block w-6 h-6  bg-white   shadow-sm rounded-full overflow-hidden text-gray-400 hover:text-indigo-400" title="Card Settings">
  <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
  </span>
  </a>
  <div class="js__card_menu hidden absolute right-0 mt-2 py-2 w-48 bg-white border rounded-lg shadow-xl">
      <a href="#" class="js__star_card block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
       <span class="hook_star ${
         starred ? "hidden" : ""
       }"><svg class="inline text-gray-400 stroke-current w-4 h-4 -mt-1 mr-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
       Star this Card    </span>
       <span class="hook_unstar ${
         !starred ? "hidden" : ""
       }"><svg class="inline text-gray-400 stroke-current w-4 h-4 -mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
       Un Star this Card    </span> 
       
       </a>
      <a href="#" class="js__rename_card block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"><span><svg class="inline text-gray-400 stroke-current w-4 h-4 -mt-1 mr-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> </span> Rename Card</a>
      <a href="#" class="js__delete_card block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"> <span><svg class="inline text-gray-400 stroke-current w-4 h-4 -mt-1 mr-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></span>Delete this Card</a>
    </div>
    
    </div>

    </div>

  </div>

  <div class="content">
  ${websites}
  </div>

  </div>
 
</div>


`;

  /*
   * -----------------------------------------------------------------------------------
   * // WEBSITE LIST TEMPLATE
   * // To use inside card Template.
   * -----------------------------------------------------------------------------------
   */

  const bookmarklist = ({
    bookmarks_id,
    bookmarks_title,
    bookmarks_url,
    bookmarks_desc,
  }) => `

<div class="item flex flex-row align-middle items-middle items-center hover:bg-gray-100 py-1 -mx-5 px-5"
data-id="${bookmarks_id}">

<div
    class="w-5 h-5 pt-05 "> 

<img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${
    new URL(bookmarks_url).origin
  }" alt="">  
</div>

<a href="${bookmarks_url}" target="_blank" class="js--bookmarks__title flex-1 text-sm ml-3 h-5 leading-snug mr-auto truncate"
    title="${bookmarks_desc}"> <span class="title">${bookmarks_title} </span>  <span class="link text-sm text-blue-500 hidden">
    ${bookmarks_url} </span>  <span class="bookmark__desc hidden">${bookmarks_desc}</span> </a>

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
   * // ON Page Load Setup
   * // It will Generate Cards on page load
   * -----------------------------------------------------------------------------------
   */

  var carddb = "sites";

  var cardarray = new Array();

  chrome.storage.local.get(carddb, function (storage) {
    if (carddb in storage) {
      cardarray = storage[carddb];
    } else {
      // user is first time or database not found
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

        var topbook = storage[carddb];

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

        chrome.storage.local.set(
          storage,
          function () {
            for (var i = 0; i < topbook.length; i++) {
              addSiteCards(topbook[i]);
            }
          }.bind(this)
        );
      });
    }

    //displaying the existing items (if user is not new user)
    for (var i = 0; i < cardarray.length; i++) {
      addSiteCards(cardarray[i]);
    }
  });

  /*
   * -----------------------------------------------------------------------------------
   * // Function to Add Cards to DOM
   * // It will fetch the Card Template from above
   * -----------------------------------------------------------------------------------
   */

  function addSiteCards(cardarray) {
    var websitelist = addSiteLists(cardarray.websites);

    $("#bookmark_cards").append(
      [
        {
          card_title: cardarray.label,
          card_id: cardarray.cid,
          starred: cardarray.starred,
          websites: websitelist,
        },
      ]
        .map(newCardTemplate)
        .join("")
    );
  }

  function addSiteLists(websites) {
    var websitelist = "";
    // console.log("websites");
    for (var i = 0; i < websites.length; i++) {
      //addSiteCards(cardarray[i]);
      websitelist =
        [
          {
            bookmarks_id: websites[i].id,
            bookmarks_title: websites[i].title,
            bookmarks_url: websites[i].url,
            bookmarks_desc: websites[i].desc,
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

  $("#bookmark_cards").on("click", ".remove", function () {
    var chosenID = $(this).closest(".item").data("id");
    var catID = $(this).closest(".js__bookamrk_card").data("card");
    removeItem(chosenID, catID);
    $(this).closest(".item").remove();
    console.log(chosenID, catID);
  });

  function removeItem(chosenID, catID) {
    console.log("removeitem");
    chrome.storage.local.get([carddb], function (storage) {
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

      chrome.storage.local.set({ [carddb]: siteList }, function () {
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
      chrome.storage.local.get([carddb], function (storage) {
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
              bookmarks_desc: newItem.desc,
            },
          ]
            .map(bookmarklist)
            .join("")
        );

        // $("#bookmarkMoreForm").addClass("hidden");

        chrome.storage.local.set({ [carddb]: siteList }, function () {
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

    chrome.storage.local.get([carddb], function (storage) {
      var newCat = {
        label: "Untitled Group",
        starred: false,
        id: 1,
        cid: randHex(24),
        date: new Date().getTime(),
        websites: [],
      };
      storage[carddb].unshift(newCat);
      console.log("adding New Category");
      console.log(storage);
      $("#addNewBookmarkUI").after(
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

      chrome.storage.local.set(
        storage,
        function () {
          console.log("cat added to db");
        }.bind(this)
      );

      var $recentcard = $("#bookmark_cards").find(
        '.js__bookamrk_card[data-card="' + newCat.cid + '"]'
      );
      $recentcard.find(".js__card_title_text").addClass("hidden");
      $recentcard
        .find(".js__card_title_input")
        .removeClass("hidden")
        .focus()
        .select();
    });
  });

  async function getClipboardContents() {
    try {
      console.log("Getting Clipboard Data");
      const clipboardData = await navigator.clipboard.readText();
      console.log(clipboardData);
      if (validURL(clipboardData)) {
        console.log("Clipboard Data is Calid URL");
        $("#bookmark_url").val(clipboardData);
        // disable Title field while fetching from URL
        $("#bookmark_title").attr({
          disabled: true,
          placeholder: "Fetching Title... Please wait",
        });
        getTitlefromURL(clipboardData);
        $("#bookmark_title").focus();
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  }

  function toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("modal-active");
    console.log("Toggle Modal");
    if (body.classList.contains("modal-active")) getClipboardContents();
  }

  // Card Dropdown

  $(document).on("click", ".js__add_bookmark", function (e) {
    e.preventDefault();
    var catID = $(this).closest(".js__bookamrk_card").data("card");
    $("#addBookmarkform #category_id").val(catID);
    toggleModal();
  });

  $("#bookmark_cards").on("click", ".js__card_settings", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".js__card_menu").not($(this).next(".js__card_menu")).addClass("hidden");
    $(this).next(".js__card_menu").toggleClass("hidden");
  });

  $(document).on("click", function (e) {
    $(".js__card_menu").addClass("hidden");
  });

  $("#bookmark_cards").on("click", ".js__delete_card", function (e) {
    var $this = $(this).closest(".js__bookamrk_card");
    var cardid = $($this).data("card");
    var totalsites = $(".item", $this).length;
    if (
      confirm(
        "Are you sure you want to delete this card?\nIt contains " +
          totalsites +
          " websites.\nThere's no UNDO!"
      )
    ) {
      removeCards(cardid);
    } else {
    }
  });

  // Remove Card & its Contents

  function removeCards(cardid) {
    console.log("removeitem");
    chrome.storage.local.get([carddb], function (storage) {
      var siteList = storage[carddb];
      console.log(siteList);
      var siteList = $.grep(siteList, function (e) {
        // console.log(e.id);
        return e.cid != cardid;
      });
      console.log(siteList);
      //   tasksList = storage[dbName];
      //   tasksList.splice(itemIndex, 1);
      //   console.log("new list", tasksList);

      chrome.storage.local.set({ [carddb]: siteList }, function () {
        console.log(siteList);
        $('.js__bookamrk_card[data-card="' + cardid + '"]').remove();
      });
    });
  }

  //  RENAME CARD LABEL

  $("#bookmark_cards").on("click", ".js__rename_card", function (e) {
    var $closestcard = $(this).closest(".js__bookamrk_card");
    $closestcard.find(".js__card_title_text").addClass("hidden");
    $closestcard.find(".js__card_title_input").removeClass("hidden").focus();
  });

  $("#bookmark_cards").on("click", ".js__card_title_text", function (e) {
    var $closestcard = $(this).closest(".js__bookamrk_card");
    $closestcard.find(".js__card_title_text").addClass("hidden");
    $closestcard.find(".js__card_title_input").removeClass("hidden").focus();
  });

  $("#bookmark_cards").on("keypress", ".js__card_title_input", function (e) {
    var cardtitle = $(this).val();
    var curcardval = $(this).next(".js__card_title_text").text();
    var catid = $(this).closest(".js__bookamrk_card").data("card");
    if (e.which == 13 && cardtitle !== "") {
      e.preventDefault();
      if (curcardval !== cardtitle) {
        changeCardTitle(cardtitle, catid);
        console.log(cardtitle);
      }
      $(this).addClass("hidden");
      $(this)
        .next(".js__card_title_text")
        .text(cardtitle)
        .removeClass("hidden");
    }
  });

  $("#bookmark_cards").on("blur", ".js__card_title_input", function (e) {
    var cardtitle = $(this).val();
    var curcardval = $(this).next(".js__card_title_text").text();
    var catid = $(this).closest(".js__bookamrk_card").data("card");
    if (curcardval !== cardtitle) {
      changeCardTitle(cardtitle, catid);
      console.log(cardtitle);
    }
    $(this).addClass("hidden");
    $(this).next(".js__card_title_text").text(cardtitle).removeClass("hidden");
  });

  // $("#bookmark_cards").on("blur", ".js__card_title_input", function (e) {
  //   $(this).addClass("hidden");
  //   $(this).next(".js__card_title_text").removeClass("hidden");
  // });

  function changeCardTitle(cardtitle, catid) {
    console.log("cardtitle: " + cardtitle);

    chrome.storage.local.get([carddb], function (storage) {
      var siteList = storage[carddb];

      for (let key in siteList) {
        if (siteList.hasOwnProperty(key)) {
          if (catid === siteList[key].cid) {
            if (cardtitle === siteList[key].label) {
              // do nothing
            } else {
              siteList[key].label = cardtitle;
            }
            break;
          }
        }
      }

      chrome.storage.local.set({ [carddb]: siteList }, function () {
        console.log(siteList);
      });
    });
  }

  /*
   * -----------------------------------------------------------------------------------
   * // Star a Card
   * -----------------------------------------------------------------------------------
   */

  $("#bookmark_cards").on("click", ".js__star_card", function (e) {
    e.preventDefault();
    var $closestcard = $(this).closest(".js__bookamrk_card");
    var starred = $closestcard.attr("data-star");
    var catid = $closestcard.data("card");
    starredCard(starred, catid);
    if (starred !== "false") {
      $(this).find("span").addClass("hidden");
      $(this).find(".hook_star").removeClass("hidden");
      $closestcard.removeClass("starred border-t-4 border-red-300");
      $closestcard.attr("data-star", false);
    } else if (starred !== "true") {
      $(this).find("span").addClass("hidden");
      $(this).find(".hook_unstar").removeClass("hidden");
      $closestcard.addClass("starred border-t-4 border-red-300");
      $closestcard.attr("data-star", true);
    }
    // return;
    //  console.log(starred);
  });

  function starredCard(starred, catid) {
    console.log("starring ");
    console.log(starred);
    chrome.storage.local.get([carddb], function (storage) {
      var siteList = storage[carddb];

      for (let key in siteList) {
        if (siteList.hasOwnProperty(key)) {
          if (catid === siteList[key].cid) {
            if (siteList[key].starred === true) {
              siteList[key].starred = false;
            } else {
              siteList[key].starred = true;
            }
            break;
          }
        }
      }

      chrome.storage.local.set({ [carddb]: siteList }, function () {
        console.log(siteList);
      });
    });
  }

  // Search Bookmarks

  function searchWebsites() {
    var $input = $("input[name='search']"),
      $context = $("#bookmark_cards");
    $input.on("input", function () {
      var term = $(this).val();
      console.log($context);
      $context.find(".js__bookamrk_card .item").show().unmark();
      $context.find(".js__bookamrk_card").show().unmark();
      $context.find(".js__bookamrk_card").removeClass("category-matched");
      if (term) {
        $context.mark(term, {
          done: function () {
            const promise1 = new Promise((resolve, reject) => {
              $context
                .find(".js__bookamrk_card .header p")
                .find("mark")
                .closest(".js__bookamrk_card")
                .addClass("category-matched");
              resolve();
            });

            promise1.then(() => {
              $context
                .find(".js__bookamrk_card:not(.category-matched)")
                .find(".item")
                .not(":has(mark)")
                .hide();
              console.log("i;m workin");
              // expected output: "Success!"
            });

            $context.find(".js__bookamrk_card").not(":has(mark)").hide();

            // $context.not(":has(mark)").hide();
          },
        });
      }
    });
  }

  searchWebsites();

  // SORT or RE-ORDER CARDS

  //const event1 = { newIndex: 1, oldIndex: 0 };
  //var originalArray;

  function sortSiteCards(newindex, oldindex) {
    chrome.storage.local.get([carddb], function (storage) {
      const originalArray = storage[carddb];
      const event1 = { newIndex: newindex, oldIndex: oldindex };
      console.log(originalArray);
      var newCardorder = reorderArray(event1, originalArray);
      chrome.storage.local.set({ [carddb]: newCardorder }, function () {
        console.log(newCardorder);
      });
    });
  }

  const reorderArray = (event, originalArray) => {
    const movedItem = originalArray.filter(
      (item, index) => index === event.oldIndex
    );
    const remainingItems = originalArray.filter(
      (item, index) => index !== event.oldIndex
    );

    const reorderedItems = [
      ...remainingItems.slice(0, event.newIndex),
      movedItem[0],
      ...remainingItems.slice(event.newIndex),
    ];

    return reorderedItems;
  };

  var el = document.getElementById("bookmark_cards");
  var sortable = Sortable.create(el, {
    draggable: ".js__bookamrk_card",
    filter: ".card__actions, .header, .item ",
    animation: 150,
    ghostClass: "item__is__dragging",
    forceFallback: true,
    onEnd: function (/**Event*/ evt) {
      console.log("newidex:" + (evt.oldIndex - 1));
      console.log("newidex:" + (evt.newIndex - 1));
      var newIndex = evt.newIndex - 1;
      var oldIndex = evt.oldIndex - 1;
      sortSiteCards(newIndex, oldIndex);
      // same properties as onEnd
    },
  });

  /*
   * FILTER Bookmark Cards by Starred or Show All
   */

  $("#filter__site_cards button").on("click", function () {
    // do
    if ($(this).is("#filter__by_starred")) {
      $(".js__bookamrk_card:not(.starred)").addClass("hidden");
      $("#filter__site_cards button").removeClass("toggle__active");
      $(this).addClass("toggle__active");
    } else {
      $(".js__bookamrk_card").removeClass("hidden");
      $("#filter__site_cards button").removeClass("toggle__active");
      $(this).addClass("toggle__active");
    }
  });

  // Process Current Chrome Bookmarks as Folder
  // Todo for later

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

  // process bookmarke
})();
