var auctions = [
  {
    id: 1,
    title: "BMW M5 2020",
    description: "Full option, 600 CP",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    currentBid: 25000,
    minStep: 500,
    endsAt: Date.now() + 1000 * 60 * 20,
    bids: []
  },
  {
    id: 2,
    title: "Audi RS7 2021",
    description: "Sport, panoramic",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b",
    currentBid: 40000,
    minStep: 1000,
    endsAt: Date.now() + 1000 * 60 * 15,
    bids: []
  }
];

var saved = localStorage.getItem("auctions");
if (saved) {
  auctions = JSON.parse(saved);
}

if (!localStorage.getItem("user")) {
  var name = prompt("Introdu numele tău:");
  localStorage.setItem("user", name || "Guest");
}

function getAuctionById(id) {
  for (var i = 0; i < auctions.length; i++) {
    if (auctions[i].id == id) {
      return auctions[i];
    }
  }
  return null;
}

function formatTime(ms) {
  if (ms <= 0) return "ENDED";

  var s = Math.floor(ms / 1000);
  var m = Math.floor(s / 60);
  s = s % 60;

  return m + "m " + s + "s";
}

function renderHome() {
  document.getElementById("app").innerHTML =
    "<h1>Home</h1><p>Platforma merge 🔥</p>";
}

function renderAuctions() {
  var html = "<h1>Licitatii</h1>";

  for (var i = 0; i < auctions.length; i++) {
    var a = auctions[i];

    html +=
      "<div>" +
      "<h3>" + a.title + "</h3>" +
      "<p>" + a.currentBid + "€</p>" +
      "<p>" + formatTime(a.endsAt - Date.now()) + "</p>" +
      "<a href='#/auction/" + a.id + "'>Vezi</a>" +
      "</div><hr>";
  }

  document.getElementById("app").innerHTML = html;
}

function renderAuction(id) {
  var a = getAuctionById(id);

  if (!a) {
    document.getElementById("app").innerHTML = "404";
    return;
  }

  var bidsHtml = "";
  for (var i = 0; i < a.bids.length; i++) {
    bidsHtml += "<li>" + a.bids[i] + "</li>";
  }

  document.getElementById("app").innerHTML =
    "<a href='#/auctions'>← Înapoi</a>" +
    "<h1>" + a.title + "</h1>" +
    "<p>Bid: <span id='price'>" + a.currentBid + "</span>€</p>" +
    "<p>" + formatTime(a.endsAt - Date.now()) + "</p>" +
    "<input id='bid' type='number'>" +
    "<button onclick='bid(" + a.id + ")'>Bid</button>" +
    "<ul id='bids'>" + bidsHtml + "</ul>";
}

function bid(id) {
  var a = getAuctionById(id);
  var val = Number(document.getElementById("bid").value);

  if (val < a.currentBid + a.minStep) {
    alert("Minim " + (a.currentBid + a.minStep));
    return;
  }

  var user = localStorage.getItem("user") || "Guest";

  a.currentBid = val;
  a.bids.unshift(val + "€ - " + user);

  document.getElementById("price").innerText = val;

  var html = "";
  for (var i = 0; i < a.bids.length; i++) {
    html += "<li>" + a.bids[i] + "</li>";
  }

  document.getElementById("bids").innerHTML = html;

  localStorage.setItem("auctions", JSON.stringify(auctions));
}

function router() {
  if (!window.location.hash) {
    window.location.hash = "#/home";
  }

  var hash = window.location.hash;

  if (hash === "#/home") {
    renderHome();
    return;
  }

  if (hash === "#/auctions") {
    renderAuctions();
    return;
  }

  if (hash === "#/profile") {
    document.getElementById("app").innerHTML =
      "<h1>Profil</h1><p>User: " + (localStorage.getItem("user") || "Guest") + "</p>";
    return;
  }

  if (hash.indexOf("#/auction/") === 0) {
    var id = hash.split("/")[2];
    renderAuction(id);
    return;
  }

  document.getElementById("app").innerHTML = "404";
}

window.addEventListener("hashchange", router);
router();