/* ============================================================
   BRUTAL BUY — Page behaviours
   Logic that used to live in inline <script> blocks on the static
   pages: FAQs, B2B feature sections, brand grid, the account
   dashboard tabs, and the shared demo-form toast handler.

   Every block is guarded, so loading this file everywhere is safe.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- shared: demo forms ----------------
     Any <form data-demo-toast="…"> shows a toast and resets instead of
     posting. Replace with a real form endpoint when you go live. */
  document.querySelectorAll("form[data-demo-toast]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const msg = form.dataset.demoToast || "Sent ✓";
      form.reset();
      BB.toast(msg);
    });
  });

  /* ---------------- FAQs ---------------- */
  const faqList = document.getElementById("faqList");
  if (faqList) {
    const faqs = [
      ["How fast is shipping?", "Orders over $75 ship free and arrive in 2–5 business days. Smaller orders ship for a flat $9. Every parcel is tracked from our warehouse to your door."],
      ["What is your return policy?", "30 days, no questions asked. Start a return or cancellation from the Withdrawal page with your Order ID and email — refunds hit your original payment method within 5 business days of pickup."],
      ["Do you price match?", "Yes. Send us the competitor link via Contact and we'll match any identical in-stock product from an authorized seller."],
      ["Can I order for my team or academy?", "Absolutely — that's our B2B desk. Bulk pricing starts at 10 units, with custom jersey printing and logo embroidery available. Request a quote on the B2B page."],
      ["How do I choose the right cricket bat?", "Filter by willow grade under Cricket → Bats. English willow for match play, Kashmir for practice and value. Every bat page lists weight range and handle type."],
      ["Are your products genuine?", "100%. We source directly from brand factories and authorized distributors. Every item carries the 2-year Brutal Buy warranty."],
      ["Do you ship internationally?", "We currently ship across the US and Canada, with EU and India launch coming this year. Join the newsletter for launch alerts."],
      ["How do I track my order?", "Open Account → Orders and click any order to see live tracking, or use the link in your shipping confirmation email."]
    ];

    faqList.innerHTML = faqs.map(([q, a], i) => `
      <div class="faq-item reveal" data-delay="${(i % 4) + 1}">
        <button class="faq-q">${q} <span class="chev">＋</span></button>
        <div class="faq-a"><p>${a}</p></div>
      </div>`).join("");

    faqList.querySelectorAll(".faq-q").forEach(b =>
      b.addEventListener("click", () => b.closest(".faq-item").classList.toggle("open")));

    BB.bindReveals();
  }

  /* ---------------- B2B feature sections ---------------- */
  const b2bHost = document.getElementById("b2bSections");
  if (b2bHost) {
    const icons = { "bulk-orders": "📦", "customization": "🎨", "wholesale": "🏷️", "bulk-enquiry": "📝" };
    b2bHost.innerHTML = BB.b2b.map((b, i) => `
      <section class="contact-card reveal" id="${b.id}" data-delay="${(i % 4) + 1}">
        <div style="font-size:30px">${icons[b.id] || "⚡"}</div>
        <h3 style="font-weight:900;font-size:22px;margin:10px 0 6px">${b.name}</h3>
        <p style="color:var(--text-dim);font-size:14.5px;margin-bottom:14px">
          ${b.sub.join(" • ")} — handled by a dedicated Brutal Buy account manager from quote to delivery.
        </p>
        <a class="section-link" href="/pages/contact">Talk to the team →</a>
      </section>`).join("");
    BB.bindReveals();
  }

  /* ---------------- Brand grid ---------------- */
  const brandGrid = document.getElementById("brandGrid");
  if (brandGrid) {
    brandGrid.innerHTML = BB.brands.map((b, i) => `
      <a class="brand-card reveal" data-delay="${(i % 4) + 1}" href="/pages/catalog?brand=${b.id}">
        <div class="b-logo">${b.name}</div>
        <p>${b.blurb}</p>
        <span class="section-link" style="margin-top:12px;display:inline-flex">Shop ${b.name} →</span>
      </a>`).join("");
    BB.bindReveals();
  }

  /* ---------------- Account dashboard ---------------- */
  const accMain = document.getElementById("accMain");
  if (accMain) {
    /* wishlist: three demo favourites */
    const wishGrid = document.getElementById("wishGrid");
    if (wishGrid) {
      const wSport = BB.sports[0], wCat = wSport.categories[0];
      wishGrid.innerHTML = [0, 1, 2]
        .map(i => BB.productCard(BB.products(wSport.id, wCat.id, wCat.sub[0], i)))
        .join("");
    }

    /* tab switching with deep links (#orders / #profile) */
    const links = document.querySelectorAll(".acc-side a[data-tab]");
    function show(tab) {
      document.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== tab);
      links.forEach(a => a.classList.toggle("is-active", a.dataset.tab === tab));
    }
    links.forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      history.replaceState(null, "", "#" + a.dataset.tab);
      show(a.dataset.tab);
    }));
    if (location.hash) show(location.hash.slice(1));
  }
});
