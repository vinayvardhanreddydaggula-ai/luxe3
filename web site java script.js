const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX; cursorY = e.clientY;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
});

function animateRing() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('button, a, .card, input, select').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expand'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expand'));
});

(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    };
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  for (let i = 0; i < 55; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life++;
      const fade = p.life < 30 ? p.life/30 : p.life > p.maxLife - 30 ? (p.maxLife - p.life)/30 : 1;
      ctx.save();
      ctx.globalAlpha = p.opacity * fade;
      ctx.fillStyle = '#c8a951';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#c8a951';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.life >= p.maxLife || p.y < -10) p.reset();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

function buildHeroTitle() {
  const lines = [['Dress', 'the', 'Life'], ['You', '<em>Deserve</em>']];
  const titleEl = document.getElementById('heroTitle');
  titleEl.innerHTML = '';
  let delay = 300;
  lines.forEach((words, li) => {
    const lineDiv = document.createElement('div');
    words.forEach(word => {
      const span = document.createElement('span');
      span.className = 'hero-word';
      span.innerHTML = word + ' ';
      span.style.animationDelay = delay + 'ms';
      delay += 120;
      lineDiv.appendChild(span);
    });
    titleEl.appendChild(lineDiv);
    if (li < lines.length - 1) titleEl.appendChild(document.createElement('br'));
  });
}

function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const suffix  = el.dataset.suffix || '';
  const decimal = parseInt(el.dataset.decimal || '0');
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const pct = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    const val = eased * target;
    el.textContent = (decimal ? val.toFixed(decimal) : Math.floor(val)) + suffix;
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));
}

const bannerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const banners = document.querySelectorAll('.banner');
      banners.forEach((b, i) => {
        setTimeout(() => b.classList.add('banner-revealed'), i * 140);
      });
      bannerObserver.disconnect();
    }
  });
}, { threshold: 0.15 });

function addTiltEffect(card) {
  card.addEventListener('mousemove', e => {
    if (card.classList.contains('rotating')) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 10;
    card.style.transform = `translateY(-9px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 40px rgba(0,0,0,.18), 0 20px 60px rgba(200,169,81,.08)`;
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('rotating')) return;
    card.style.transform = '';
    card.style.boxShadow = '';
  });
}

function addRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.5;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

function bounceCartIcon() {
  const btn = document.getElementById('cartIconBtn');
  btn.classList.remove('cart-icon-bounce');
  void btn.offsetWidth;
  btn.classList.add('cart-icon-bounce');
  btn.addEventListener('animationend', () => btn.classList.remove('cart-icon-bounce'), { once: true });
}

function flashCheck(cardEl) {
  const existing = cardEl.querySelector('.check-flash');
  if (existing) existing.remove();
  const flash = document.createElement('div');
  flash.className = 'check-flash';
  flash.textContent = '✓';
  cardEl.querySelector('.card-img').appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove());
}

const CATEGORIES = ['all','Fashion','Formals','Clothes','Shoes','Watches','Electronics','Mobiles','Accessories','Home','Furniture','Sports','Beauty'];

const PRODUCTS = [
  {id:0,  name:"Graphic T-Shirt",        price:700,   oldPrice:1000,  category:"Fashion",     image:"t-shirt.jpg", rating:4.3, reviews:128, isNew:false, isSale:true,  desc:"Statement graphic tee in 100% organic cotton. Relaxed fit, pre-washed softness, bold artisanal print."},
  {id:1,  name:"Cashmere Hoodie",         price:1200,  oldPrice:1500,  category:"Fashion",     image:"cashmere.jpg", rating:4.7, reviews:84,  isNew:true,  isSale:false, desc:"Lightweight cashmere-blend hoodie with plush interior. Perfect layering piece for cooler evenings."},
  {id:2,  name:"Cargo Pants",             price:1500,  oldPrice:2000,  category:"Fashion",     image:"cargo.jpg", rating:4.2, reviews:57,  isNew:false, isSale:true,  desc:"Utility cargo pants with 6 deep pockets, tapered leg and durable ripstop fabric."},
  {id:3,  name:"Formal Oxford Shirt",     price:1100,  oldPrice:1400,  category:"Formals",     image:"formal.jpg", rating:4.6, reviews:210, isNew:false, isSale:false, desc:"Classic Oxford shirt in 100% combed cotton. Slim fit, button-down collar, perfect for work or weekend."},
  {id:4,  name:"Formal Trousers",         price:1800,  oldPrice:2300,  category:"Formals",     image:"trousers.jpg", rating:4.4, reviews:78,  isNew:true,  isSale:false, desc:"Slim-cut formal trousers in premium stretch wool blend. Wrinkle-resistant and sharply tailored."},
  {id:5,  name:"Formal Derby Shoes",      price:3500,  oldPrice:4500,  category:"Formals",     image:"formalshoes.jpg", rating:4.5, reviews:62,  isNew:false, isSale:true,  desc:"Hand-stitched genuine leather derby shoes. Cushioned insole, Goodyear welted sole, timeless profile."},
  {id:6,  name:"Premium Sneakers",        price:3200,  oldPrice:4000,  category:"Shoes",       image:"nike.jpg", rating:4.8, reviews:341, isNew:true,  isSale:true,  desc:"Engineered knit upper with responsive foam sole. Lightweight, breathable, built for all-day comfort."},
  {id:7,  name:"Flip Flops",              price:450,   oldPrice:600,   category:"Shoes",       image:"flip flop.jpg", rating:4.1, reviews:95,  isNew:false, isSale:true,  desc:"EVA foam flip flops with contoured arch support and anti-slip sole. Perfect for beach and pool."},
  {id:8,  name:"Smart Watch Pro",         price:5000,  oldPrice:6500,  category:"Watches",     image:"smart watch.jpg", rating:4.6, reviews:189, isNew:true,  isSale:true,  desc:"1.4\" AMOLED display, heart rate, SpO2, GPS, 7-day battery. Stainless steel with sapphire glass."},
  {id:9,  name:"Titan Classic Watch",     price:4200,  oldPrice:5000,  category:"Watches",     image:"titan.jpg", rating:4.7, reviews:134, isNew:false, isSale:false, desc:"Titan Edge automatic movement, ultra-slim 6mm case, genuine leather strap. Elegance redefined."},
  {id:10, name:"Digital Watch",           price:1800,  oldPrice:2200,  category:"Watches",     image:"digital.jpg", rating:4.3, reviews:78,  isNew:false, isSale:true,  desc:"Multi-function digital watch with backlight, stopwatch, alarm and 5ATM water resistance."},
  {id:11, name:"Ultra Laptop",            price:65000, oldPrice:75000, category:"Electronics", image:"laptop.webp", rating:4.9, reviews:267, isNew:true,  isSale:false, desc:"14\" 2.8K OLED display, Intel Core Ultra 9, 32GB RAM, 1TB NVMe. Productivity redefined."},
  {id:12, name:"Wireless Headset",        price:2800,  oldPrice:3500,  category:"Electronics", image:"headset.jpg", rating:4.7, reviews:203, isNew:true,  isSale:true,  desc:"40mm drivers, active noise cancellation, 30h battery, foldable design with carrying case."},
  {id:13, name:"Wireless Mouse",          price:900,   oldPrice:1100,  category:"Electronics", image:"mouse.jpg", rating:4.2, reviews:134, isNew:false, isSale:true,  desc:"Ergonomic wireless mouse, 2.4GHz, 18-month battery, DPI up to 1600. Works on any surface."},
  {id:14, name:"Flagship Mobile",         price:22000, oldPrice:26000, category:"Mobiles",     image:"mobile.jpg", rating:4.7, reviews:512, isNew:true,  isSale:false, desc:"Snapdragon 8 Gen 3, 200MP camera system, 5000mAh with 100W fast charging. The phone you deserve."},
  {id:15, name:"Designer Case",           price:500,   oldPrice:700,   category:"Mobiles",     image:"mobile case.jpg", rating:4.1, reviews:67,  isNew:false, isSale:true,  desc:"Italian leather phone case with card slot. Hand-stitched edges, slim profile, magnetic closure."},
  {id:16, name:"Bifold Wallet",           price:850,   oldPrice:1100,  category:"Accessories", image:"wallet.jpg", rating:4.4, reviews:95,  isNew:false, isSale:false, desc:"Full-grain leather bifold with 6 card slots and RFID blocking. Slim profile, ages beautifully."},
  {id:17, name:"Polaroid Sunglasses",     price:900,   oldPrice:1300,  category:"Accessories", image:"sunglasses.jpg", rating:4.3, reviews:78,  isNew:false, isSale:true,  desc:"Polarized UV400 lenses with acetate frame. Spring hinges, anti-reflective coating, comes with case."},
  {id:18, name:"Luxury Hat",              price:650,   oldPrice:800,   category:"Accessories", image:"hats.jpg", rating:4.2, reviews:55,  isNew:false, isSale:false, desc:"Wide-brim fedora in premium 100% wool felt. Satin lining, adjustable inner band. Unisex."},
  {id:19, name:"Artisan Wall Clock",      price:1200,  oldPrice:1400,  category:"Home",        image:"wall clock.jpg", rating:4.5, reviews:43,  isNew:false, isSale:false, desc:"Walnut and brushed brass wall clock with silent sweep mechanism. 30cm diameter, minimal design."},
  {id:20, name:"Insulated Water Bottle",  price:450,   oldPrice:600,   category:"Home",        image:"bottel.jpg", rating:4.4, reviews:211, isNew:false, isSale:true,  desc:"1L double-wall vacuum insulated bottle. Keeps cold 24h, hot 12h. BPA-free, leak-proof lid."},
  {id:21, name:"Luxury Candle Set",       price:780,   oldPrice:950,   category:"Home",        image:"candles.jpg", rating:4.6, reviews:89,  isNew:true,  isSale:false, desc:"Set of 3 hand-poured soy wax candles in amber, sandalwood and jasmine. 40-hour burn each."},
  {id:22, name:"Modular Sofa",            price:14000, oldPrice:17000, category:"Furniture",   image:"sofa.jpg", rating:4.6, reviews:38,  isNew:true,  isSale:true,  desc:"3-seater modular sofa in oatmeal boucle. Solid wood frame, removable covers, 5-year warranty."},
  {id:23, name:"Air Conditioner 1.5T",    price:35000, oldPrice:42000, category:"Furniture",   image:"air conditioner.jpg", rating:4.5, reviews:72,  isNew:false, isSale:true,  desc:"Inverter 1.5T split AC, 5-star energy rating, PM2.5 filter, WiFi control, rapid cooling in 30s."},
  {id:24, name:"Double Door Refrigerator",price:28000, oldPrice:34000, category:"Furniture",   image:"refrigerator.jpg", rating:4.4, reviews:56,  isNew:false, isSale:true,  desc:"285L frost-free double door fridge, inverter compressor, humidity-controlled crisper, LED lighting."},
  {id:25, name:"TON Cricket Bat",         price:2200,  oldPrice:2700,  category:"Sports",      image:"bat.jpg", rating:4.7, reviews:156, isNew:false, isSale:true,  desc:"English willow Grade 1 bat, 6 grains, full toe protection, premium grip included. Match ready."},
  {id:26, name:"Kookaburra Cricket Ball", price:680,   oldPrice:850,   category:"Sports",      image:"kookaburra.jpg", rating:4.6, reviews:98,  isNew:false, isSale:false, desc:"Official Kookaburra red leather ball, 4-piece construction, hand-stitched seam. 156g."},
  {id:27, name:"SPF 50 Sunscreen",        price:380,   oldPrice:480,   category:"Beauty",      image:"sun screen.jpg", rating:4.5, reviews:312, isNew:true,  isSale:false, desc:"Lightweight SPF 50 PA+++ sunscreen, no white cast, reef-safe formula. Dermatologist tested."},
  {id:28, name:"Oxford Shirt",            price:900,   oldPrice:1100,  category:"Clothes",     image:"shirt.jpg", rating:4.5, reviews:203, isNew:false, isSale:false, desc:"Classic Oxford shirt in 100% combed cotton. Slim fit, button-down collar, work or weekend."},
  {id:29, name:"Linen Summer Dress",      price:1350,  oldPrice:1700,  category:"Clothes",     image:"lenin.jpg", rating:4.4, reviews:77,  isNew:true,  isSale:false, desc:"Breathable linen-blend midi dress with adjustable straps and flowy silhouette. Hand-wash safe."},
];

let cart = [], wishlist = [], currentCategory = 'all', activeFiltered = [...PRODUCTS];
let activeTags = {sale:false, new:false};
let currentUser = null;

function triggerCardRotation(cardEl, productId) {
  if (cardEl.classList.contains('rotating')) return;
  cardEl.style.transform = '';
  cardEl.classList.add('rotating');
  cardEl.addEventListener('animationend', () => {
    cardEl.classList.remove('rotating');
    openModal(productId);
  }, { once: true });
}

window.addEventListener('DOMContentLoaded', () => {
  buildHeroTitle();
  buildNav();
  displayProducts(PRODUCTS);
  renderAuthArea();
  observeReveal();
  bannerObserver.observe(document.getElementById('bannerWrap'));

  setTimeout(() => {
    document.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
  }, 1800);
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1700);
});

function buildNav() {
  const wrap = document.getElementById('navInner');
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'nav-btn' + (cat==='all'?' active':'');
    btn.textContent = cat==='all'?'All Products':cat;
    btn.onclick = () => { filterProducts(cat); setNavActive(btn); };
    wrap.appendChild(btn);
  });
}
function setNavActive(btn) {
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function displayProducts(list, keyword='') {
  const grid = document.getElementById('productGrid');
  const notFound = document.getElementById('notFound');
  document.getElementById('searchedWord').innerText = keyword;
  document.getElementById('resultCount').textContent = list.length+' product'+(list.length!==1?'s':'');
  activeFiltered = list;
  grid.innerHTML = '';
  if (list.length===0) { notFound.classList.add('show'); document.getElementById('sectionSub').textContent='No results'; return; }
  notFound.classList.remove('show');
  document.getElementById('sectionSub').textContent = currentCategory==='all'?'Showing all products':'Category: '+currentCategory;
  list.forEach((p, i) => {
    const inW = wishlist.includes(p.id);
    const card = document.createElement('div');
    card.className = 'card reveal';
    card.style.transitionDelay = Math.min(i * 55, 500) + 'ms';
    card.innerHTML = `
      <div class="card-img">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/600x400/f6f0e4/c8a951?text=${encodeURIComponent(p.name)}'">
        ${p.isSale?'<div class="card-badge badge-sale">Sale</div>':''}
        ${p.isNew&&!p.isSale?'<div class="card-badge badge-new">New</div>':''}
        <div class="card-actions">
          <button class="ca-btn ${inW?'wished':''}" onclick="event.stopPropagation();toggleWish(${p.id},this)">${inW?'❤️':'🤍'}</button>
          <button class="ca-btn" onclick="event.stopPropagation();quickAddFromCard(${p.id},this)" title="Quick Add">🛒</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-cat">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-rating"><span class="stars">${stars(p.rating)}</span><span class="rating-count">${p.rating} (${p.reviews})</span></div>
        <div class="card-footer">
          <div class="price-wrap">
            <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
            ${p.oldPrice?`<div class="price-old">₹${p.oldPrice.toLocaleString('en-IN')}</div>`:''}
          </div>
          <button class="add-btn" onclick="event.stopPropagation();quickAddFromBtn(${p.id},this,event)">+ Cart</button>
        </div>
      </div>`;
    card.addEventListener('click', (e) => {
      if (e.target.closest('.ca-btn') || e.target.closest('.add-btn')) return;
      triggerCardRotation(card, p.id);
    });
    addTiltEffect(card);
    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

function stars(r) {
  const f=Math.floor(r), h=r%1>=.5;
  return '★'.repeat(f)+(h?'½':'')+'☆'.repeat(5-f-(h?1:0));
}

function filterProducts(cat) {
  currentCategory=cat;
  document.getElementById('searchInput').value='';
  document.querySelectorAll('.nav-btn').forEach((b,i) => b.classList.toggle('active', CATEGORIES[i]===cat));
  applySortAndFilter();
}
function searchProducts() {
  currentCategory='all';
  document.querySelectorAll('.nav-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
  applySortAndFilter();
}
function applySortAndFilter(kw) {
  const maxP = +document.getElementById('priceRange').value;
  document.getElementById('priceLabel').textContent = maxP.toLocaleString('en-IN');
  const sort = document.getElementById('sortSelect').value;
  const keyword = kw!==undefined ? kw : document.getElementById('searchInput').value.toLowerCase().trim();
  let list = PRODUCTS.filter(p => {
    const catOk = currentCategory==='all' || p.category===currentCategory;
    const priceOk = p.price<=maxP;
    const saleOk = !activeTags.sale || p.isSale;
    const newOk = !activeTags.new || p.isNew;
    const kwOk = !keyword || p.name.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword);
    return catOk && priceOk && saleOk && newOk && kwOk;
  });
  if (sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if (sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  else if (sort==='name-asc') list.sort((a,b)=>a.name.localeCompare(b.name));
  else if (sort==='rating-desc') list.sort((a,b)=>b.rating-a.rating);
  displayProducts(list, keyword);
}
function toggleTag(tag) {
  activeTags[tag]=!activeTags[tag];
  document.getElementById('tag-'+tag).classList.toggle('on',activeTags[tag]);
  applySortAndFilter();
}
function clearAllFilters() {
  activeTags.sale=false; activeTags.new=false;
  document.getElementById('tag-sale').classList.remove('on');
  document.getElementById('tag-new').classList.remove('on');
  document.getElementById('sortSelect').value='default';
  document.getElementById('priceRange').value=75000;
  document.getElementById('searchInput').value='';
  filterProducts('all');
}

function quickAdd(id) {
  const p=PRODUCTS[id], ex=cart.find(c=>c.id===id);
  if(ex) ex.qty++; else cart.push({...p,qty:1});
  updateCart(); bounceCartIcon(); showToast('success',`${p.name} added to cart!`);
}
function quickAddFromCard(id, btn) {
  quickAdd(id);
  const card = btn.closest('.card');
  if (card) flashCheck(card);
}
function quickAddFromBtn(id, btn, e) {
  addRipple(btn, e);
  quickAdd(id);
  const card = btn.closest('.card');
  if (card) flashCheck(card);
}

function removeFromCart(id) { cart=cart.filter(c=>c.id!==id); updateCart(); }
function changeQty(id,d) {
  const item=cart.find(c=>c.id===id); if(!item) return;
  item.qty+=d; if(item.qty<=0) cart=cart.filter(c=>c.id!==id);
  updateCart();
}
function updateCart() {
  const count=cart.reduce((s,c)=>s+c.qty,0);
  const total=cart.reduce((s,c)=>s+c.price*c.qty,0);
  const delivery=total>=2000?0:99;
  const badge = document.getElementById('cartCount');
  badge.textContent=count;
  badge.classList.remove('badge-pop'); void badge.offsetWidth; badge.classList.add('badge-pop');
  const list=document.getElementById('cartItemsList'), footer=document.getElementById('cartFooter');
  if(cart.length===0){
    list.innerHTML=`<div class="cart-empty"><div class="ce-icon">🛍️</div><h3>Your cart is empty</h3><p>Add items to get started</p></div>`;
    footer.innerHTML=''; return;
  }
  list.innerHTML=cart.map(item=>`
    <div class="cart-item">
      <div class="ci-img"><img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/72?text=IMG'"></div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-cat">${item.category}</div>
        <div class="ci-price">₹${(item.price*item.qty).toLocaleString('en-IN')}</div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="ci-remove" onclick="removeFromCart(${item.id})">🗑️</button>
    </div>`).join('');
  footer.innerHTML=`
    <div class="cart-row"><span>Subtotal</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    <div class="cart-row"><span>Delivery</span><span>${delivery===0?'FREE 🎉':'₹'+delivery}</span></div>
    <div class="cart-row total"><span>Total</span><span>₹${(total+delivery).toLocaleString('en-IN')}</span></div>
    <button class="checkout-btn" style="margin-top:16px" onclick="checkout()">Proceed to Checkout →</button>`;
}
function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}
function checkout() {
  if(!currentUser){showToast('info','Please sign in to checkout');closeCart();openAuth();return;}
  if(cart.length===0) return;
  showToast('info','Redirecting to checkout…');
  setTimeout(()=>{cart=[];updateCart();closeCart();},1500);
}
function closeCart(){
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function toggleWish(id,btn) {
  const idx=wishlist.indexOf(id);
  if(idx===-1){wishlist.push(id);if(btn){btn.textContent='❤️';btn.classList.add('wished');}showToast('info','Added to wishlist!');}
  else{wishlist.splice(idx,1);if(btn){btn.textContent='🤍';btn.classList.remove('wished');}showToast('info','Removed from wishlist');}
  updateWishBadge(); renderWishlist();
}
function updateWishBadge() {
  const b=document.getElementById('wishBadge');
  b.style.display=wishlist.length?'flex':'none';
  b.textContent=wishlist.length;
  b.classList.remove('badge-pop'); void b.offsetWidth; b.classList.add('badge-pop');
}
function renderWishlist() {
  const wrap=document.getElementById('wishlistItems');
  if(!wishlist.length){wrap.innerHTML=`<div class="cart-empty"><div class="ce-icon">🤍</div><h3>No saved items</h3><p>Tap the heart on any product</p></div>`;return;}
  wrap.innerHTML=wishlist.map(id=>{const p=PRODUCTS[id];return`
    <div class="wish-item">
      <div class="wi-img"><img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/62?text=IMG'"></div>
      <div class="wi-info"><div class="wi-name">${p.name}</div><div class="wi-price">₹${p.price.toLocaleString('en-IN')}</div></div>
      <button class="wi-remove" onclick="toggleWish(${id},null)">✕</button>
    </div>`;}).join('');
}
function openWishlist(){
  document.getElementById('wishlistPanel').classList.add('open');
  document.getElementById('wishOverlay').classList.add('open');
  renderWishlist();
}
function closeWishlist(){
  document.getElementById('wishlistPanel').classList.remove('open');
  document.getElementById('wishOverlay').classList.remove('open');
}

function openModal(id) {
  const p=PRODUCTS[id];
  document.getElementById('modalImg').src=p.image;
  document.getElementById('modalImg').onerror=function(){this.src='https://via.placeholder.com/600x400/f6f0e4/c8a951?text='+encodeURIComponent(p.name);};
  document.getElementById('modalCat').textContent=p.category;
  document.getElementById('modalName').textContent=p.name;
  document.getElementById('modalRating').innerHTML=`<span class="stars">${stars(p.rating)}</span><span style="font-size:13px;color:var(--muted)">&nbsp;${p.rating} · ${p.reviews} reviews</span>`;
  document.getElementById('modalPrice').textContent='₹'+p.price.toLocaleString('en-IN');
  document.getElementById('modalDesc').textContent=p.desc;
  document.getElementById('modalAddBtn').onclick=()=>{quickAdd(id);closeModalDirect();};
  const wb=document.getElementById('modalWishBtn');
  wb.textContent=wishlist.includes(id)?'❤️':'🤍';
  wb.onclick=()=>{toggleWish(id,null);wb.textContent=wishlist.includes(id)?'❤️':'🤍';};
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(e){if(e.target===document.getElementById('modalOverlay'))closeModalDirect();}
function closeModalDirect(){document.getElementById('modalOverlay').classList.remove('open');document.body.style.overflow='';}

function openAuth(tab='login') {
  switchTab(tab);
  document.getElementById('authOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeAuth(){document.getElementById('authOverlay').classList.remove('open');document.body.style.overflow='';}
function closeAuthIfOutside(e){if(e.target===document.getElementById('authOverlay'))closeAuth();}
function switchTab(t) {
  document.getElementById('loginForm').classList.toggle('active',t==='login');
  document.getElementById('registerForm').classList.toggle('active',t==='register');
  document.getElementById('tabLogin').classList.toggle('active',t==='login');
  document.getElementById('tabRegister').classList.toggle('active',t==='register');
}
function togglePass(id,btn){
  const el=document.getElementById(id);
  el.type=el.type==='password'?'text':'password';
  btn.textContent=el.type==='password'?'👁️':'🙈';
}
function clearErr(id){const el=document.getElementById(id);el.classList.remove('show');el.textContent='';}
function showErr(inputId,errId,msg){
  const input=document.getElementById(inputId), err=document.getElementById(errId);
  input.classList.add('error'); err.textContent=msg; err.classList.add('show');
}
function checkStrength(pw) {
  let score=0;
  if(pw.length>=8) score++;
  if(/[A-Z]/.test(pw)) score++;
  if(/[0-9]/.test(pw)) score++;
  if(/[^A-Za-z0-9]/.test(pw)) score++;
  const fill=document.getElementById('strengthFill'), txt=document.getElementById('strengthText');
  const map={0:['0%','#e74c3c',''],1:['25%','#e74c3c','Weak'],2:['50%','#f39c12','Fair'],3:['75%','#f1c40f','Good'],4:['100%','#2ecc71','Strong']};
  fill.style.width=map[score][0]; fill.style.background=map[score][1]; txt.textContent=map[score][2];
  txt.style.color=map[score][1];
}
function doLogin() {
  let ok=true;
  const email=document.getElementById('loginEmail').value.trim();
  const pw=document.getElementById('loginPw').value;
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showErr('loginEmail','loginEmailErr','Please enter a valid email');ok=false;}
  if(!pw||pw.length<6){showErr('loginPw','loginPwErr','Password must be at least 6 characters');ok=false;}
  if(!ok) return;
  setLoading('loginBtn','loginBtnText','loginSpinner',true);
  setTimeout(()=>{
    setLoading('loginBtn','loginBtnText','loginSpinner',false);
    currentUser={name:email.split('@')[0],email};
    renderAuthArea(); closeAuth();
    showToast('success',`Welcome back, ${currentUser.name}!`);
  },1400);
}
function doRegister() {
  let ok=true;
  const first=document.getElementById('regFirst').value.trim();
  const last=document.getElementById('regLast').value.trim();
  const email=document.getElementById('regEmail').value.trim();
  const phone=document.getElementById('regPhone').value.trim();
  const pw=document.getElementById('regPw').value;
  const pwc=document.getElementById('regPwConf').value;
  const terms=document.getElementById('termsCheck').checked;
  if(!first){showErr('regFirst','regFirstErr','First name is required');ok=false;}
  if(!last){showErr('regLast','regLastErr','Last name is required');ok=false;}
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showErr('regEmail','regEmailErr','Enter a valid email');ok=false;}
  if(!phone||!/^[+\d\s]{10,15}$/.test(phone)){showErr('regPhone','regPhoneErr','Enter a valid phone number');ok=false;}
  if(!pw||pw.length<8){showErr('regPw','regPwErr','Password must be at least 8 characters');ok=false;}
  if(pw!==pwc){showErr('regPwConf','regPwConfErr','Passwords do not match');ok=false;}
  if(!terms){const e=document.getElementById('termsErr');e.textContent='Please accept the terms';e.classList.add('show');ok=false;}
  if(!ok) return;
  setLoading('regBtn','regBtnText','regSpinner',true);
  setTimeout(()=>{
    setLoading('regBtn','regBtnText','regSpinner',false);
    currentUser={name:first+' '+last,email};
    renderAuthArea(); closeAuth();
    showToast('success',`Welcome to LUXE, ${first}!`);
  },1600);
}
function socialLogin(provider) {
  setLoading('loginBtn','loginBtnText','loginSpinner',true);
  setTimeout(()=>{
    setLoading('loginBtn','loginBtnText','loginSpinner',false);
    currentUser={name:'Guest User',email:'guest@luxe.com'};
    renderAuthArea(); closeAuth();
    showToast('success',`Signed in with ${provider}!`);
  },1200);
}
function setLoading(btnId,textId,spinnerId,state) {
  const btn=document.getElementById(btnId);
  btn.disabled=state;
  document.getElementById(textId).style.display=state?'none':'block';
  document.getElementById(spinnerId).style.display=state?'block':'none';
}
function doLogout() {
  currentUser=null; renderAuthArea(); hideUserMenu();
  showToast('info','Signed out. See you soon!');
}
function renderAuthArea() {
  const area=document.getElementById('authArea');
  if(!currentUser){
    area.innerHTML=`<button class="login-btn" onclick="openAuth()">Sign In</button>`;
  } else {
    const initials=currentUser.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    area.innerHTML=`
      <div class="user-menu-wrap">
        <button class="user-avatar" onclick="toggleUserMenu()">${initials}</button>
        <div class="user-dropdown" id="userDropdown">
          <div class="user-info-bar">
            <div class="user-name-d">${currentUser.name}</div>
            <div class="user-email-d">${currentUser.email}</div>
          </div>
          <a>👤 My Account</a>
          <a>📦 My Orders</a>
          <a onclick="openWishlist();hideUserMenu()">🤍 Wishlist</a>
          <hr>
          <a onclick="doLogout()">🚪 Sign Out</a>
        </div>
      </div>`;
  }
  document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expand'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expand'));
  });
}
function toggleUserMenu(){document.getElementById('userDropdown')?.classList.toggle('open');}
function hideUserMenu(){document.getElementById('userDropdown')?.classList.remove('open');}
document.addEventListener('click',e=>{
  const wrap=document.querySelector('.user-menu-wrap');
  if(wrap && !wrap.contains(e.target)) hideUserMenu();
});

function showToast(type,msg) {
  const wrap=document.getElementById('toastWrap');
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span class="t-icon">${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span>${msg}`;
  wrap.appendChild(t);
  setTimeout(()=>t.remove(),2800);
}