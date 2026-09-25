# Brutal Buy — Sports E-commerce UI

A complete, fully navigable multi-page sports e-commerce front-end inspired by the reference
video, rebranded with the **Brutal Buy** identity (dark green `#122A1D` / `#1E3A2A` + tan
`#D98E5F` / `#E8B4A0` taken from the brand logo).

Dark mode is the default and uses the project's **dark code color scheme**
(`#0F130F` base, `#F2E9DC` text, tan accents). A light preset ships too — toggle it from the
switch in the header (preference is remembered in `localStorage`).

## Run it

Option 1 — just open `index.html` in a browser.
Option 2 (recommended, for clean URLs):

```bash
npx serve .
# or
python -m http.server 8080
```

## Pages (all connected & clickable)

| Page | What's inside |
|---|---|
| `index.html` | Hero slider (4 slides, ken-burns + staggered text), trust bar, 13-sport circle carousel, tabbed products (Best/New/Sale), countdown deal, gear mosaic (2 switchable pages), masonry gallery, gear-type cards, crowd favorites grid, marquee, video banner, newsletter |
| `catalog.html` | Deep navigable catalog — `?sport=` → `&cat=` → `&sub=` → product. Sub-category chips, brand/sport/price filters, sorting, pagination. Also `?brand=`, `?tag=sale/new` |
| `product.html` | PDP with gallery thumbs, color/size pickers, quantity, add-to-cart, related products |
| `cart.html` | Full cart with totals, bulk discount, shipping logic |
| `brands.html` | 8 brand cards → each opens its filtered catalog |
| `b2b.html` | Bulk orders, customization, wholesale, quote request form (anchored sections) |
| `about.html`, `contact.html`, `faqs.html` | Content pages with animated accordions |
| `account.html` | Orders / Profile / Wishlist / Addresses dashboard (`#orders`, `#profile` deep links) |
| `withdrawal.html` | Return & cancellation request form (as shown in the video) |

## Global UI (on every page)

- Rotating announcement bar
- Sticky header with logo, **hamburger sidebar** (accordions per sport → category), 8-item nav
- **Mega menus**: All Sports (3 grouped columns, each sport lists its categories), Lifestyle
  (5 columns), B2B dropdown, Brands dropdown — all with promo cards
- **Search drawer** with chips + live suggestions across the whole catalog
- **Cart drawer** with quantity controls, subtotal, checkout link (persists via localStorage)
- **Account drawer**: Shop / Google / Facebook / email sign-in, Orders & Profile shortcuts
- Theme toggle (dark 🌙 / light ☀️), store-locator toast, cart badge pop animation

## Animations

Announcement rotation · mega menu slide-fade · nav underline wipe · drawer slides + overlay
fade · hero ken-burns + staggered copy · dot/arrow transitions · scroll-reveal on every
section · card lift + image zoom · hover action buttons (wishlist/quick-view/compare) ·
quick-add button rise · countdown digit flips · marquee scroll (pauses on hover) · mosaic
tile stagger · masonry caption slides · gear-card bounce · crowd-favorite zoom · play-button
pulse · button shine sweep · badge pop · accordion expand · FAQ plus-rotate · toast spring.

## Structure

```
BrutalBuy-UI/
├── index.html, catalog.html, product.html, cart.html, brands.html,
│   b2b.html, about.html, contact.html, faqs.html, account.html, withdrawal.html
├── css/styles.css        # both themes + every animation
├── js/
│   ├── data.js           # catalog engine: 13 sports → categories → sub-types → generated products
│   ├── main.js           # header, drawers, mega menus, search, cart, theme, reveal
│   ├── home.js           # all homepage sections
│   ├── catalog.js        # catalog page (filters/sort/pagination)
│   ├── product.js        # PDP
│   └── cart.js           # cart page
└── assets/logo.svg, logo-dark.svg   # brand logos (light & dark wordmark)
```

Product imagery loads from Unsplash's CDN (needs internet). Everything else is 100% offline.
