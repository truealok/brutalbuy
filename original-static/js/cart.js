/* ============================================================
   BRUTAL BUY — Cart page
   ============================================================ */
/* BB global comes from data.js */

document.addEventListener("DOMContentLoaded", () => {
  const host = document.getElementById("cartPage");
  if (!host) return;

  function render() {
    if (!BB.cart.items.length) {
      host.innerHTML = `
        <div class="cart-empty" style="padding:90px 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="width:80px;height:80px;margin:0 auto 16px"><circle cx="9" cy="21" r="1.6"/><circle cx="19" cy="21" r="1.6"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L23 7H6"/></svg>
          <h2 style="font-weight:900;margin-bottom:8px">Your cart is empty</h2>
          <p style="color:var(--muted);margin-bottom:22px">Brutal gear awaits. Go pick your weapon.</p>
          <a class="btn btn-primary" href="catalog.html">Continue shopping</a>
        </div>`;
      return;
    }

    const rows = BB.cart.items.map(i => `
      <div class="cart-item" style="padding:18px 0">
        <img src="${i.img}" style="width:92px;height:92px" alt="">
        <div style="flex:1">
          <div class="ci-name" style="font-size:15px">${BB.esc(i.name)}</div>
          <div style="font-size:12.5px;color:var(--muted)">${BB.esc(i.sport || "")} ${i.cat ? "• " + i.cat : ""} ${i.sub ? "• " + i.sub : ""}</div>
          <div class="qty">
            <button data-qty="-1" data-id="${i.id}">−</button><b>${i.qty}</b><button data-qty="1" data-id="${i.id}">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:900;color:var(--accent-strong);font-size:16px">${BB.money(i.price * i.qty)}</div>
          <button data-remove="${i.id}" style="background:none;border:0;color:var(--muted);font-size:12px;text-decoration:underline;margin-top:8px">Remove</button>
        </div>
      </div>`).join("");

    const sub = BB.cart.total();
    const ship = sub >= 75 ? 0 : 9;
    const disc = sub >= 200 ? Math.round(sub * 0.05) : 0;

    host.innerHTML = `
      <div style="display:grid;grid-template-columns:1.6fr .9fr;gap:30px;align-items:start" class="cart-cols">
        <div class="contact-card">${rows}</div>
        <div class="contact-card" style="position:sticky;top:130px">
          <h3 style="font-weight:900;margin-bottom:16px">Order Summary</h3>
          <div style="display:grid;gap:10px;font-size:14px;color:var(--text-dim)">
            <div style="display:flex;justify-content:space-between"><span>Subtotal</span><b style="color:var(--text)">${BB.money(sub)}</b></div>
            ${disc ? `<div style="display:flex;justify-content:space-between"><span>Bulk discount (5%)</span><b style="color:#7FB77E">−${BB.money(disc)}</b></div>` : ""}
            <div style="display:flex;justify-content:space-between"><span>Shipping</span><b style="color:var(--text)">${ship ? BB.money(ship) : "FREE"}</b></div>
          </div>
          <div style="border-top:1px solid var(--line);margin:16px 0;padding-top:16px;display:flex;justify-content:space-between;font-weight:900;font-size:18px">
            <span>Total</span><span style="color:var(--accent-strong)">${BB.money(sub - disc + ship)}</span>
          </div>
          <button class="btn btn-primary" style="width:100%" onclick="BB.toast('Checkout is a demo — order placed 🎉')">Place order</button>
          <a class="btn btn-ghost" style="width:100%;margin-top:10px" href="catalog.html">Keep shopping</a>
        </div>
      </div>`;

    host.querySelectorAll("[data-qty]").forEach(b => b.addEventListener("click", () => {
      const line = BB.cart.items.find(i => i.id === b.dataset.id);
      BB.cart.setQty(b.dataset.id, line.qty + Number(b.dataset.qty));
    }));
    host.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => BB.cart.remove(b.dataset.id)));
  }

  BB.cart.render = (function (orig) {
    return function () { orig.call(BB.cart); if (document.getElementById("cartPage")) render(); };
  })(BB.cart.render);

  render();
});
