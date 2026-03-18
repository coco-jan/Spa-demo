function router() {
  var app = document.getElementById("app");
  var hash = window.location.hash || "#/home";

  if (hash === "#/home") {
    app.innerHTML = "<h1>Home merge</h1><p>Site-ul functioneaza.</p>";
    return;
  }

  if (hash === "#/auctions") {
    app.innerHTML = "<h1>Licitatii merge</h1>";
    return;
  }

  if (hash === "#/profile") {
    app.innerHTML = "<h1>Profil merge</h1>";
    return;
  }

  if (hash.indexOf("#/auction/") === 0) {
    var id = hash.split("/")[2];
    app.innerHTML = "<h1>Licitatie " + id + "</h1>";
    return;
  }

  app.innerHTML = "<h1>404</h1>";
}

window.addEventListener("hashchange", router);
router();