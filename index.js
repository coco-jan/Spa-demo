var auctions = [
  {
    id: 1,
    title: "BMW M5 2020",
    description: "Full option, 600 CP, stare impecabilă.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    currentBid: 25000,
    minStep: 500,
    endsAt: Date.now() + 1000 * 60 * 20,
    bids: ["25000€ - User01"]
  },
  {
    id: 2,
    title: "Audi RS7 2021",
    description: "Sportback, panoramic, interior premium.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
    currentBid: 40000,
    minStep: 1000,
    endsAt: Date.now() + 1000 * 60 * 15,
    bids: ["40000€ - User02"]
  },
  {
    id: 3,
    title: "Mercedes C63 AMG",
    description: "V8, întreținută perfect, istoric complet.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    currentBid: 32000,
    minStep: 500,
    endsAt: Date.now() + 1000 * 60 * 10,
    bids: ["32000€ - User03"]
  }
];

var timerInterval = null;

function getAuctionById(id) {
  for (var i = 0; i < auctions.length; i++) {
    if (auctions[i].id === Number(id)) {
      return auctions[i];
    }
  }
  return null;
}

function formatRemaining(ms) {
  if (ms <= 0) {
    return "Licitație închisă";
  }

  var totalSeconds = Math.floor(ms / 1000);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;

  return minutes + "m " + seconds + "s";
}

function renderHome() {
  var app = document.getElementById("app");

  app.innerHTML =
    '<section class="hero">' +
      '<span class="badge">Varianta Pro</span>' +
      '<h1>Platformă de licitații live</h1>' +
      '<p class="muted">Licitații auto, bid-uri rapide, timer live și pagini dinamice fără reload.</p>' +
      '<p><a href="#/auctions"><button class="btn">Vezi licitațiile</button></a></p>' +
    '</section>';
}

function renderAuctions() {
  var app = document.getElementById("app");
  var html = '<h1>Licitații active</h1><div class="grid">';

  for (var i = 0; i < auctions.length; i++) {
    var auction = auctions[i];

    html +=
      '<div class="card">' +
        '<img class="car-image" src="' + auction.image + '" alt="' + auction.title + '">' +
        '<h3>' + auction.title + '</h3>' +
        '<p class="muted">' + auction.description + '</p>' +
        '<div class="price">' + auction.currentBid + '€</div>' +
        '<p class="timer">Timp rămas: ' + formatRemaining(auction.endsAt - Date.now()) + '</p>' +
        '<a href="#/auction/' + auction.id + '"><button class="btn">Intră în licitație</button></a>' +
      '</div>';
  }

  html += '</div>';
  app.innerHTML = html;
}

function renderAuctionDetails(id) {
  var app = document.getElementById("app");
  var auction = getAuctionById(id);

  if (!auction) {
    app.innerHTML = '<div class="card"><h2>404</h2><p>Licitația nu există.</p></div>';
    return;
  }

  var bidsHtml = "";
  for (var i = 0; i < auction.bids.length; i++) {
    bidsHtml += "<li>" + auction.bids[i] + "</li>";
  }

  app.innerHTML =
    '<div class="card">' +
      '<img class="car-image" src="' + auction.image + '" alt="' + auction.title + '">' +
      '<span class="badge">Live auction</span>' +
      '<h1>' + auction.title + '</h1>' +
      '<p class="muted">' + auction.description + '</p>' +
      '<div class="price">Preț curent: <span id="currentBid">' + auction.currentBid + '</span>€</div>' +
      '<p class="timer">Timp rămas: <span id="timer">' + formatRemaining(auction.endsAt - Date.now()) + '</span></p>' +
      '<label for="bidInput">Bid-ul tău</label>' +
      '<input id="bidInput" class="input" type="number" min="' + (auction.currentBid + auction.minStep) + '" value="' + (auction.currentBid + auction.minStep) + '">' +
      '<p><button class="btn" onclick="placeBid(' + auction.id + ')">Plasează bid</button></p>' +
      '<h3>Istoric bid-uri</h3>' +
      '<ul id="bidHistory" class="list">' + bidsHtml + '</ul>' +
    '</div>';
}

function renderProfile() {
  var app = document.getElementById("app");

  app.innerHTML =
    '<div class="card">' +
      '<h1>Profil</h1>' +
      '<p><strong>Nume:</strong> Alex Dealer</p>' +
      '<p><strong>Status:</strong> Verified Dealer</p>' +
      '<p><strong>Bid-uri active:</strong> 3</p>' +
      '<p><strong>Wallet:</strong> conectat</p>' +
    '</div>';
}

function placeBid(id) {
  var auction = getAuctionById(id);
  if (!auction) {
    return;
  }

  var input = document.getElementById("bidInput");
  var value = Number(input.value);

  if (!value || value <= 0) {
    alert("Introdu o sumă validă.");
    return;
  }

  if (auction.endsAt <= Date.now()) {
    alert("Licitația este închisă.");
    return;
  }

  var minimum = auction.currentBid + auction.minStep;

  if (value < minimum) {
    alert("Bid-ul minim este " + minimum + "€");
    input.value = minimum;
    return;
  }

  auction.currentBid = value;
  auction.bids.unshift(value + "€ - You");

  document.getElementById("currentBid").textContent = value;

  var bidsHtml = "";
  for (var i = 0; i < auction.bids.length; i++) {
    bidsHtml += "<li>" + auction.bids[i] + "</li>";
  }

  document.getElementById("bidHistory").innerHTML = bidsHtml;
  input.value = value + auction.minStep;
}

function startAuctionTimer(id) {
  clearInterval(timerInterval);

  var auction = getAuctionById(id);
  if (!auction) {
    return;
  }

  timerInterval = setInterval(function () {
    var timerEl = document.getElementById("timer");
    if (!timerEl) {
      clearInterval(timerInterval);
      return;
    }

    var remaining = auction.endsAt - Date.now();
    timerEl.textContent = formatRemaining(remaining);

    if (remaining <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function router() {
  var hash = window.location.hash || "#/home";

  clearInterval(timerInterval);

  if (hash === "#/home") {
    renderHome();
    return;
  }

  if (hash === "#/auctions") {
    renderAuctions();
    return;
  }

  if (hash === "#/profile") {
    renderProfile();
    return;
  }

  if (hash.indexOf("#/auction/") === 0) {
    var id = hash.split("/")[2];
    renderAuctionDetails(id);
    startAuctionTimer(id);
    return;
  }

  document.getElementById("app").innerHTML =
    '<div class="card"><h2>404</h2><p>Pagina nu există.</p></div>';
}

window.addEventListener("hashchange", router);
router();