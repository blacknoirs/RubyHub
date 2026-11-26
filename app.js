(function () {
  var S = window.SCRIPTS || [], site = window.SITE || {};
  var grid = document.getElementById("grid"), q = document.getElementById("q");
  document.querySelectorAll("[data-site-name]").forEach(function (e) { e.textContent = site.name; });
  document.querySelectorAll("[data-discord]").forEach(function (e) {
    if (site.discord) { e.href = site.discord; } else { e.hidden = true; }
  });

  function copy(text, btn) {
    var done = function () {
      var old = btn.textContent; btn.textContent = "Copied"; btn.classList.add("done");
      setTimeout(function () { btn.textContent = old; btn.classList.remove("done"); }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Copy failed"; }
      document.body.removeChild(t);
    }
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function render(list) {
    grid.textContent = "";
    if (!list.length) { grid.appendChild(el("div", "empty", "No scripts match your search. Clear the box to see everything.")); return; }
    list.forEach(function (s) {
      var c = el("article", "card");
      c.appendChild(el("h3", "", s.name));
      var tags = el("div"); (s.tags || []).forEach(function (t) { tags.appendChild(el("span", "tag", t)); }); c.appendChild(tags);
      c.appendChild(el("p", "", s.description));
      c.appendChild(el("div", "meta", s.game + " \u00b7 v" + s.version + " \u00b7 updated " + s.updated));
      if (s.features && s.features.length) {
        var d = el("details"); d.appendChild(el("summary", "", "What it does"));
        var ul = el("ul"); s.features.forEach(function (f) { ul.appendChild(el("li", "", f)); }); d.appendChild(ul); c.appendChild(d);
      }
      c.appendChild(el("div", "code mono", s.loadstring));
      var a = el("div", "actions"), b = el("button", "btn", "Copy script"); b.type = "button";
      b.addEventListener("click", function () { copy(s.loadstring, b); }); a.appendChild(b); c.appendChild(a);
      grid.appendChild(c);
    });
  }
  function filter() {
    var v = q.value.trim().toLowerCase();
    render(S.filter(function (s) { return (s.name + " " + s.game + " " + s.description + " " + (s.tags || []).join(" ")).toLowerCase().indexOf(v) > -1; }));
  }
  q.addEventListener("input", filter); render(S);

  var f = S[0], hp = document.getElementById("hero-code"), hb = document.getElementById("hero-copy");
  if (f && hp) { hp.textContent = f.loadstring; hb.addEventListener("click", function () { copy(f.loadstring, hb); }); }
})();
