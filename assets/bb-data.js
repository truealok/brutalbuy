/* ============================================================
   BRUTAL BUY — Catalog Data Engine
   Deep sports catalog: Sport → Category → Sub-type → Products.
   Deterministic generation so every click in the video's
   structure lands on a real, navigable page.
   ============================================================ */

const BB = window.BB || (window.BB = {});

/* ---------- Sports tree (mirrors the mega menu in the video) ---------- */
BB.sports = [
  {
    id: "cricket", name: "Cricket",
    categories: [
      { id: "bats", name: "Bats", sub: ["Kashmir Willow", "English Willow", "Training Bats", "Junior Bats"] },
      { id: "balls", name: "Balls", sub: ["Leather Balls", "Tennis Balls", "Practice Balls", "Wind Balls"] },
      { id: "battting-gloves", name: "Batting Gloves", sub: ["Test Gloves", "Club Gloves", "Junior Gloves"] },
      { id: "helments", name: "Helmets", sub: ["Titanium Grill", "Steel Grill", "Youth Helmets"] },
      { id: "pads", name: "Pads & Guards", sub: ["Batting Pads", "Keeping Pads", "Thigh Guards", "Arm Guards"] },
      { id: "kit-bags", name: "Kit Bags", sub: ["Duffle Kits", "Wheelie Kits", "Cover Sets"] }
    ]
  },
  {
    id: "football", name: "Football",
    categories: [
      { id: "boots", name: "Football Boots", sub: ["Firm Ground", "Soft Ground", "Artificial Grass", "Turf & Indoor"] },
      { id: "footballs", name: "Footballs", sub: ["Match Balls", "Training Balls", "Futsal Balls", "Beach Soccer"] },
      { id: "shin-guards", name: "Shin Guards", sub: ["Slip-in Guards", "Strap Guards", "Keeper Gloves"] },
      { id: "jerseys", name: "Jerseys & Kits", sub: ["Match Jerseys", "Training Kits", "Goalkeeper Kits", "Shorts & Socks"] },
      { id: "goalkeeping", name: "Goalkeeping", sub: ["Keeper Gloves", "Keeper Pants", "Training Gear"] },
      { id: "training", name: "Training", sub: ["Cones & Ladders", "Bibs & Markers", "Rebounders", "Bags"] }
    ]
  },
  {
    id: "badminton", name: "Badminton",
    categories: [
      { id: "racquets", name: "Racquets", sub: ["Head Heavy", "Even Balance", "Head Light", "Junior Racquets"] },
      { id: "shuttlecocks", name: "Shuttlecocks", sub: ["Feather Shuttles", "Nylon Shuttles", "Training Tubes"] },
      { id: "strings", name: "Strings & Grip", sub: ["Repulsion Strings", "Control Strings", "Grips & Tapes"] },
      { id: "kit", name: "Apparel", sub: ["Match Kits", "Shorts & Skirts", "Socks", "Bags"] },
      { id: "shoes", name: "Shoes", sub: ["Pro Court", "Club Court", "Beginner"] }
    ]
  },
  {
    id: "tennis", name: "Tennis",
    categories: [
      { id: "racquets", name: "Racquets", sub: ["Power Frames", "Control Frames", "Kids Racquets"] },
      { id: "balls", name: "Balls", sub: ["Pressurized", "Pressureless", "Stage Balls"] },
      { id: "strings", name: "Strings", sub: ["Polyester", "Multifilament", "Natural Gut"] },
      { id: "bags", name: "Bags", sub: ["Thermal Bags", "Backpacks", "Trolleys"] },
      { id: "accessories", name: "Accessories", sub: ["Dampeners", "Vibration Stops", "Court Clips"] }
    ]
  },
  {
    id: "basketball", name: "Basketball",
    categories: [
      { id: "balls", name: "Balls", sub: ["Indoor", "Outdoor", "Composite", "Mini Balls"] },
      { id: "hoops", name: "Hoops & Systems", sub: ["Wall Mounted", "Portable Systems", "In-ground"] },
      { id: "apparel", name: "Apparel", sub: ["Jerseys", "Shorts", "Shooting Shirts"] },
      { id: "training", name: "Training", sub: ["Dribble Goggles", "Weighted Balls", "Agility Kit"] }
    ]
  },
  {
    id: "running", name: "Running",
    categories: [
      { id: "shoes", name: "Shoes", sub: ["Racing", "Daily Trainer", "Trail", "Stability"] },
      { id: "apparel", name: "Apparel", sub: ["Tees", "Shorts", "Tights", "Singlets"] },
      { id: "wearables", name: "Wearables", sub: ["GPS Watches", "Heart Straps", "Foot Pods"] },
      { id: "nutrition", name: "Nutrition", sub: ["Gels", "Electrolytes", "Recovery"] }
    ]
  },
  {
    id: "cycling", name: "Cycling",
    categories: [
      { id: "bikes", name: "Bikes", sub: ["Road", "MTB", "Hybrid", "Gravel"] },
      { id: "helmets", name: "Helmets", sub: ["Aero", "Endurance", "MTB"] },
      { id: "components", name: "Components", sub: ["Wheels", "Groupsets", "Tires & Tubes"] },
      { id: "apparel", name: "Apparel", sub: ["Jerseys", "Bibs", "Gloves"] },
      { id: "accessories", name: "Accessories", sub: ["Computers", "Lights", "Pumps"] }
    ]
  },
  {
    id: "swimming", name: "Swimming",
    categories: [
      { id: "goggles", name: "Goggles", sub: ["Racing", "Training", "Open Water"] },
      { id: "swimsuits", name: "Swimsuits", sub: ["Racers", "Jammers", "Training Suits"] },
      { id: "training", name: "Training", sub: ["Pull Buoys", "Kickboards", "Fins", "Paddles"] },
      { id: "caps", name: "Caps & Accessories", sub: ["Silicone Caps", "Nose Clips", "Ear Plugs"] }
    ]
  },
  {
    id: "volleyball", name: "Volleyball",
    categories: [
      { id: "balls", name: "Balls", sub: ["Indoor", "Beach", "Training"] },
      { id: "knee-pads", name: "Knee Pads", sub: ["Pro Pads", "Lite Pads"] },
      { id: "nets", name: "Nets & Posts", sub: ["Match Nets", "Practice Nets", "Post Systems"] },
      { id: "apparel", name: "Apparel", sub: ["Jerseys", "Spandex", "Socks"] }
    ]
  },
  {
    id: "hockey", name: "Hockey",
    categories: [
      { id: "sticks", name: "Sticks", sub: ["Composite", "Wooden", "Junior"] },
      { id: "balls-shuttles", name: "Balls & Shuttles", sub: ["Match Balls", "Practice Balls", "Street Hockey"] },
      { id: "goalkeeping", name: "Goalkeeping", sub: ["Kickers", "Leg Guards", "Hand Protectors"] },
      { id: "protection", name: "Protection", sub: ["Shin Guards", "Gloves", "Mouth Guards"] }
    ]
  },
  {
    id: "table-tennis", name: "Table Tennis",
    categories: [
      { id: "blades", name: "Blades", sub: ["Offensive", "Defensive", "All-round"] },
      { id: "rubbers", name: "Rubbers", sub: ["Pips-in", "Pips-out", "Anti-spin"] },
      { id: "balls", name: "Balls", sub: ["40+ Plastic", "Training", "3-Star"] },
      { id: "tables", name: "Tables", sub: ["Indoor", "Outdoor", "Rollaway"] }
    ]
  },
  {
    id: "squash", name: "Squash",
    categories: [
      { id: "racquets", name: "Racquets", sub: ["Power", "Control", "Lite"] },
      { id: "balls", name: "Balls", sub: ["Pro (Double Yellow)", "Progression", "Junior"] },
      { id: "eyewear", name: "Eyewear", sub: ["Adult", "Junior", "Prescription"] }
    ]
  },
  {
    id: "gym-fitness", name: "Gym & Fitness",
    categories: [
      { id: "strength", name: "Strength", sub: ["Dumbbells", "Kettlebells", "Bars & Plates"] },
      { id: "cardio", name: "Cardio", sub: ["Jump Ropes", "Resistance Bands", "Slides"] },
      { id: "yoga", name: "Yoga", sub: ["Mats", "Blocks", "Straps"] },
      { id: "accessories", name: "Accessories", sub: ["Gloves", "Belts", "Straps"] }
    ]
  }
];

/* ---------- Gear types (Shop by Gear Type) ---------- */
BB.gearTypes = [
  { id: "footwear", name: "Footwear", emoji: "👟", count: 428 },
  { id: "racquets-bats", name: "Racquets & Bats", emoji: "🏏", count: 316 },
  { id: "balls", name: "Balls", emoji: "⚽", count: 254 },
  { id: "protection", name: "Protection", emoji: "🛡️", count: 187 },
  { id: "apparel", name: "Apparel", emoji: "👕", count: 512 },
  { id: "bags", name: "Bags", emoji: "🎒", count: 143 }
];

/* ---------- Brands ---------- */
BB.brands = [
  { id: "vigor-pro", name: "Vigor Pro", blurb: "Flagship pro gear engineered for match day." },
  { id: "apex-sport", name: "Apex Sport", blurb: "High-performance equipment for rising athletes." },
  { id: "velocity", name: "Velocity", blurb: "Speed-focused footwear and apparel." },
  { id: "atlas-play", name: "Atlas Play", blurb: "Durable training gear that outlasts seasons." },
  { id: "nordic-fit", name: "Nordic Fit", blurb: "Scandinavian design meets gym innovation." },
  { id: "summit-co", name: "Summit Co.", blurb: "Outdoor and adventure essentials." },
  { id: "prime-grip", name: "Prime Grip", blurb: "Grip technology for bats, gloves and racquets." },
  { id: "core-motion", name: "Core Motion", blurb: "Recovery, mobility and comfort wear." }
];

/* ---------- Lifestyle menu ---------- */
BB.lifestyle = [
  { id: "team-apparel", name: "Team Apparel", sub: ["Club Jerseys", "Track Suits", "Rain Jackets", "Travel Wear"] },
  { id: "sneakers", name: "Sneakers", sub: ["Retro Court", "Runners", "High Tops", "Slides & Clogs"] },
  { id: "college-style", name: "College Style", sub: ["Hoodies", "Varsity Jackets", "Caps", "Backpacks"] },
  { id: "fan-zone", name: "Fan Zone", sub: ["Scarves", "Flags", "Mugs & Bottles", "Stickers"] },
  { id: "gym-style", name: "Gym Style", sub: ["Tanks", "Joggers", "Compression", "Gym Bags"] }
];

/* ---------- B2B features ---------- */
BB.b2b = [
  { id: "bulk-orders", name: "Bulk Orders", sub: ["Team Kits", "Corporate Orders", "Academy Supply"] },
  { id: "customization", name: "Customization", sub: ["Jersey Printing", "Logo Embroidery", "Custom Bats"] },
  { id: "wholesale", name: "Wholesale", sub: ["Distributor Pricing", "MOQ & SLAs", "Catalog (PDF)"] },
  { id: "bulk-enquiry", name: "Bulk Enquiry", sub: ["Quote Request", "Sample Kit", "Site Visit"] }
];

/* ---------- Product image pools (Unsplash CDN, deterministic) ---------- */
const IMG = {
  cricket: ["photo-1531415074968-036ba1b575da", "photo-1540747913346-19e32dc3e97e", "photo-1607734834519-d8576ae60ea6", "photo-1587280501635-68a0e82cd5ff"],
  football: ["photo-1517466787929-bc90951d0974", "photo-1522778119026-d647f0596c20", "photo-1574629810360-7efbbe195018", "photo-1543326727-cf6c39e8f84c"],
  badminton: ["photo-1626224583764-f87db24ac4ea", "photo-1613918431703-aa50889e3be9", "photo-1617339860293-978cf33cce43", "photo-1602674809970-96e108a92487"],
  tennis: ["photo-1554068865-24cecd4e34b8", "photo-1622163642998-1ea32b0bbc67", "photo-1595435934249-5df7ed86e1c0", "photo-1617339860293-978cf33cce43"],
  basketball: ["photo-1546519638-68e109498ffc", "photo-1519861531473-9200262188bf", "photo-1574623452334-1e0ac2b3ccb4", "photo-1608245449230-4ac19066d2d0"],
  running: ["photo-1486218119243-13883505764c", "photo-1461896836934-ffe607ba8211", "photo-1571008887538-b36bb32f4571", "photo-1476480862126-209bfaa8edc8"],
  cycling: ["photo-1485965120184-e220f721d03e", "photo-1544191696-102dbdaeeaa0", "photo-1517649763962-0c623066013b", "photo-1507035895480-2b3156c31fc8"],
  swimming: ["photo-1530549387789-4c1017266635", "photo-1519315901367-f34ff9154487", "photo-1600965962361-9035dbfd1c50", "photo-1576014131825-c5340b1dd11b"],
  volleyball: ["photo-1615529182904-14819c35db37", "photo-1601574465779-76d6dbb88557", "photo-1547153760-18fc86324498", "photo-1601506301527-532ce2c327a7"],
  hockey: ["photo-1511148872264-4a1016bb0357", "photo-1517438322307-e67111335449", "photo-1577471488278-16eec37ffcc2", "photo-1526509867162-5b0c0d1b4b33"],
  "table-tennis": ["photo-1534158945573-5db3035d9af3", "photo-1600965962102-9d260a71890d", "photo-1613918431703-aa50889e3be9", "photo-1517438322307-e67111335449"],
  squash: ["photo-1611025364040-743e80f5b499", "photo-1622279457486-62dcc4a431d6", "photo-1517438322307-e67111335449", "photo-1534158945573-5db3035d9af3"],
  "gym-fitness": ["photo-1534438327276-14e5300c3a48", "photo-1517836357463-d25dfeac3438", "photo-1583454110551-21f2fa2afe61", "photo-1571019613454-1cb2f99b2d8b"],
  lifestyle: ["photo-1552346154-21d32810aba3", "photo-1523380744952-b7e00e6e2ffa", "photo-1503341504253-dff4815485f1", "photo-1556906781-9a412961c28c"],
  hero: ["photo-1461896836934-ffe607ba8211", "photo-1552674605-db6ffd4facb5", "photo-1517649763962-0c623066013b", "photo-1534438327276-14e5300c3a48"],
  gear: ["photo-1517649763962-0c623066013b", "photo-1461896836934-ffe607ba8211", "photo-1530549387789-4c1017266635", "photo-1546519638-68e109498ffc", "photo-1554068865-24cecd4e34b8", "photo-1626224583764-f87db24ac4ea", "photo-1534438327276-14e5300c3a48", "photo-1517466787929-bc90951d0974", "photo-1485965120184-e220f721d03e", "photo-1552674605-db6ffd4facb5", "photo-1571019613454-1cb2f99b2d8b", "photo-1517836357463-d25dfeac3438"],
  gallery: ["photo-1461896836934-ffe607ba8211", "photo-1526676037777-05a232554f77", "photo-1519861531473-9200262188bf", "photo-1517649763962-0c623066013b", "photo-1571008887538-b36bb32f4571", "photo-1546519638-68e109498ffc", "photo-1552674605-db6ffd4facb5", "photo-1574623452334-1e0ac2b3ccb4", "photo-1554068865-24cecd4e34b8", "photo-1486218119243-13883505764c", "photo-1517466787929-bc90951d0974", "photo-1534438327276-14e5300c3a48"]
};

BB.img = function (pool, i, w, h) {
  const id = IMG[pool] ? IMG[pool][i % IMG[pool].length] : IMG.gear[0];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w || 600}&h=${h || 510}&q=70`;
};

/* ---------- Promos for mega cards ---------- */
BB.megaPromos = [
  { title: "Monsoon Indoor Deals", sub: "Up to 45% off court gear", href: "catalog.html?sport=badminton", tone: "a" },
  { title: "Team Kit Builder", sub: "Dress your whole squad", href: "b2b.html", tone: "b" },
  { title: "New Season Drops", sub: "Fresh arrivals weekly", href: "catalog.html?tag=new", tone: "c" }
];

/* ---------- Hero slides ---------- */
BB.heroSlides = [
  {
    tag: "Built for Champions",
    title: "Push Beyond Limits",
    sub: "Engineered for athletes who never settle. Premium football gear, brutal prices.",
    cta1: { label: "Shop Football", href: "catalog.html?sport=football" },
    cta2: { label: "Explore Brands", href: "brands.html" },
    img: BB.img("football", 0, 1600, 900)
  },
  {
    tag: "Cover Drive Season",
    title: "Own the Pitch",
    sub: "Grade-1 English willow, match leather balls and club-grade protection.",
    cta1: { label: "Shop Cricket", href: "catalog.html?sport=cricket" },
    cta2: { label: "View Bats", href: "catalog.html?sport=cricket&cat=bats" },
    img: BB.img("cricket", 1, 1600, 900)
  },
  {
    tag: "Smash Faster",
    title: "Court is Yours",
    sub: "Head-heavy racquets, feather shuttles and pro court shoes for every smash.",
    cta1: { label: "Shop Badminton", href: "catalog.html?sport=badminton" },
    cta2: { label: "View Racquets", href: "catalog.html?sport=badminton&cat=racquets" },
    img: BB.img("badminton", 0, 1600, 900)
  },
  {
    tag: "No Days Off",
    title: "Train Brutal",
    sub: "Strength, cardio and recovery essentials to keep the streak alive.",
    cta1: { label: "Shop Fitness", href: "catalog.html?sport=gym-fitness" },
    cta2: { label: "View Deals", href: "catalog.html?tag=sale" },
    img: BB.img("gym-fitness", 0, 1600, 900)
  }
];

/* ---------- Marquee ---------- */
BB.marquee = ["Free Shipping Over $75", "30-Day Returns", "Pro Quality", "Team & Bulk Orders", "2-Year Warranty", "Secure Checkout"];

/* ---------- Name generators ---------- */
const adj = ["Pro", "Elite", "Tour", "Match", "Club", "Academy", "Hyper", "Turbo", "Prime", "Aero", "Flex", "Storm", "Rapid", "Power", "Stealth"];
const suf = ["X", "Pro+", "Max", "Lite", "GT", "5000", "Air", "Neo", "Ultimate", "R", "S", "Edge"];
const feats = [
  "Competition-grade build with reinforced stress points.",
  "Trusted by academy players and weekend warriors alike.",
  "All-weather durability with a pro-level finish.",
  "Feather-light feel with uncompromising strength.",
  "Tournament-ready performance straight out of the box.",
  "Ergonomic design tuned for long sessions.",
  "Limited batch — restocked every season.",
  "Tested by pros across domestic circuits."
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

function pick(arr, seed) { return arr[seed % arr.length]; }



/* Deterministic product generation.
   sport+cat+sub+index => stable product with id, name, price, rating, badges. */
BB.products = function (sportId, catId, subName, i) {
  const sport = BB.sports.find(s => s.id === sportId) || BB.sports[0];
  const cat = sport.categories.find(c => c.id === catId) || sport.categories[0];
  const seed = hash(`${sportId}|${catId}|${subName}|${i}`);
  const brand = pick(BB.brands, seed);
  const pool = IMG[sportId] ? sportId : "gear";
  const price = 14 + (seed % 230);
  const sale = seed % 4 === 0;
  const was = sale ? Math.round(price * (1.25 + (seed % 5) * 0.06)) : 0;
  const rating = (3.6 + (seed % 14) / 10).toFixed(1);
  const reviews = 8 + (seed % 240);
  const badges = [];
  if (sale) badges.push({ text: "SALE", cls: "badge-sale" });
  if (seed % 5 === 0) badges.push({ text: "NEW", cls: "badge-new" });
  if (seed % 11 === 0) badges.push({ text: "HOT", cls: "badge-hot" });
  return {
    id: `${sportId}-${catId}-${subName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i + 1}`,
    name: `${cat.name} ${pick(adj, seed >> 2)} ${pick(suf, seed >> 3)}`,
    brand: brand.name,
    brandId: brand.id,
    sport: sport.name,
    sportId: sport.id,
    cat: cat.name,
    catId: cat.id,
    sub: subName,
    subId: subName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    price: sale ? Math.round(price * 0.8) : price,
    was,
    sale,
    rating,
    reviews,
    badges,
    img: BB.img(pool, seed),
    desc: pick(feats, seed >> 1),
    colors: ["#122A1D", "#D98E5F", "#264A36", "#F2E9DC", "#8F8676"],
    sizes: ["S", "M", "L", "XL"]
  };
};

/* Per-sub product count (deterministic 6–14) */
BB.count = function (sportId, catId, subName) {
  return 6 + (hash(`${sportId}|${catId}|${subName}`) % 9);
};

/* All subs for a sport (flattened for catalog grids) */
BB.subsOf = function (sportId) {
  const sport = BB.sports.find(s => s.id === sportId);
  if (!sport) return [];
  const out = [];
  sport.categories.forEach(c => c.sub.forEach(s => out.push({ cat: c, sub: s })));
  return out;
};

/* Full catalog stats */
BB.stats = (function () {
  let subs = 0, products = 0;
  BB.sports.forEach(s => s.categories.forEach(c => c.sub.forEach(x => {
    subs++;
    products += 6 + (hash(`${s.id}|${c.id}|${x}`) % 9);
  })));
  return { sports: BB.sports.length, subs, products };
})();
