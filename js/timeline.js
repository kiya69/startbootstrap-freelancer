var news = [];

var container = document.getElementById("timeline"),
  list = document.createElement("ol"),
  collapseBtn = document.getElementById("collapse");

list.className = "timeline";
container.appendChild(list);


/** generate timeline list =============== **/

/** appendChildElement: 
 *   add a child element (ele) with content (txt) to a specific parent node (node) **/
var appendChildElement = function(cEle, cTxt, pNode) {
  var child = document.createElement(cEle);
  child.innerHTML = cTxt;
  pNode.appendChild(child);
};

var listItems = agendas.map(function(a) {
  var listItem = document.createElement("li");
  //var reg = /(10)([3-4].)/g,
  // date = a.date.replace(reg, ""); // use year of Taiwan

  appendChildElement("time", a.date, listItem);
  appendChildElement("title", a.desc, listItem);
  appendChildElement("div", a.keys, listItem);
  if (a.keys === "") listItem.childNodes[1].className += "no-hover";
  listItem.dataset.index = a.numb - 1;
  list.appendChild(listItem);

  return listItem;
});
/** =============== generate timeline list **/



/** animate by dates =============== **/
// debug: date format
var now = new Date(),
  today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
isToday = false;

function formatDateToAD(date) {
  var format = date.split("."),
    yearAD = parseInt(format[0]) + 1911,
    dateAD = new Date(yearAD, parseInt(format[1] - 1), format[2]);
  return dateAD;
}

function getClassNameByDate(index) {
  var className = "",
    date = agendas[index].date,
    dates = date.split("-"),
    dateAD;

  // case: date is a period
  if (dates[1] !== undefined) {
    date = dates[1];
  }

  // use AD year and Date() as format for comparison
  dateAD = formatDateToAD(date);

  // find today
  switch (true) {
    case dateAD < today:
      className = "date-passed";
      break;
    case dateAD - today === 0: //why dateAD === now is not working?
      className = "date-today";
      isToday = true;
      break;
    case dateAD > today:
      // case: date is a period
      if (dates[1] !== undefined && formatDateToAD(dates[0]) <= today) {
        className = "date-today";
        isToday = true;
      } else if (isToday === false) {
        className = "mark-today";
        isToday = true;
      }
      break;
    default:
      break;
  }

  // enable hover after animation  
  if (isToday) {
    document.getElementsByClassName("timeline")[0].classList.add("hover-li");
  }

  return className;
}

/**
 * Iteratively animate items and listen to the end of animation
 * for animating the next
 * index is the index of current item to animate in items
 * listItems is array of item
 **/
function animateItemIter(index, listItems) {
  var li = listItems[index],
    className = "",
    nextIter;
  //console.log("str: ", index);
  nextIter = function() {
    // detach as it's a one time event
    li.removeEventListener("transitionend", nextIter, false);
    animateItemIter(index + 1, listItems);
  };

  // if li exists
  if (li !== undefined) {
    className = getClassNameByDate(index);
    console.log("className" + className);
    if (className) {
      li.classList.add(className);
      li.addEventListener("transitionend", nextIter, false);
    }
  }
}

// start animation with first list item
// setTimeout(function(){
//   animateItemIter(0, listItems);

// add go-voting class to the header  
//   document.getElementsByTagName("li")[13].childNodes[1].classList.add("go-vote");
// }, 100);
/** =============== animation by date **/



/** rss news feed ===============**/
var src = "",
  feed = [];

// var yqlCallback = function(data) {
//   if (data.query.results !== null) {
//     feed = data.query.results.results;
//     //console.dir(feed);
//   } else {
//     // load backup RSS feed ..
//   }
// };
// function getRSSFeed() {
// how to set yql: http://jsbin.com/redawi
// var yql = [ "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yql.query.multi%20where%20queries%3D%22","select%20title%2C%20pubDate%2C%20description%2C%20link%20from%20rss%20where%20url%3D'http%3A%2F%2Ftw.news.search.yahoo.com%2Frss%3Fp%3D", "';", "%22&format=json&diagnostics=true&callback=yqlCallback"],
//     src = yql[0],
//     eScript = document.createElement("script"),
//     eHead = document.getElementsByTagName('head')[0];

// param = ["九合一選舉", "候選人抽籤"];
// agendas.forEach(function(a) { src = src + yql[1] + a.keys + yql[2]; });
// eScript.src = src + yql[3];

// eHead.appendChild(eScript);
// }//getRSSFeed();

function setRSSFeed(titleIndex, node) {
  // var news = feed[titleIndex].item,
  //     date, month;
  // node.textContent = agendas[titleIndex].keys;
  // if (feed[titleIndex]) {
  //   node.textContent = agendas[titleIndex].keys;//"RSS feed:";
  //   news.forEach(function(n, index) {

  //     date = new Date(n.pubDate);
  //     month = date.getMonth() + 1;
  //     ele = document.createElement("div");
  //     ele.innerHTML = agendas[titleIndex].keys;
  // ele.href = n.link;
  // ele.target = "_blank";
  // ele.innerHTML = "<br>" + n.title + " <time>[" + date.getFullYear()+"."+month+"."+date.getDate() + "]</time>";
  // ele.dataset.index = index;
  // ele.addEventListener("mouseenter", newsHovered);
  //   node.appendChild(ele);
  // });

  //   ele = document.createElement("p");
  //   node.appendChild(ele);
  // }
}

var newsHovered = function(e) {
  // var itemNews = e.target,
  //     listNews = itemNews.parentNode;

  // if (e.target.nodeName === "A") {

  //   indexNews = itemNews.dataset.index;
  //   indexTitle = listNews.parentNode.dataset.index;

  //   listNews.lastChild.className = "display-news";
  //   listNews.lastChild.textContent = feed[indexTitle].item[indexNews].description;
  // }
};

var titleClicked = function(e) {
  var ol = e.target.parentNode,
    li = e.target.parentNode.lastChild;
  if (li.innerHTML === "") return;
  if (e.target.nodeName === "TITLE") {
    if (li.className === "show detail") {
      li.className = "";
      ol.classList.remove("show");
    } else {
      li.className = "show detail";
      ol.classList.add("show");

      // setRSSFeed(ol.dataset.index, li);
    }
  }
};
container.addEventListener("click", titleClicked);
/** =============== rss news feed **/
// $(document).ready(function(){
//   $().UItoTop(); //easingType: 'easeInElastic',
// });
var clicked = false;
$('#collapseExtend').click(function() {
  clicked = !clicked;
  if (clicked) {
    for (var i in listItems) {
      if (listItems[i].childNodes[2].innerHTML === "") continue;
      listItems[i].className += "show";
      listItems[i].childNodes[2].className = "show detail";
    }
  } else {
    for (var i in listItems) {
      listItems[i].className = "";
      listItems[i].childNodes[2].className = "";
    }
  }
});