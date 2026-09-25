/* ============================================================
   BRUTAL BUY — Home sections
   Hero slider, trust bar, sports carousel, tabbed products,
   countdown deal, gear mosaics, masonry gallery, gear-type
   carousel, crowd favorites, marquee, video banner.
   ============================================================ */

/* BB global comes from data.js */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- HERO SLIDER ---------- */
  const hero = document.getElementById("hero");
  if (hero) {
    hero.innerHTML = BB.heroSlides.map((s, i) => `
      <div class="hero-slide ${i === 0 ? "is-active" : ""}" data-i="${i}">
        <div class="hero-bg" style="background-image:url('${s.img}')"></div>
        <div class="container">
          <div class="hero-content">
            <span class="hero-tag">${s.tag}</span>
            <h1 class="hero-title">${s.title}</h1>
            <p class="hero-sub">${s.sub}</p>
            <div class="hero-ctas">
              <a class="btn btn-primary" href="${s.cta1.href}">${s.cta1.label}</a>
              <a class="btn btn-ghost" href="${s.cta2.href}">${s.cta2.label}</a>
            </div>
          </div>
        </div>
      </div>`).join("") + `
      <button class="hero-arrow prev" aria-label="Previous slide">‹</button>
      <button class="hero-arrow next" aria-label="Next slide">›</button>
      <div class="hero-dots">
        ${BB.heroSlides.map((_, i) => `<button class="hero-dot ${i === 0 ? "is-active" : ""}" data-go="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}
      </div>`;

    const slides = hero.querySelectorAll(".hero-slide");
    const dots = hero.querySelectorAll(".hero-dot");
    let cur = 0, timer;

    function go(n) {
      slides[cur].classList.remove("is-active");
      dots[cur].classList.remove("is-active");
      cur = (n + slides.length) % slides.length;
      const s = slides[cur];
      s.classList.add("is-active");
      dots[cur].classList.add("is-active");
      /* restart ken-burns */
      const bg = s.querySelector(".hero-bg");
      bg.style.animation = "none"; void bg.offsetWidth; bg.style.animation = "";
    }

    function auto() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000); }

    hero.querySelector(".prev").addEventListener("click", () => { go(cur - 1); auto(); });
    hero.querySelector(".next").addEventListener("click", () => { go(cur + 1); auto(); });
    dots.forEach(d => d.addEventListener("click", () => { go(+d.dataset.go); auto(); }));
    auto();
  }

  /* ---------- TRUST BAR ---------- */
  const trust = document.getElementById("trustBar");
  if (trust) {
    const items = [
      ["🚚", "Free Shipping", "On orders over $75"],
      ["↩️", "30-Day Returns", "No-questions refunds"],
      ["🛡️", "2-Year Warranty", "On all pro gear"],
      ["🏅", "500+ Brands", "One brutal marketplace"]
    ];
    trust.innerHTML = items.map(([e, t, s]) => `
      <div class="trust-item reveal" data-delay="${items.indexOf([e, t, s]) + 1}">
        <span style="font-size:24px">${e}</span>
        <span><b>${t}</b><small>${s}</small></span>
      </div>`).join("");
  }

  /* ---------- SPORTS CIRCLES ---------- */
  const sports = document.getElementById("sportsCarousel");
  if (sports) {
    sports.innerHTML = BB.sports.map((s, i) => `
      <a class="sport-circle reveal" data-delay="${(i % 5) + 1}" href="catalog.html?sport=${s.id}">
        <span class="sc-img" style="background-image:url('${BB.img(s.id in { cricket: 1, football: 1, badminton: 1, tennis: 1, basketball: 1, running: 1, cycling: 1, swimming: 1, volleyball: 1, hockey: 1, "table-tennis": 1, squash: 1, "gym-fitness": 1 } ? s.id : "gear", i, 300, 300)}')"></span>
        <span class="sc-name">${s.name}</span>
      </a>`).join("");
    bindCarouselNav("sportsCarousel");
  }

  /* ---------- TABBED PRODUCTS ---------- */
  const tabsHost = document.getElementById("productTabs");
  if (tabsHost) {
    const tabs = [
      { id: "best", label: "Best Sellers" },
      { id: "new", label: "New Arrivals" },
      { id: "sale", label: "On Sale" }
    ];
    tabsHost.innerHTML = `
      <div class="tabs">${tabs.map((t, i) => `<button class="tab ${i === 0 ? "is-active" : ""}" data-tab="${t.id}">${t.label}</button>`).join("")}</div>
      ${tabs.map((t, i) => {
        let pool = [];
        BB.sports.slice(0, 4).forEach(s => s.categories.slice(0, 2).forEach(c => c.sub.slice(0, 2).forEach(sub => pool.push(BB.products(s.id, c.id, sub, t.id === "sale" ? 0 : i + 2)))));
        if (t.id === "sale") pool = pool.filter(p => p.sale);
        if (t.id === "new") pool = pool.filter(p => p.badges.some(b => b.text === "NEW"));
        if (pool.length < 8) pool = pool.concat(BB.subsOf("football").slice(0, 8).map(x => BB.products("football", x.cat.id, x.sub, 3)));
        return `<div class="tab-panel ${i === 0 ? "is-active" : ""}" data-panel="${t.id}">
          <div class="product-grid cols-5">${pool.slice(0, 10).map(p => BB.productCard(p)).join("")}</div>
        </div>`;
      }).join("")}`;

    tabsHost.querySelectorAll(".tab").forEach(t => {
      t.addEventListener("click", () => {
        tabsHost.querySelectorAll(".tab").forEach(x => x.classList.remove("is-active"));
        tabsHost.querySelectorAll(".tab-panel").forEach(x => x.classList.remove("is-active"));
        t.classList.add("is-active");
        tabsHost.querySelector(`[data-panel="${t.dataset.tab}"]`).classList.add("is-active");
      });
    });
  }

  /* ---------- DEAL + COUNTDOWN ---------- */
  const deal = document.getElementById("dealBanner");
  if (deal) {
    deal.innerHTML = `
      <div class="deal reveal">
        <div class="deal-inner">
          <span class="hero-tag">Deal of the Week</span>
          <h2 class="section-title" style="margin:14px 0 8px;font-size:clamp(28px,3.6vw,42px)">Pro Kit — Up to 45% Off</h2>
          <p style="color:var(--text-dim);max-width:460px">Match-grade gear bundles for cricket, football and court sports. When it's gone, it's gone.</p>
          <div class="countdown" id="countdown">
            <div class="cd-box"><span class="cd-num" id="cdD">02</span><span class="cd-lbl">Days</span></div>
            <div class="cd-box"><span class="cd-num" id="cdH">08</span><span class="cd-lbl">Hours</span></div>
            <div class="cd-box"><span class="cd-num" id="cdM">45</span><span class="cd-lbl">Mins</span></div>
            <div class="cd-box"><span class="cd-num" id="cdS">12</span><span class="cd-lbl">Secs</span></div>
          </div>
          <div style="display:flex;gap:12px;margin-top:26px;flex-wrap:wrap">
            <a class="btn btn-primary" href="catalog.html?tag=sale">Shop the deal</a>
            <a class="btn btn-ghost" href="catalog.html?sport=cricket&cat=bats">View bats</a>
          </div>
        </div>
      </div>`;

    /* countdown to 2d8h45m from load, flipping digits */
    let t = ((2 * 24 + 8) * 60 + 45) * 60 * 1000;
    const $ = id => document.getElementById(id);
    const set = (id, v) => {
      const el = $(id);
      const val = String(v).padStart(2, "0");
      if (el.textContent !== val) {
        el.textContent = val;
        el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip");
      }
    };
    setInterval(() => {
      t -= 1000;
      if (t < 0) t = 0;
      const d = Math.floor(t / 86400000), h = Math.floor(t / 3600000) % 24,
        m = Math.floor(t / 60000) % 60, s = Math.floor(t / 1000) % 60;
      set("cdD", d); set("cdH", h); set("cdM", m); set("cdS", s);
    }, 1000);
  }

  /* ---------- GEAR MOSAIC (2 pages) ---------- */
  const gear = document.getElementById("gearMosaic");
  if (gear) {
    const pages = [
      [
        { label: "Cricket Bats", cls: "wide tall", href: "catalog.html?sport=cricket&cat=bats", pool: "cricket", i: 0 },
        { label: "Football Boots", cls: "", href: "catalog.html?sport=football&cat=boots", pool: "football", i: 1 },
        { label: "Shuttlecocks", cls: "", href: "catalog.html?sport=badminton&cat=shuttlecocks", pool: "badminton", i: 2 },
        { label: "Tennis Racquets", cls: "wide", href: "catalog.html?sport=tennis&cat=racquets", pool: "tennis", i: 0 },
        { label: "Basketballs", cls: "", href: "catalog.html?sport=basketball&cat=balls", pool: "basketball", i: 0 },
        { label: "Running Shoes", cls: "", href: "catalog.html?sport=running&cat=shoes", pool: "running", i: 0 }
      ],
      [
        { label: "Volleyball", cls: "", href: "catalog.html?sport=volleyball", pool: "volleyball", i: 0 },
        { label: "Swimming", cls: "tall", href: "catalog.html?sport=swimming", pool: "swimming", i: 0 },
        { label: "Rugby", cls: "", href: "catalog.html?sport=hockey", pool: "hockey", i: 1 },
        { label: "Cycling", cls: "wide", href: "catalog.html?sport=cycling", pool: "cycling", i: 0 },
        { label: "Gym & Fitness", cls: "", href: "catalog.html?sport=gym-fitness", pool: "gym-fitness", i: 0 },
        { label: "Table Tennis", cls: "", href: "catalog.html?sport=table-tennis", pool: "table-tennis", i: 0 }
      ]
    ];
    let pg = 0;
    function render() {
      gear.innerHTML = `<div class="gear-grid">${pages[pg].map(t => `
        <a class="gear-tile ${t.cls} reveal in" href="${t.href}">
          <span class="g-img" style="background-image:url('${BB.img(t.pool, t.i, 900, 700)}')"></span>
          <span class="g-label">${t.label}</span>
        </a>`).join("")}</div>`;
      /* re-trigger tile animations */
      gear.querySelectorAll(".gear-tile").forEach((el, i) => {
        el.style.animation = `fadeUp .6s cubic-bezier(.22,.68,0,1) ${i * 70}ms both`;
      });
    }
    render();
    const navBtns = document.getElementById("gearNav");
    if (navBtns) {
      navBtns.innerHTML = `
        <button class="c-btn" id="gearPrev">‹</button>
        <button class="c-btn" id="gearNext">›</button>`;
      document.getElementById("gearPrev").addEventListener("click", () => { pg = (pg + 1) % 2; render(); });
      document.getElementById("gearNext").addEventListener("click", () => { pg = (pg + 1) % 2; render(); });
    }
  }

  /* ---------- MASONRY GALLERY ---------- */
  const gal = document.getElementById("gallery");
  if (gal) {
    const caps = ["Match day energy", "Court legends", "Track nation", "Squad goals", "Sunrise run club", "Game face on", "Street hoops", "Pool push", "Spin kings", "Smash point", "Turbo miles", "Iron circuit"];
    gal.innerHTML = caps.map((c, i) => `
      <a href="catalog.html?tag=new" data-delay="${(i % 4) + 1}">
        <span class="m-img reveal" style="display:block;height:${180 + (i % 3) * 60}px;background-image:url('${BB.img("gallery", i, 500, 620)}')"></span>
        <span class="m-cap">${c}</span>
      </a>`).join("");
  }

  /* ---------- GEAR TYPE CARDS ---------- */
  const gt = document.getElementById("gearTypes");
  if (gt) {
    gt.innerHTML = BB.gearTypes.map((g, i) => `
      <a class="gtype gt-c${(i % 6) + 1} reveal" data-delay="${(i % 5) + 1}" href="catalog.html?cat=${encodeURIComponent(g.name)}">
        <span class="gt-emoji">${g.emoji}</span>
        <span><b>${g.name}</b><br><small>${g.count} products</small></span>
      </a>`).join("");
    bindCarouselNav("gearTypesWrap");
  }

  /* ---------- CROWD FAVORITES ---------- */
  const cf = document.getElementById("crowdGrid");
  if (cf) {
    const picks = [];
    BB.sports.slice(0, 8).forEach(s => {
      const c = s.categories[0];
      picks.push({ p: BB.products(s.id, c.id, c.sub[0], 5), label: s.name });
    });
    cf.innerHTML = picks.map(x => `
      <a class="cf-tile reveal" data-delay="${(picks.indexOf(x) % 4) + 1}"
         style="background-image:url('${x.p.img}')"
         href="product.html?id=${x.p.id}" data-label="${x.label} — ${BB.money(x.p.price)}"></a>`).join("");
  }

  /* ---------- MARQUEE ---------- */
  const mq = document.getElementById("marquee");
  if (mq) {
    const chunk = BB.marquee.map(m => `<span>${m}</span>`).join("");
    mq.innerHTML = `<div class="marquee-track">${chunk}${chunk}</div>`;
  }

  /* ---------- VIDEO BANNER ---------- */
  const vb = document.getElementById("videoBanner");
  if (vb) {
    vb.innerHTML = `
      <div class="vb-inner">
        <h2>Here to Help. <em>Plays Hard.</em></h2>
        <p style="color:var(--text-dim);margin-top:10px">Watch how pros train with Brutal Buy gear</p>
        <button class="vb-play" aria-label="Play video" onclick="BB.toast('Video player is a demo ▶')">▶</button>
      </div>`;
  }

  /* ---------- NEWSLETTER ---------- */
  const nl = document.getElementById("newsletter");
  if (nl) {
    nl.innerHTML = `
      <div class="newsletter reveal">
        <div>
          <h3>Join the Brutal List ⚡</h3>
          <p>Early drops, training tips and members-only pricing. No spam — just gear.</p>
        </div>
        <form class="nl-form" onsubmit="event.preventDefault();this.reset();BB.toast('You are on the list! 🎉')">
          <input type="email" placeholder="Your email address" required>
          <button class="btn btn-primary">Subscribe</button>
        </form>
      </div>`;
  }

  BB.bindReveals();

  /* ---------- carousel nav helper ---------- */
  function bindCarouselNav(hostId) {
    const host = document.getElementById(hostId);
    const wrap = document.getElementById(hostId + "Wrap") || host;
    const track = host.querySelector ? host.querySelector(".carousel-track") || host : host;
    const prev = wrap.querySelector(".c-btn.prev");
    const next = wrap.querySelector(".c-btn.next");
    if (!prev || !next) return;
    prev.addEventListener("click", () => track.scrollBy({ left: -340, behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: 340, behavior: "smooth" }));
  }
});
