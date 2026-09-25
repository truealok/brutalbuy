/* ============================================================
   BRUTAL BUY — Catalog page
   Deep navigation: sport → category → sub-type → products.
   URL params: sport, cat, sub, brand, cat(name), tag, page, sort
   ============================================================ */
/* BB global comes from data.js */

document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const PER_PAGE = 12;
  const sport = BB.qs("sport");
  const cat = BB.qs("cat");
  const sub = BB.qs("sub");
  const brand = BB.qs("brand");
  const catName = BB.qs("cat-name") || BB.qs("cn");
  const tag = BB.qs("tag");
  let page = Math.max(1, parseInt(BB.qs("page") || "1", 10));
  let sort = BB.qs("sort") || "featured";

  /* ---- resolve pool of products ---- */
  function pool() {
    let out = [];
    if (sport) {
      const s = BB.sports.find(x => x.id === sport);
      if (s) {
        const cats = cat ? s.categories.filter(c => c.id === cat) : s.categories;
        cats.forEach(c => c.sub.forEach(sn => {
          if (sub && sn !== decodeURIComponent(sub)) return;
          const n = BB.count(s.id, c.id, sn);
          for (let i = 0; i < n; i++) out.push(BB.products(s.id, c.id, sn, i));
        }));
      }
    } else if (brand) {
      const b = BB.brands.find(x => x.id === brand);
      BB.sports.forEach(s => s.categories.forEach(c => c.sub.forEach(sn => {
        const n = BB.count(s.id, c.id, sn);
        for (let i = 0; i < n; i++) {
          const p = BB.products(s.id, c.id, sn, i);
          if (p.brandId === brand) out.push(p);
        }
      })));
      if (!out.length) {
        /* guarantee products for any brand card */
        BB.sports.forEach((s, si) => s.categories.forEach((c, ci) => c.sub.forEach((sn, z) => {
          if ((si + ci + z) % 2 === 0) out.push(BB.products(s.id, c.id, sn, 4));
        })));
      }
    } else if (catName) {
      const q = decodeURIComponent(catName).toLowerCase();
      BB.sports.forEach(s => s.categories.forEach(c => c.sub.forEach(sn => {
        const n = BB.count(s.id, c.id, sn);
        for (let i = 0; i < n; i++) {
          const p = BB.products(s.id, c.id, sn, i);
          const hay = `${p.cat} ${p.sub} ${p.sport}`.toLowerCase();
          if (hay.includes(q.split(" ")[0]) || q.includes(p.cat.toLowerCase().split(" ")[0])) out.push(p);
        }
      })));
    } else {
      BB.sports.forEach(s => s.categories.forEach(c => c.sub.forEach(sn => {
        const n = BB.count(s.id, c.id, sn);
        for (let i = 0; i < n; i++) out.push(BB.products(s.id, c.id, sn, i));
      })));
    }

    if (tag === "sale") out = out.filter(p => p.sale);
    if (tag === "new") out = out.filter(p => p.badges.some(b => b.text === "NEW"));
    if (out.length < PER_PAGE && !tag) {
      const extra = [];
      BB.sports.forEach(s => s.categories.forEach(c => c.sub.forEach(sn => extra.push(BB.products(s.id, c.id, sn, 7)))));
      out = out.concat(extra);
    }
    return out;
  }

  /* ---- title / breadcrumb ---- */
  function renderHead(all = []) {
    const s = sport ? BB.sports.find(x => x.id === sport) : null;
    const c = s && cat ? s.categories.find(x => x.id === cat) : null;
    const b = brand ? BB.brands.find(x => x.id === brand) : null;
    let title = "All Sports Gear";
    if (b) title = b.name;
    else if (catName) title = decodeURIComponent(catName);
    else if (tag === "sale") title = "🔥 Mega Sale";
    else if (tag === "new") title = "New Arrivals";
    else if (s && c) title = `${s.name} — ${c.name}`;
    else if (s) title = s.name;
    document.getElementById("pageTitle").textContent = title;
    document.title = `${title} — Brutal Buy`;
    document.getElementById("crumb").innerHTML = `
      <a href="index.html">Home</a> <span>›</span>
      ${s ? `<a href="catalog.html?sport=${s.id}">${s.name}</a> <span>›</span>` : ""}
      ${c ? `<a href="catalog.html?sport=${s.id}&cat=${c.id}">${c.name}</a> <span>›</span>` : ""}
      <span style="color:var(--text)">${title}</span>`;
    document.getElementById("resultsCount").textContent =
      `${all.length.toLocaleString()} products`;
  }

  /* ---- sub-category chips ---- */
  function renderChips() {
    const host = document.getElementById("subChips");
    if (!host) return;
    let chips = [];
    if (sport) {
      const s = BB.sports.find(x => x.id === sport);
      chips = cat
        ? (s.categories.find(c => c.id === cat) || { sub: [] }).sub
        : s.categories.map(c => c.name);
      const base = cat ? `catalog.html?sport=${sport}&cat=${cat}&sub=` : `catalog.html?sport=${sport}&cn=`;
      host.innerHTML = `<a class="chip ${!sub ? "is-active" : ""}" href="catalog.html?sport=${sport}${cat ? `&cat=${cat}` : ""}">All</a>` +
        chips.map(ch => {
          const href = cat ? base + encodeURIComponent(ch) : `catalog.html?sport=${sport}&cat=${s.categories.find(c => c.name === ch)?.id || ""}`;
          const active = sub ? decodeURIComponent(sub) === ch : false;
          return `<a class="chip ${active ? "is-active" : ""}" href="${href}">${ch}</a>`;
        }).join("");
    }
  }

  /* ---- filters sidebar ---- */
  function renderFilters() {
    const host = document.getElementById("filters");
    if (!host) return;
    const sportsChecks = BB.sports.map(s => `
      <label class="f-check"><input type="checkbox" data-fsport="${s.id}" ${s.id === sport ? "checked disabled" : ""}> ${s.name}</label>`).join("");
    const brandChecks = BB.brands.map(b => `
      <label class="f-check"><input type="checkbox" data-fbrand="${b.id}" ${b.id === brand ? "checked" : ""}> ${b.name}</label>`).join("");
    host.innerHTML = `
      <div class="filter-group">
        <h4>Sports</h4>
        ${sportsChecks}
      </div>
      <div class="filter-group">
        <h4>Brands</h4>
        ${brandChecks}
      </div>
      <div class="filter-group">
        <h4>Price</h4>
        <input type="range" class="range" id="priceRange" min="10" max="260" value="260">
        <div class="price-vals"><span>$10</span><span id="priceMax">$260</span></div>
      </div>
      <div class="filter-group">
        <h4>Rating</h4>
        <label class="f-check"><input type="checkbox" checked> ★ 4.0 & up</label>
        <label class="f-check"><input type="checkbox"> ★ 3.5 & up</label>
      </div>
      <div class="filter-group" style="border:0">
        <button class="btn btn-ghost" style="width:100%" onclick="location.reload()">Reset filters</button>
      </div>`;

    const range = document.getElementById("priceRange");
    range.addEventListener("input", () => {
      document.getElementById("priceMax").textContent = "$" + range.value;
      applyFilters(parseFloat(range.value));
    });

    host.querySelectorAll("[data-fbrand]").forEach(cb => {
      cb.addEventListener("change", () => {
        const on = Array.from(host.querySelectorAll("[data-fbrand]:checked")).map(x => x.dataset.fbrand);
        applyFilters(null, on);
      });
    });
  }

  let current = [];
  function applyFilters(maxPrice = null, brands = null) {
    let list = pool();
    if (maxPrice != null) list = list.filter(p => p.price <= maxPrice);
    if (brands && brands.length) list = list.filter(p => brands.includes(p.brandId));
    sortAndRender(list, true);
  }

  /* ---- sort + render ---- */
  function sortAndRender(list, resetPage = false) {
    if (resetPage) page = 1;
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "featured") list = [...list].sort((a, b) => b.reviews - a.reviews);
    current = list;

    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page > pages) page = pages;
    const slice = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    grid.innerHTML = slice.map(p => BB.productCard(p)).join("");
    document.getElementById("resultsCount").textContent = `${list.length.toLocaleString()} products`;

    const pg = document.getElementById("pagination");
    if (pages > 1) {
      let html = "";
      for (let i = 1; i <= Math.min(pages, 8); i++) {
        const u = new URLSearchParams(location.search); u.set("page", i);
        html += `<a class="page-btn ${i === page ? "is-active" : ""}" href="?${u}">${i}</a>`;
      }
      pg.innerHTML = html;
    } else pg.innerHTML = "";

    BB.bindReveals(grid);
    grid.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  }

  /* ---- boot ---- */
  renderHead();
  renderChips();
  renderFilters();
  const sel = document.getElementById("sortSel");
  if (sel) {
    sel.value = sort;
    sel.addEventListener("change", () => {
      sort = sel.value;
      sortAndRender(current.length ? current : pool());
    });
  }
  sortAndRender(pool());
});
