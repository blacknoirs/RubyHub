(function () {
  var site = window.SITE || {}, list = window.SCRIPTS || [];
  var rows = document.getElementById("rows"), find = document.getElementById("find");
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; }

  document.querySelectorAll("[data-discord]").forEach(function (a) { if (site.discord) a.href = site.discord; else a.hidden = true; });
  document.getElementById("year").textContent = new Date().getFullYear();

  var live = list.filter(function (s) { return s.status !== "patched"; }).length;
  document.getElementById("status").innerHTML = list.length
    ? "<b>" + live + "</b> working, " + list.length + " total"
    : "No scripts released yet.";
  document.getElementById("count").textContent = list.length ? list.length + " listed" : "";

  function copy(text, btn) {
    function ok() { var o = btn.textContent; btn.textContent = "Copied"; btn.classList.add("done"); setTimeout(function () { btn.textContent = o; btn.classList.remove("done"); }, 1500); }
    function old() {
      var t = document.createElement("textarea"); t.value = text; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); ok(); } catch (e) { btn.textContent = "Copy failed"; } document.body.removeChild(t);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, old); else old();
  }

  function draw(items) {
    rows.textContent = "";
    if (!items.length) {
      var e = el("div", "empty");
      e.appendChild(el("b", "", list.length ? "Nothing matches that search." : "Nothing here yet."));
      e.appendChild(el("span", "", list.length ? "Try a different word." : "The first scripts will be posted on this page." + (site.discord ? " Join the Discord to see them first." : "")));
      rows.appendChild(e); return;
    }
    items.forEach(function (s) {
      var r = el("article", "row"), left = el("div");
      var h = el("h3"); var d = el("span", "dot " + (s.status || "working")); d.title = s.status || "working"; h.appendChild(d); h.appendChild(document.createTextNode(s.name)); left.appendChild(h);
      if (s.description) left.appendChild(el("p", "", s.description));
      left.appendChild(el("div", "meta", [s.game, s.version && "v" + s.version, s.updated && "updated " + s.updated, s.status].filter(Boolean).join("  /  ")));
      if (s.features && s.features.length) { var dt = el("details"); dt.appendChild(el("summary", "", "Features")); var u = el("ul"); s.features.forEach(function (f) { u.appendChild(el("li", "", f)); }); dt.appendChild(u); left.appendChild(dt); }
      var b = el("button", "btn", "Copy"); b.type = "button";
      if (s.status === "patched") { b.disabled = true; b.textContent = "Patched"; } else b.addEventListener("click", function () { copy(s.loadstring, b); });
      r.appendChild(left); r.appendChild(b); rows.appendChild(r);
    });
  }
  if (list.length > 5) { find.style.display = "block"; find.addEventListener("input", function () { var v = find.value.toLowerCase(); draw(list.filter(function (s) { return (s.name + " " + (s.game || "") + " " + (s.description || "")).toLowerCase().indexOf(v) > -1; })); }); }
  draw(list);
})();
