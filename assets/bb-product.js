/* ============================================================
   BRUTAL BUY — Product detail page
   URL: product.html?id=sportId-catId-sub-slug-N
   ============================================================ */
/* BB global comes from data.js */

document.addEventListener("DOMContentLoaded", () => {

  const host = document.getElementById("pdpHost");
  if (!host) return;

  const id = BB.qs("id") || "";
  /* id format: sportId-catId-sub-slug-N  (sub-slug may contain dashes) */
  const m = id.match(/^(.+?)-(.+?)-(.+)-(\d+)$/);
  let p = null;
  if (m) {
    const [, sportId, catId, subSlug, nStr] = m;
    const sport = BB.sports.find(s => s.id === sportId);
    const cat = sport && sport.categories.find(c => c.id === catId);
    const subName = cat && cat.sub.find(s =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "-") === subSlug);
    if (sport && cat && subName) p = BB.products(sportId, catId, subName, Number(nStr) - 1);
  }
  if (!p) {
    const s0 = BB.sports[0], c0 = s0.categories[0];
    p = BB.products(s0.id, c0.id, c0.sub[0], 0);
  }

  document.title = `${p.name} — Brutal Buy`;
  document.getElementById("crumb").innerHTML = `
    <a href="index.html">Home</a> <span>›</span>
    <a href="catalog.html?sport=${p.sportId}">${p.sport}</a> <span>›</span>
    <a href="catalog.html?sport=${p.sportId}&cat=${p.catId}">${p.cat}</a> <span>›</span>
    <a href="catalog.html?sport=${p.sportId}&cat=${p.catId}&sub=${encodeURIComponent(p.sub)}">${p.sub}</a> <span>›</span>
    <span style="color:var(--text)">${BB.esc(p.name)}</span>`;

  const save = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
  const rel = BB.subsOf(p.sportId).slice(0, 12).map(x =>
    BB.products(p.sportId, x.cat.id, x.sub, 2)).filter(x => x.id !== p.id).slice(0, 8);

  host.innerHTML = `
  <div class="pdp">
    <div class="pdp-gallery">
      <div class="pdp-main-img" id="pdpMain" style="background-image:url('${p.img.replace("w=600", "w=1000").replace("h=510", "h=850")}')"></div>
      <div class="pdp-thumbs" id="pdpThumbs">
        ${[0, 1, 2, 3].map(i => `<button data-img="${p.img}" style="background-image:url('${p.img}')" class="${i === 0 ? "is-active" : ""}"></button>`).join("")}
      </div>
    </div>
    <div class="pdp-info">
      <span class="p-cat">${p.brand} • ${p.sport} • ${p.sub}</span>
      <h1>${BB.esc(p.name)}</h1>
      <div class="pdp-rating"><span class="stars">★★★★★</span> ${p.rating} · ${p.reviews} reviews</div>
      <div class="pdp-price">
        <span class="now">${BB.money(p.price)}</span>
        ${p.was ? `<span class="was">${BB.money(p.was)}</span><span class="save">Save ${save}%</span>` : ""}
      </div>
      <p class="pdp-desc">${p.desc} Built by ${p.brand} for ${p.sub.toLowerCase()} players who demand match-day performance at every level.</p>

      <div class="opt-label">Color</div>
      <div class="opt-row" id="colorRow">
        ${p.colors.map((c, i) => `<button class="opt-swatch ${i === 0 ? "is-active" : ""}" style="background:${c}" data-color="${c}"></button>`).join("")}
      </div>

      <div class="opt-label">Size / Variant</div>
      <div class="opt-row" id="sizeRow">
        ${p.sizes.map((s, i) => `<button class="opt ${i === 0 ? "is-active" : ""}">${s}</button>`).join("")}
      </div>

      <div class="pdp-buy">
        <div class="qty-lg">
          <button id="qMinus">−</button><b id="qVal">1</b><button id="qPlus">+</button>
        </div>
        <button class="btn btn-primary" id="addToCart" style="flex:1">Add to cart — ${BB.money(p.price)}</button>
      </div>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="BB.toast('Saved to wishlist ♡')">♡ Wishlist</button>
        <a class="btn btn-ghost" href="withdrawal.html">↩ Return policy</a>
      </div>

      <ul class="pdp-meta">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg> Free shipping over $75 · 2–5 day delivery</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 12l4-4M3 12l4 4" transform="rotate(90 3 12)"/></svg> 30-day no-questions returns</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/></svg> 2-year pro-gear warranty</li>
      </ul>
    </div>
  </div>

  <section class="section related">
    <div class="section-head">
      <div><h2 class="section-title">You may also like</h2><p class="section-sub">More from ${p.sport} — ${p.cat}</p></div>
      <a class="section-link" href="catalog.html?sport=${p.sportId}&cat=${p.catId}">View all →</a>
    </div>
    <div class="product-grid">${rel.map(r => BB.productCard(r)).join("")}</div>
  </section>`;

  /* gallery thumbs */
  document.getElementById("pdpThumbs").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    document.querySelectorAll("#pdpThumbs button").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
    document.getElementById("pdpMain").style.backgroundImage = `url('${b.dataset.img.replace("w=600", "w=1000").replace("h=510", "h=850")}')`;
  });

  /* variant pickers */
  document.getElementById("colorRow").addEventListener("click", e => {
    const b = e.target.closest(".opt-swatch");
    if (!b) return;
    document.querySelectorAll("#colorRow .opt-swatch").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
  });
  document.getElementById("sizeRow").addEventListener("click", e => {
    const b = e.target.closest(".opt");
    if (!b) return;
    document.querySelectorAll("#sizeRow .opt").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
  });

  /* qty + add */
  let q = 1;
  document.getElementById("qMinus").onclick = () => { q = Math.max(1, q - 1); document.getElementById("qVal").textContent = q; };
  document.getElementById("qPlus").onclick = () => { q++; document.getElementById("qVal").textContent = q; };
  document.getElementById("addToCart").onclick = () => BB.cart.add(p, q);
});
