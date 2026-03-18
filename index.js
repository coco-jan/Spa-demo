const auctions = [
  {
    id: 1,
    title: "BMW Seria 5 2019",
    description: "Diesel, automat, 190.000 km, stare foarte bună.",
    currentBid: 8200,
    minStep: 100,
    endsAt: Date.now() + 1000 * 60 * 12,
    bids: ["8200€ - User01"]
  },
  {
    id: 2,
    title: "Audi A4 2018",
    description: "Benzină, cutie automată, interior piele.",
    currentBid: 9100,
    minStep: 100,
    endsAt: Date.now() + 1000 * 60 * 8,
    bids: ["9100€ - User04"]
  },
  {
    id: 3,
    title: "Mercedes C-Class 2017",
    description: "Mașină import, acte complete, istoric service.",
    currentBid: 10400,
    minStep: 200,
    endsAt: Date.now() + 1000 * 60 * 15,
    bids: ["10400€ - User07"]
  }
];

let timerInterval = null;

function formatRemaining(ms) {
  if (ms <= 0) return "Licitație închisă";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function getAuctionById(id) {
  return auctions.find(a => a.id === Number(id));
}

function renderHome() {
  return `
    <section class="hero">
      <span class="badge">Varianta Pro</span>
      <h1>Platformă de licitații live</h1>
      <p class="muted">
        Licitații auto, bid-uri rapide, timer live și pagini dinamice fără reload.
      </p>
      <div class="row">
        <a href="#/auctions"><button class="btn">Vezi licitațiile</button></a>
        <a href="#/profile"><button class="btn">Profilul meu</button></a>
      </div>
    </section>
  `;
}

function renderAuctions() {
  if (!auctions.length) {
    return `<div class="empty">Nu există licitații active.</div>`;
  }

  return `
    <h1>Licitații active</h1>
    <div class="grid">
      ${auctions.map(auction => `
        <div class="card">
          <h3>${auction.title}</h3>
          <p class="muted">${auction.description}</p>
          <div class="price">${auction.currentBid}€</div>
          <p class="timer">Timp rămas: ${formatRemaining(auction.endsAt - Date.now())}</p>
          <a href="#/auction/${auction.id}">
            <button class="btn">Intră în licitație</button>
          </a>
        </div>
      `).join("")}
    </div>
  `;
}

function renderAuctionDetails(id) {
  const auction = getAuctionById(id);

  if (!auction) {
    return `<div class="empty"><h2>404</h2><p>Licitația nu există.</p></div>`;
  }

  return `
    <div class="card">
      <span class="badge">Live auction</span>
      <h1>${auction.title}</h1>
      <p class="muted">${auction.description}</p>
      <div class="price">Preț curent: <span id="currentBid">${auction.currentBid}</span>€</div>
      <p class="timer">Timp rămas: <span id="timer">${formatRemaining(auction.endsAt - Date.now())}</span></p>

      <label for="bidInput">Bid-ul tău</label>
      <input
        id="bidInput"
        class="input"
        type="number"
        min="${auction.currentBid + auction.minStep}"
        value="${auction.currentBid + auction.minStep}"
      />

      <div class="row">
        <button class="btn" onclick="placeBid(${auction.id})">Plasează bid</button>
        <a href="#/auctions"><button class="btn">Înapoi</button></a>
      </div>

      <h3>Istoric bid-uri</h3>
      <ul id="bidHistory" class="list">
        ${auction.bids.map(bid => `<li>${bid}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderProfile() {
  return `
    <div class="card">
      <h1>Profil</h1>
      <p><strong>Nume:</strong> Demo User</p>
      <p><strong>Status:</strong> Verificat</p>
      <p><strong>Bid-uri active:</strong> 3</p>
      <p><strong>Wallet:</strong> conectat</p>
    </div>
  `;
}

function placeBid(id) {
  const auction = getAuctionById(id);
  if (!auction) return;

  const input = document.getElementById("bidInput");
  const value = Number(input.value);

  if (!Number.isFinite(value)) {
    alert("Introdu o sumă validă.");
    return;
  }

  const minimum = auction.currentBid + auction.minStep;
  if (value < minimum) {
    alert(`Bid-ul minim este ${minimum}€`);
    return;
  }

  if (auction.endsAt <= Date.now()) {
    alert("Licitația este închisă.");
    return;
  }

  auction.currentBid = value;
  auction.bids.unshift(`${value}€ - You`);

  document.getElementById("currentBid").textContent = value;
  document.getElementById("bidHistory").innerHTML = auction.bids
    .map(bid => `<li>${bid}</li>`)
    .join("");

  input.value = value + auction.minStep;
}

function startAuctionTimer(id) {
  clearInterval(timerInterval);

  const auction = getAuctionById(id);
  if (!auction) return;

  timerInterval = setInterval(() => {
    const timerEl = document.getElementById("timer");
    if (!timerEl) {
      clearInterval(timerInterval);
      return;
    }

    const remaining = auction.endsAt - Date.now();
    timerEl.textContent = formatRemaining(remaining);

    if (remaining <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function router() {
  const app = document.getElementById("app");
  const hash = window.location.hash || "#/home";

  clearInterval(timerInterval);

  if (hash === "#/home") {
    app.innerHTML = renderHome();
    return;
  }

  if (hash === "#/auctions") {
    app.innerHTML = renderAuctions();
    return;
  }

  if (hash === "#/profile") {
    app.innerHTML = renderProfile();
    return;
  }

  if (hash.startsWith("#/auction/")) {
    const id = hash.split("/")[2];
    app.innerHTML = renderAuctionDetails(id);
    startAuctionTimer(id);
    return;
  }

  app.innerHTML = `
    <div class="empty">
      <h2>404</h2>
      <p>Pagina nu există.</p>
    </div>
  `;
}

window.addEventListener("hashchange", router);
router();