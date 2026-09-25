/* ============================================================
   BRUTAL BUY — Core UI
   Renders header, mega menus, drawers (sidebar/search/cart/
   account), footer, theme system, cart engine, live search,
   toasts and scroll-reveal. Shared by every page.
   ============================================================ */

/* BB global is declared in data.js (single source) */

BB.page = BB.page || { nav: "" };

/* ---------------- helpers ---------------- */
BB.toast = function (msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(BB._toastT);
  BB._toastT = setTimeout(() => t.classList.remove("show"), 2400);
};

BB.qs = function (k) { return new URLSearchParams(location.search).get(k); };

BB.money = function (n) { return "$" + n.toFixed(0) + ".00"; };

BB.esc = function (s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
};

/* ---------------- cart engine ---------------- */
BB.cart = {
  items: JSON.parse(localStorage.getItem("bb_cart") || "[]"),
  save() {
    localStorage.setItem("bb_cart", JSON.stringify(this.items));
    BB.cart.render();
  },
  add(p, qty = 1) {
    const line = this.items.find(i => i.id === p.id);
    if (line) line.qty += qty;
    else this.items.push({ id: p.id, name: p.name, price: p.price, img: p.img, sport: p.sport, cat: p.cat, sub: p.sub, qty });
    this.save();
    BB.toast(`Added to cart — ${p.name}`);
    const badge = document.querySelector(".cart-count");
    if (badge) { badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop"); }
  },
  remove(id) { this.items = this.items.filter(i => i.id !== id); this.save(); },
  setQty(id, q) {
    const line = this.items.find(i => i.id === id);
    if (!line) return;
    line.qty = Math.max(1, q);
    this.save();
  },
  count() { return this.items.reduce((a, i) => a + i.qty, 0); },
  total() { return this.items.reduce((a, i) => a + i.qty * i.price, 0); },
  render() {
    const badge = document.querySelector(".cart-count");
    if (badge) {
      const n = this.count();
      badge.textContent = n;
      badge.classList.toggle("show", n > 0);
    }
    const body = document.getElementById("cartItems");
    if (!body) return;
    if (!this.items.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="21" r="1.6"/><circle cx="19" cy="21" r="1.6"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L23 7H6"/></svg>
          <p>Your cart is empty</p>
          <button class="btn btn-primary" data-close-drawer>Continue shopping</button>
        </div>`;
      const ft = document.getElementById("cartFooter");
      if (ft) ft.innerHTML = "";
      return;
    }
    body.innerHTML = this.items.map(i => `
      <div class="cart-item">
        <img src="${i.img}" alt="">
        <div style="flex:1">
          <div class="ci-name">${BB.esc(i.name)}</div>
          <div style="font-size:12px;color:var(--muted)">${BB.esc(i.sub || i.cat || "")}</div>
          <div class="qty">
            <button data-qty="-1" data-id="${i.id}">−</button>
            <b>${i.qty}</b>
            <button data-qty="1" data-id="${i.id}">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:800;color:var(--accent-strong)">${BB.money(i.price * i.qty)}</div>
          <button class="link-danger" data-remove="${i.id}" style="background:none;border:0;color:var(--muted);font-size:12px;margin-top:6px;text-decoration:underline">Remove</button>
        </div>
      </div>`).join("");
    const ft = document.getElementById("cartFooter");
    if (ft) ft.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:12px">
        <span>Subtotal</span><span style="color:var(--accent-strong)">${BB.money(this.total())}</span>
      </div>
      <p style="font-size:12px;color:var(--muted);margin-bottom:12px">Shipping & taxes calculated at checkout</p>
      <a href="cart.html" class="btn btn-primary" style="width:100%">Checkout • ${BB.money(this.total())}</a>`;
  }
};

/* ---------------- theme ---------------- */
BB.theme = {
  init() {
    const saved = localStorage.getItem("bb_theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    document.querySelectorAll(".theme-toggle").forEach(t => t.setAttribute("aria-checked", saved === "light"));
  },
  toggle() {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("bb_theme", next);
    document.querySelectorAll(".theme-toggle").forEach(t => t.setAttribute("aria-checked", next === "light"));
    BB.toast(next === "dark" ? "Dark theme on 🌙" : "Light theme on ☀️");
  }
};

/* ---------------- header ---------------- */
function navHTML() {
  const sportsCol = (title, items) => `
    <div>
      <div class="mega-title">${title}</div>
      <ul>${items.map(s => `<li><a href="catalog.html?sport=${s.id}">${s.name}</a></li>`).join("")}</ul>
    </div>`;

  const sportsCols = [BB.sports.slice(0, 4), BB.sports.slice(4, 8), BB.sports.slice(8)];
  const promoCards = BB.megaPromos.map(p => `
    <a class="mega-card" href="${p.href}">
      <div><div class="mc-title">${p.title}</div><div class="mc-sub">${p.sub}</div></div>
    </a>`).join("");

  const sportDeepLinks = (sport) => sport.categories.slice(0, 6).map(c =>
    `<li><a href="catalog.html?sport=${sport.id}&cat=${c.id}">${c.name}</a></li>`).join("");

  const colSportsMenu = (groups) => `
    <div class="mega" role="menu">
      <div class="container mega-inner" style="grid-template-columns:repeat(${groups.length},1fr) 1.35fr">
        ${groups.map(group => group.map(s => `
          <div>
            <div class="mega-title">${s.name}</div>
            <ul>${sportDeepLinks(s)}</ul>
          </div>`).join("")).join("")}
        <div class="mega-promo">${promoCards}</div>
      </div>
    </div>`;

  return `
  <ul class="nav" id="nav">
    <li><a class="nav-link" href="catalog.html?tag=sale" style="color:var(--accent-strong)">SALE</a></li>
    <li><a class="nav-link" href="catalog.html?tag=new">New Arrivals</a></li>
    <li>
      <button class="nav-link" aria-haspopup="true">All Sports <span class="chev">▾</span></button>
      ${colSportsMenu([BB.sports.slice(0, 5), BB.sports.slice(5, 10), BB.sports.slice(10)])}
    </li>
    <li>
      <button class="nav-link" aria-haspopup="true">Lifestyle <span class="chev">▾</span></button>
      <div class="mega">
        <div class="container mega-inner" style="grid-template-columns:repeat(5,1fr) 1.35fr">
          ${BB.lifestyle.map(l => `<div><div class="mega-title">${l.name}</div><ul>${l.sub.map(s => `<li><a href="catalog.html?cat=${encodeURIComponent(s)}">${s}</a></li>`).join("")}</ul></div>`).join("")}
          <div class="mega-promo">${promoCards}</div>
        </div>
      </div>
    </li>
    <li>
      <button class="nav-link" aria-haspopup="true">B2B features <span class="chev">▾</span></button>
      <div class="dropdown">
        ${BB.b2b.map(b => `<a href="b2b.html#${b.id}">${b.name} <span class="chev">›</span></a>`).join("")}
      </div>
    </li>
    <li>
      <button class="nav-link" aria-haspopup="true">Brands <span class="chev">▾</span></button>
      <div class="dropdown">
        ${BB.brands.map(b => `<a href="catalog.html?brand=${b.id}">${b.name}</a>`).join("")}
        <a href="brands.html" style="color:var(--accent-strong);font-weight:700">All Brands →</a>
      </div>
    </li>
    <li>
      <button class="nav-link" aria-haspopup="true">Templates <span class="chev">▾</span></button>
      <div class="dropdown">
        <a href="index.html">Home v1 — Classic</a>
        <a href="index.html">Home v2 — Slider</a>
        <a href="catalog.html">Catalog Grid</a>
        <a href="product.html">Product Detail</a>
        <a href="account.html">Account</a>
      </div>
    </li>
    <li><a class="nav-link" href="about.html">About Us</a></li>
  </ul>`;
}

function headerHTML() {
  return `
  <div class="announce" id="announce">
    <div class="container">
      <div class="announce-msg is-active">🚚 Free shipping on orders over <b>$75</b></div>
      <div class="announce-msg">⚡ Mega <b>SALE</b> week — up to 45% off</div>
      <div class="announce-msg">🏆 Team & bulk orders — <b>get a quote</b></div>
    </div>
  </div>
  <header class="header">
    <div class="container header-inner">
      <button class="hamburger" id="hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>
      <a class="logo" href="index.html">
        <img src="assets/logo-dark.svg" alt="Brutal Buy" id="logoImg">
        <span class="logo-name">BRUTAL<span>BUY</span></span>
      </a>
      ${navHTML()}
      <div class="header-actions">
        <button class="theme-toggle" role="switch" aria-label="Toggle dark / light theme"></button>
        <button class="icon-btn" id="storeBtn" title="Store locator" aria-label="Store locator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>
        </button>
        <button class="icon-btn" id="searchBtn" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <button class="icon-btn" id="accountBtn" aria-label="Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c1.2-3.8 4-5.7 7.5-5.7s6.3 1.9 7.5 5.7"/></svg>
        </button>
        <button class="icon-btn" id="cartBtn" aria-label="Cart" style="position:relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1.6"/><circle cx="19" cy="21" r="1.6"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L23 7H6"/></svg>
          <span class="cart-count">0</span>
        </button>
      </div>
    </div>
  </header>`;
}

/* ---------------- drawers ---------------- */
function sidebarHTML() {
  const sportAcc = BB.sports.map(s => `
    <div class="acc">
      <button class="acc-btn">${s.name} <span class="chev">▾</span></button>
      <div class="acc-panel">
        <ul>
          <li><a href="catalog.html?sport=${s.id}">All ${s.name}</a></li>
          ${s.categories.map(c => `<li><a href="catalog.html?sport=${s.id}&cat=${c.id}">${c.name}</a></li>`).join("")}
        </ul>
      </div>
    </div>`).join("");

  return `
  <aside class="drawer drawer-left" id="sidebar" aria-label="Menu">
    <div class="drawer-head">Browse Brutal Buy <button class="drawer-close" data-close-drawer>✕</button></div>
    <div class="drawer-body">
      ${sportAcc}
      <div class="acc">
        <button class="acc-btn">Lifestyle <span class="chev">▾</span></button>
        <div class="acc-panel"><ul>${BB.lifestyle.map(l => `<li><a href="catalog.html?cat=${encodeURIComponent(l.name)}">${l.name}</a></li>`).join("")}</ul></div>
      </div>
      <div class="acc">
        <button class="acc-btn">Pages <span class="chev">▾</span></button>
        <div class="acc-panel">
          <ul>
            <li><a href="brands.html">Brands</a></li>
            <li><a href="b2b.html">B2B / Wholesale</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="faqs.html">FAQs</a></li>
            <li><a href="withdrawal.html">Returns & Cancellation</a></li>
            <li><a href="account.html">My Account</a></li>
          </ul>
        </div>
      </div>
      <a class="sidebar-cta" href="catalog.html?tag=sale">🔥 Mega Sale — up to 45% off</a>
      <a class="sidebar-cta" href="b2b.html" style="background:var(--green);color:var(--text)">Team & bulk orders →</a>
    </div>
  </aside>`;
}

function searchHTML() {
  return `
  <aside class="drawer drawer-right" id="searchDrawer" aria-label="Search">
    <div class="drawer-head">Search <button class="drawer-close" data-close-drawer>✕</button></div>
    <div class="drawer-body search-wrap">
      <div class="search-field">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" id="searchInput" placeholder="Search gear, sports, brands…" autocomplete="off">
      </div>
      <div class="chips" id="searchChips">
        <button class="chip">cricket bat</button>
        <button class="chip">football boots</button>
        <button class="chip">badminton racquet</button>
        <button class="chip">running shoes</button>
        <button class="chip">shuttlecock</button>
        <button class="chip">gym gloves</button>
        <button class="chip">swimming goggles</button>
        <button class="chip">basketball</button>
      </div>
      <p class="search-hint">Most searched products</p>
      <div class="suggest" id="searchSuggest"></div>
    </div>
  </aside>`;
}

function cartHTML() {
  return `
  <aside class="drawer drawer-right" id="cartDrawer" aria-label="Cart">
    <div class="drawer-head">Your cart <button class="drawer-close" data-close-drawer>✕</button></div>
    <div class="drawer-body" id="cartItems"></div>
    <div class="drawer-foot" id="cartFooter" style="padding:18px 20px;border-top:1px solid var(--line)"></div>
  </aside>`;
}

function accountHTML() {
  return `
  <aside class="drawer drawer-right" id="accountDrawer" aria-label="Account">
    <div class="drawer-head">Sign in or create account <button class="drawer-close" data-close-drawer>✕</button></div>
    <div class="drawer-body">
      <button class="acc-drawer-btn" onclick="location.href='account.html'">
        <span style="width:38px;height:38px;border-radius:50%;background:var(--accent-strong)"></span>
        <span style="flex:1;text-align:left">Continue with Shop</span>
        <b style="color:#5A31F4">shop</b>
      </button>
      <div class="acc-row">
        <button class="acc-drawer-btn" style="justify-content:center" onclick="BB.toast('Google sign-in is a demo ✨')">G</button>
        <button class="acc-drawer-btn" style="justify-content:center" onclick="BB.toast('Facebook sign-in is a demo ✨')">f</button>
      </div>
      <div class="divider">OR</div>
      <form class="field" onsubmit="event.preventDefault();location.href='account.html'">
        <input type="email" placeholder="Email" required>
        <div style="display:flex;align-items:center;gap:8px;margin:10px 0 16px">
          <input type="checkbox" id="newsChk" style="accent-color:var(--accent-strong)">
          <label for="newsChk" style="font-size:13px;color:var(--text-dim)">Email me with news and offers</label>
        </div>
        <button class="btn btn-primary" style="width:100%">Continue with email →</button>
      </form>
      <div class="acc-row" style="margin-top:14px">
        <a class="acc-drawer-btn" style="justify-content:center" href="account.html#orders">📦 Orders</a>
        <a class="acc-drawer-btn" style="justify-content:center" href="account.html#profile">👤 Profile</a>
      </div>
    </div>
  </aside>`;
}

/* ---------------- footer ---------------- */
function footerHTML() {
  const year = new Date().getFullYear();
  const sportsLinks = BB.sports.slice(0, 8).map(s => `<a href="catalog.html?sport=${s.id}">${s.name}</a>`).join("");
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="logo" href="index.html"><img class="f-logo" src="assets/logo-dark.svg" alt="Brutal Buy"></a>
          <p class="f-desc">Brutal quality sports gear at brutal prices. From gully cricket to pro circuits — we outfit every athlete.</p>
          <div class="f-contact">
            <span>📞 +1 (555) 014-8899</span>
            <span>✉️ support@brutalbuy.com</span>
            <span>📍 Unit 14, Grand Sports Complex, TX</span>
          </div>
        </div>
        <div class="f-col">
          <h4>Shop Sports</h4>
          ${sportsLinks}
        </div>
        <div class="f-col">
          <h4>Company</h4>
          <a href="about.html">About Us</a>
          <a href="b2b.html">B2B / Wholesale</a>
          <a href="brands.html">Our Brands</a>
          <a href="contact.html">Contact</a>
          <a href="faqs.html">FAQs</a>
        </div>
        <div class="f-col">
          <h4>Support</h4>
          <a href="account.html">My Account</a>
          <a href="cart.html">Cart</a>
          <a href="withdrawal.html">Returns & Refunds</a>
          <a href="withdrawal.html">Order Cancellation</a>
          <a href="faqs.html">Help Center</a>
        </div>
        <div class="f-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} Brutal Buy. Built with ❤️ for athletes.</span>
        <div class="socials">
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="X">X</a>
          <a href="#" aria-label="YouTube">▶</a>
          <a href="#" aria-label="Facebook">f</a>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ---------------- drawer controller ---------------- */
function bindDrawerControls() {
  const overlay = document.getElementById("overlay");
  let openDrawer = null;

  function open(id, btn) {
    closeAll();
    openDrawer = document.getElementById(id);
    overlay.classList.add("show");
    openDrawer.classList.add("show");
    document.body.style.overflow = "hidden";
    if (btn) btn.classList.add("is-open");
  }

  function closeAll() {
    overlay.classList.remove("show");
    document.querySelectorAll(".drawer.show").forEach(d => d.classList.remove("show"));
    document.querySelectorAll(".hamburger.is-open").forEach(b => b.classList.remove("is-open"));
    document.body.style.overflow = "";
    openDrawer = null;
  }

  window.BB.closeDrawers = closeAll;

  const ham = document.getElementById("hamburger");
  ham && ham.addEventListener("click", () => open("sidebar", ham));
  document.getElementById("searchBtn")?.addEventListener("click", () => {
    open("searchDrawer");
    setTimeout(() => document.getElementById("searchInput")?.focus(), 420);
  });
  document.getElementById("cartBtn")?.addEventListener("click", () => open("cartDrawer"));
  document.getElementById("accountBtn")?.addEventListener("click", () => open("accountDrawer"));
  document.getElementById("storeBtn")?.addEventListener("click", () => BB.toast("3 stores near Downtown TX 📍"));

  overlay.addEventListener("click", closeAll);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
  document.querySelectorAll("[data-close-drawer]").forEach(b => b.addEventListener("click", closeAll));

  /* accordions */
  document.querySelectorAll(".acc-btn").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".acc").classList.toggle("open"));
  });

  /* cart line controls */
  document.getElementById("cartItems")?.addEventListener("click", e => {
    const q = e.target.closest("[data-qty]");
    const r = e.target.closest("[data-remove]");
    if (q) {
      const line = BB.cart.items.find(i => i.id === q.dataset.id);
      BB.cart.setQty(q.dataset.id, line.qty + Number(q.dataset.qty));
    }
    if (r) BB.cart.remove(r.dataset.remove);
  });
}

/* ---------------- live search ---------------- */
function bindSearch() {
  const input = document.getElementById("searchInput");
  const box = document.getElementById("searchSuggest");
  if (!input || !box) return;

  function mostSearched() {
    const picks = [];
    BB.sports.slice(0, 3).forEach(s => {
      const c = s.categories[0];
      picks.push(BB.products(s.id, c.id, c.sub[0], 0));
      picks.push(BB.products(s.id, c.id, c.sub[1] || c.sub[0], 1));
    });
    return picks;
  }

  function render(list) {
    box.innerHTML = list.map(p => `
      <a href="product.html?id=${p.id}">
        <img src="${p.img}" alt="">
        <span><span class="s-name">${BB.esc(p.name)}</span><br>
        <span class="s-meta">${p.sport} • ${p.cat} • ${BB.money(p.price)}</span></span>
      </a>`).join("") || `<p class="search-hint">No matches — try “bat”, “boots”, “racquet”…</p>`;
  }

  render(mostSearched());

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return render(mostSearched());
    const res = [];
    BB.sports.forEach(s => s.categories.forEach(c => c.sub.forEach(sub => {
      for (let i = 0; i < BB.count(s.id, c.id, sub); i++) {
        const p = BB.products(s.id, c.id, sub, i);
        if (res.length < 8) {
          const hay = `${p.name} ${p.sport} ${p.cat} ${p.sub} ${p.brand}`.toLowerCase();
          if (hay.includes(q)) res.push(p);
        }
      }
    })));
    render(res);
  });

  document.querySelectorAll("#searchChips .chip").forEach(c => {
    c.addEventListener("click", () => { input.value = c.textContent; input.dispatchEvent(new Event("input")); });
  });
}

/* ---------------- announcement rotator ---------------- */
function initAnnounce() {
  const msgs = document.querySelectorAll(".announce-msg");
  let i = 0;
  setInterval(() => {
    msgs[i].classList.remove("is-active");
    msgs[i].classList.add("is-leaving");
    const prev = i;
    i = (i + 1) % msgs.length;
    setTimeout(() => msgs[prev].classList.remove("is-leaving"), 500);
    msgs[i].classList.add("is-active");
  }, 3800);
}

/* ---------------- reveal on scroll ---------------- */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } });
}, { threshold: .12 });

BB.bindReveals = function (root = document) {
  root.querySelectorAll(".reveal:not(.in)").forEach(el => revealIO.observe(el));
};

/* ---------------- product card renderer ---------------- */
BB.productCard = function (p) {
  return `
  <article class="p-card">
    <a class="p-media" href="product.html?id=${p.id}">
      <img src="${p.img}" alt="${BB.esc(p.name)}" loading="lazy">
      <div class="p-badges">${p.badges.map(b => `<span class="badge ${b.cls}">${b.text}</span>`).join("")}</div>
    </a>
    <div class="p-actions">
      <button class="pa-btn" title="Add to wishlist" onclick="BB.toast('Saved to wishlist ♡')">♡</button>
      <button class="pa-btn" title="Quick view" onclick="BB.toast('Quick view — demo')">⤢</button>
      <button class="pa-btn" title="Compare" onclick="BB.toast('Added to compare')">⇄</button>
    </div>
    <button class="p-quick" onclick='BB.cart.add(${JSON.stringify(p).replace(/'/g, "&#39;")})'>Add to cart</button>
    <div class="p-info">
      <span class="p-cat">${p.sport} • ${p.sub}</span>
      <h3 class="p-name"><a href="product.html?id=${p.id}">${BB.esc(p.name)}</a></h3>
      <div class="stars">★ ${p.rating} <span style="color:var(--muted)">(${p.reviews})</span></div>
      <div class="p-price">
        <span class="now">${BB.money(p.price)}</span>
        ${p.was ? `<span class="was">${BB.money(p.was)}</span>` : ""}
      </div>
    </div>
  </article>`;
};

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  BB.theme.init();

  /* inject header/footer/drawers */
  const hHost = document.getElementById("site-header");
  if (hHost) hHost.innerHTML = headerHTML();
  const fHost = document.getElementById("site-footer");
  if (fHost) fHost.innerHTML = footerHTML();

  /* drawers appended to body */
  document.body.insertAdjacentHTML("beforeend",
    `<div class="overlay" id="overlay"></div>` +
    sidebarHTML() + searchHTML() + cartHTML() + accountHTML());

  bindDrawerControls();
  bindSearch();
  BB.cart.render();
  initAnnounce();
  BB.bindReveals();

  document.querySelectorAll(".theme-toggle").forEach(t =>
    t.addEventListener("click", BB.theme.toggle));

  /* logo swap per theme */
  const applyLogo = () => {
    const dark = document.documentElement.getAttribute("data-theme") !== "light";
    document.querySelectorAll("#logoImg, .f-logo").forEach(img => {
      img.src = dark ? "assets/logo-dark.svg" : "assets/logo.svg";
    });
  };
  applyLogo();
  document.querySelectorAll(".theme-toggle").forEach(t =>
    t.addEventListener("click", () => setTimeout(applyLogo, 60)));

  /* mark active nav by page */
  const nav = document.getElementById("nav");
  if (nav && BB.page.nav) {
    const link = Array.from(nav.querySelectorAll("a")).find(a =>
      a.getAttribute("href") === BB.page.nav);
    if (link) link.style.color = "var(--accent-strong)";
  }
});
