window.onload = function () {
  function router() {
    var app = document.getElementById("app");
    var hash = window.location.hash || "#/home";

    if (hash === "#/home") {
      app.innerHTML = "<h1>Home</h1><p>Platforma merge.</p>";
      return;
    }

    if (hash === "#/auctions") {
      app.innerHTML = "<h1>Licitatii</h1><p>Pagina licitatiilor merge.</p>";
      return;
    }

    if (hash === "#/profile") {
      app.innerHTML = "<h1>Profil</h1><p>Pagina profil merge.</p>";
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
};