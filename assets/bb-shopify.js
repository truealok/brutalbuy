/* ============================================================
   BRUTAL BUY — Shopify integration layer

   Only loaded by the real Shopify templates (product, collection,
   cart, search). Enhances the native <form action="/cart/add">
   submissions into AJAX adds, wires the variant picker, and keeps
   the header cart badge in sync with Shopify's actual cart.

   Everything degrades gracefully: with JS off, the native forms
   still add to cart and still check out.
   ============================================================ */

(function () {
  var cfg = (window.BB_CONFIG || {});
  var routes = cfg.routes || {};

  function money(cents) {
    var n = (cents / 100).toFixed(2);
    return (cfg.currencySymbol || "$") + n;
  }

  /* ---------- cart badge ---------- */
  function setBadge(count) {
    var badge = document.querySelector(".cart-count");
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
  }

  function refreshCart() {
    return fetch(routes.cartJs || "/cart.js", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        setBadge(cart.item_count);
        return cart;
      })
      .catch(function () { return null; });
  }

  function toast(msg) {
    if (window.BB && BB.toast) BB.toast(msg);
  }

  /* ---------- AJAX add to cart (product cards, PDP) ---------- */
  function bindAjaxForms() {
    document.querySelectorAll("form[data-bb-ajax-cart]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector("[type=submit]");
        if (btn) btn.disabled = true;

        fetch(routes.addToCart || "/cart/add.js", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        })
          .then(function (r) {
            if (!r.ok) return r.json().then(function (err) { throw err; });
            return r.json();
          })
          .then(function () { return refreshCart(); })
          .then(function (cart) {
            toast("Added to cart — " + (cart ? cart.item_count : 1) + " item(s) 🛒");
          })
          .catch(function (err) {
            toast((err && (err.description || err.message)) || "Could not add to cart");
          })
          .finally(function () {
            if (btn) btn.disabled = false;
          });
      });
    });
  }

  /* ---------- quantity steppers ---------- */
  function bindQuantity() {
    var minus = document.getElementById("qMinus");
    var plus = document.getElementById("qPlus");
    var val = document.getElementById("qVal");
    var input = document.getElementById("qInput");
    if (!minus || !plus || !val) return;

    var q = 1;
    function paint() {
      val.textContent = q;
      if (input) input.value = q;
    }
    minus.addEventListener("click", function () { q = Math.max(1, q - 1); paint(); });
    plus.addEventListener("click", function () { q += 1; paint(); });
  }

  /* ---------- gallery thumbs ---------- */
  function bindGallery() {
    var thumbs = document.getElementById("pdpThumbs");
    var main = document.getElementById("pdpMain");
    if (!thumbs || !main) return;
    thumbs.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      thumbs.querySelectorAll("button").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      main.style.backgroundImage = "url('" + b.dataset.img + "')";
    });
  }

  /* ---------- variant picker ----------
     Option buttons set the matching <option> on #bbVariantId, which the native
     form then posts. Keeps JS-optional while still feeling like the demo PDP. */
  function bindVariants() {
    var select = document.getElementById("bbVariantId");
    if (!select) return;

    var priceEl = document.querySelector("#bbPrice .now");
    var compareEl = document.querySelector("#bbPrice .was");
    var btnPrice = document.getElementById("bbBtnPrice");
    var addBtn = document.getElementById("bbAddToCart");

    function currentVariant() {
      return select.options[select.selectedIndex];
    }

    function syncButtons() {
      var v = currentVariant();
      if (!v) return;
      document.querySelectorAll(".opt[data-option-position]").forEach(function (b) {
        var pos = "option" + b.dataset.optionPosition;
        b.classList.toggle("is-active", (v.dataset[pos] || "") === b.dataset.value);
      });
    }

    function syncPrice() {
      var v = currentVariant();
      if (!v) return;
      if (priceEl) priceEl.textContent = v.dataset.price;
      if (compareEl) {
        // data-compare holds compare_at_price in cents; 0 means no sale price.
        compareEl.style.display = Number(v.dataset.compare) > 0 ? "" : "none";
      }
      if (btnPrice) btnPrice.textContent = v.dataset.price;
      if (addBtn) addBtn.disabled = v.disabled;
      syncButtons();
    }

    select.addEventListener("change", syncPrice);

    document.querySelectorAll(".opt[data-option-position]").forEach(function (b) {
      b.addEventListener("click", function () {
        var pos = b.dataset.optionPosition;
        var wanted = b.dataset.value;
        var match = Array.prototype.find.call(select.options, function (o) {
          return (o.dataset["option" + pos] || "") === wanted && !o.disabled;
        });
        if (match) {
          select.value = match.value;
          syncPrice();
        }
      });
    });

    syncPrice();
  }

  /* ---------- cart page: auto-submit on quantity change ---------- */
  function bindCartPage() {
    var form = document.querySelector("form[data-bb-cart-form]");
    if (!form) return;
    form.querySelectorAll('input[name="updates[]"]').forEach(function (input) {
      input.addEventListener("change", function () { form.submit(); });
    });
  }

  /* ---------- real pages: cart icon goes to the real Shopify cart ----------
     The demo drawer shows the localStorage cart, which would be empty here,
     so on real templates the icon navigates to /cart instead. */
  function redirectCartButton() {
    var btn = document.getElementById("cartBtn");
    if (!btn) return;
    var fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = routes.shopifyCart || "/cart";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindAjaxForms();
    bindQuantity();
    bindGallery();
    bindVariants();
    bindCartPage();
    redirectCartButton();
    /* Sync the badge with the server-rendered count. */
    var initial = cfg.cartItemCount;
    if (typeof initial === "number") setBadge(initial);
  });
})();
