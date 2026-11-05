/* EDDY CLOTHING app */
const PRODUCTS = [
  {id:1,name:'Essential Oversized Tee',cat:'tops',price:450,img:'images/tee.webp',sizes:['S','M','L','XL'],colors:['Black','White','Grey'],desc:'Heavyweight cotton tee with a relaxed drop shoulder. Pre-washed for a lived-in softness.',badge:'New',rating:4.8,reviews:124,isNew:true},
  {id:2,name:'Merino Crew Sweater',cat:'tops',price:1290,img:'images/sweater.webp',sizes:['S','M','L','XL'],colors:['Cream','Charcoal'],desc:'Fine-gauge merino wool crew neck. Lightweight warmth, year-round wear.',badge:null,rating:4.9,reviews:86,isNew:false},
  {id:3,name:'Classic Polo Shirt',cat:'tops',price:690,img:'images/polo.webp',sizes:['S','M','L','XL'],colors:['Navy','White'],desc:'Pique cotton polo with a structured collar. Smart-casual staple.',badge:null,rating:4.7,reviews:62,isNew:false},
  {id:4,name:'Charcoal Hoodie',cat:'tops',price:990,img:'images/hoodie.webp',sizes:['S','M','L','XL'],colors:['Charcoal','Black'],desc:'Brushed fleece hoodie with kangaroo pocket. Everyday comfort.',badge:'Bestseller',rating:4.9,reviews:210,isNew:false},
  {id:5,name:'White Crew Tee',cat:'tops',price:390,img:'images/whtee.webp',sizes:['S','M','L','XL'],colors:['White'],desc:'Clean white crew neck in breathable cotton. A wardrobe essential.',badge:null,rating:4.6,reviews:48,isNew:true},
  {id:6,name:'Olive Bomber Jacket',cat:'outerwear',price:1890,img:'images/bomber.webp',sizes:['S','M','L','XL'],colors:['Olive','Black'],desc:'Water-resistant nylon bomber with ribbed cuffs and hem. Transitional layer.',badge:'New',rating:4.8,reviews:73,isNew:true},
  {id:7,name:'Black Leather Biker',cat:'outerwear',price:4990,img:'images/leather.webp',sizes:['S','M','L','XL'],colors:['Black'],desc:'Full-grain leather biker jacket. YKK zips, quilted lining. Built to age.',badge:'Premium',rating:5.0,reviews:41,isNew:false},
  {id:8,name:'Wool Overcoat',cat:'outerwear',price:5490,img:'images/overcoat.webp',sizes:['S','M','L','XL'],colors:['Charcoal','Camel'],desc:'Double-faced wool overcoat with notch lapel. Winter armour.',badge:'Premium',rating:4.9,reviews:28,isNew:true},
  {id:9,name:'Slim Dark Denim',cat:'bottoms',price:1190,img:'images/jeans.webp',sizes:['28','30','32','34','36'],colors:['Indigo'],desc:'Selvedge-inspired slim jeans in deep indigo. Stretch comfort.',badge:null,rating:4.7,reviews:95,isNew:false},
  {id:10,name:'Beige Chinos',cat:'bottoms',price:890,img:'images/chino.webp',sizes:['28','30','32','34','36'],colors:['Beige','Navy'],desc:'Tapered chino in garment-dyed beige. Office to weekend.',badge:null,rating:4.6,reviews:57,isNew:false},
  {id:11,name:'Olive Cargo Pants',cat:'bottoms',price:1090,img:'images/cargo.webp',sizes:['28','30','32','34','36'],colors:['Olive','Black'],desc:'Relaxed cargo pants with side pockets. Utility meets comfort.',badge:'New',rating:4.7,reviews:39,isNew:true},
  {id:12,name:'Minimalist Sneakers',cat:'footwear',price:1590,img:'images/sneakers.webp',sizes:['7','8','9','10','11','12'],colors:['White'],desc:'Clean leather low-top sneakers. Margom sole, hand-stitched.',badge:'New',rating:4.8,reviews:142,isNew:true},
  {id:13,name:'Chelsea Boots',cat:'footwear',price:2290,img:'images/chelsea.webp',sizes:['7','8','9','10','11','12'],colors:['Black','Brown'],desc:'Leather chelsea boots with elastic gusset. Sleek and durable.',badge:null,rating:4.9,reviews:67,isNew:false},
];

const CAT_LABEL={tops:'Tops',outerwear:'Outerwear',bottoms:'Bottoms',footwear:'Footwear'};

let cart=JSON.parse(localStorage.getItem('eddy_cart')||'[]');
let wishlist=JSON.parse(localStorage.getItem('eddy_wish')||'[]');
let activeCat='all';
let searchQuery='';
let sortMode='featured';
let promoCode='';
let promoDiscount=0;
let selectedSize=null;
let selectedColor=null;
let qty=1;
let currentProduct=null;

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function money(n){return 'R '+Math.round(n).toLocaleString('en-ZA')}

function saveCart(){localStorage.setItem('eddy_cart',JSON.stringify(cart));}
function saveWish(){localStorage.setItem('eddy_wish',JSON.stringify(wishlist));}

function stars(r){const full=Math.floor(r);let s='';for(let i=0;i<5;i++)s+= i<full?'★':'☆';return s;}

function renderProducts(){
  const grid=$('#productGrid');
  let list=PRODUCTS.filter(p=>{
    const catOk=activeCat==='all'||p.cat===activeCat;
    const q=searchQuery.trim().toLowerCase();
    const searchOk=!q||p.name.toLowerCase().includes(q)||p.cat.includes(q)|| (p.desc||'').toLowerCase().includes(q);
    return catOk&&searchOk;
  });
  if(sortMode==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if(sortMode==='price-desc') list.sort((a,b)=>b.price-a.price);
  else if(sortMode==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  else if(sortMode==='newest') list.sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0));

  grid.innerHTML=list.map(p=>`
    <article class="product-card" data-id="${p.id}">
      <div class="product-media">
        <img src="${p.img}" alt="${p.name}" width="800" height="800" loading="lazy" />
        ${p.badge?`<span class="product-badge ${p.badge==='Sale'?'sale':''}">${p.badge}</span>`:''}
        <button class="wish-btn ${wishlist.includes(p.id)?'active':''}" data-wish="${p.id}" aria-label="Toggle wishlist for ${p.name}">
          <svg viewBox="0 0 24 24" fill="${wishlist.includes(p.id)?'currentColor':'none'}" stroke="currentColor" stroke-width="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <div class="product-quick">Quick View</div>
      </div>
      <div class="product-info">
        <div>
          <div class="product-name">${p.name}</div>
          <div class="product-cat">${CAT_LABEL[p.cat]}</div>
          <div class="product-rating">${stars(p.rating)} <span>(${p.reviews})</span></div>
        </div>
        <div class="product-price">${money(p.price)}</div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(c=>{
    c.addEventListener('click',e=>{
      if(e.target.closest('.wish-btn')) return;
      openProduct(+c.dataset.id);
    });
  });
  grid.querySelectorAll('.wish-btn').forEach(b=>{
    b.addEventListener('click',e=>{
      e.stopPropagation();
      toggleWish(+b.dataset.wish);
    });
  });

  const empty=$('#emptyState');
  if(list.length===0){empty.hidden=false;grid.style.display='none';}
  else{empty.hidden=true;grid.style.display='grid';}
}

function toggleWish(id){
  const i=wishlist.indexOf(id);
  if(i>=0){wishlist.splice(i,1);toast('Removed from wishlist');}
  else{wishlist.push(id);toast('Added to wishlist');}
  saveWish();
  updateWishUI();
  renderProducts();
  if(currentProduct&&currentProduct.id===id){
    const btn=$('#wishToggleBtn'); if(btn) btn.textContent=wishlist.includes(id)?'♥ Saved':'♡ Save';
  }
}

function updateWishUI(){
  $('#wishCount').textContent=wishlist.length;
  const body=$('#wishBody');
  if(wishlist.length===0){body.innerHTML='<div class="empty-cart">Your wishlist is empty.</div>';return;}
  const items=wishlist.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  body.innerHTML=items.map(p=>`
    <div class="cart-item">
      <img src="${p.img}" alt="${p.name}" />
      <div>
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-meta">${CAT_LABEL[p.cat]} · ${money(p.price)}</div>
        <button class="btn btn-sm btn-primary" style="margin-top:8px" data-wishadd="${p.id}">Add to Cart</button>
      </div>
      <button class="cart-remove" data-wishremove="${p.id}">Remove</button>
    </div>
  `).join('');
  body.querySelectorAll('[data-wishadd]').forEach(b=>{
    b.addEventListener('click',()=>{
      const p=PRODUCTS.find(x=>x.id===+b.dataset.wishadd);
      openProduct(p.id);
    });
  });
  body.querySelectorAll('[data-wishremove]').forEach(b=>{
    b.addEventListener('click',()=>toggleWish(+b.dataset.wishremove));
  });
}

function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id);
  currentProduct=p;
  selectedSize=p.sizes[Math.floor(p.sizes.length/2)]||p.sizes[0];
  selectedColor=p.colors[0];
  qty=1;
  const content=$('#productModalContent');
  const related=PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,3);
  content.innerHTML=`
    <div class="modal-media"><img src="${p.img}" alt="${p.name}" width="800" height="800" /></div>
    <div class="modal-body">
      <div class="modal-cat">${CAT_LABEL[p.cat]}</div>
      <h2>${p.name}</h2>
      <div class="modal-rating">${stars(p.rating)} ${p.rating} · ${p.reviews} reviews</div>
      <div class="modal-price">${money(p.price)}</div>
      <p class="modal-desc">${p.desc}</p>
      <div>
        <p class="eyebrow" style="margin-bottom:8px">Color</p>
        <div class="color-row">
          ${p.colors.map(c=>`<button class="color-swatch ${c===selectedColor?'active':''}" data-color="${c}" title="${c}" style="background:${colorHex(c)}" aria-label="${c}"></button>`).join('')}
        </div>
        <p style="font-size:.75rem;color:var(--muted-2);margin-top:6px" id="colorLabel">${selectedColor}</p>
      </div>
      <div>
        <p class="eyebrow" style="margin-bottom:8px">Size</p>
        <div class="size-row">
          ${p.sizes.map(s=>`<button class="size-btn ${s===selectedSize?'active':''}" data-size="${s}">${s}</button>`).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-top:10px" data-modal="sizeModal">Size Guide</button>
      </div>
      <div>
        <p class="eyebrow" style="margin-bottom:8px">Quantity</p>
        <div class="qty-row">
          <button class="qty-btn" id="qtyMinus">−</button>
          <span class="qty-val" id="qtyVal">1</span>
          <button class="qty-btn" id="qtyPlus">+</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" id="addToCartBtn" style="flex:1">Add to Cart — ${money(p.price)}</button>
        <button class="btn btn-ghost" id="wishToggleBtn" aria-label="Toggle wishlist">${wishlist.includes(p.id)?'♥ Saved':'♡ Save'}</button>
      </div>
      <div class="modal-trust">Free shipping over R1,000 · 30-day returns · Lifetime repair</div>
      ${related.length?`<div>
        <p class="eyebrow" style="margin-top:16px;margin-bottom:8px">You may also like</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${related.map(r=>`<button class="btn btn-ghost btn-sm" data-related="${r.id}">${r.name}</button>`).join('')}
        </div>
      </div>`:''}
    </div>
    <button class="close-btn" data-close="productModal" aria-label="Close">✕</button>
  `;
  openOverlay('productModal');

  content.querySelectorAll('.size-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      selectedSize=b.dataset.size;
      content.querySelectorAll('.size-btn').forEach(x=>x.classList.toggle('active',x===b));
      updateAddBtn();
    });
  });
  content.querySelectorAll('.color-swatch').forEach(b=>{
    b.addEventListener('click',()=>{
      selectedColor=b.dataset.color;
      content.querySelectorAll('.color-swatch').forEach(x=>x.classList.toggle('active',x===b));
      const lbl=$('#colorLabel'); if(lbl) lbl.textContent=selectedColor;
    });
  });
  $('#qtyMinus').addEventListener('click',()=>{if(qty>1){qty--;$('#qtyVal').textContent=qty;updateAddBtn();}});
  $('#qtyPlus').addEventListener('click',()=>{qty++;$('#qtyVal').textContent=qty;updateAddBtn();});
  $('#addToCartBtn').addEventListener('click',addToCart);
  $('#wishToggleBtn').addEventListener('click',()=>{toggleWish(p.id); $('#wishToggleBtn').textContent=wishlist.includes(p.id)?'♥ Saved':'♡ Save';});
  content.querySelectorAll('[data-related]').forEach(b=>{
    b.addEventListener('click',()=>openProduct(+b.dataset.related));
  });
  content.querySelectorAll('[data-modal]').forEach(b=>{
    b.addEventListener('click',e=>{e.preventDefault();openModalContent(b.dataset.modal);});
  });
}

function colorHex(c){
  const m={Black:'#1a1a1d',White:'#f4f1ea',Grey:'#6b665e',Charcoal:'#3a3a3e',Cream:'#f4efe4',Navy:'#1f2a44',Olive:'#5a6038',Indigo:'#2a2f4a',Beige:'#d8cdb5',Brown:'#5a3a2a',Camel:'#b89060'};
  return m[c]||'#888';
}

function updateAddBtn(){
  if(!currentProduct) return;
  $('#addToCartBtn').textContent=`Add to Cart — ${money(currentProduct.price*qty)}`;
}

function addToCart(){
  const item={id:currentProduct.id,name:currentProduct.name,price:currentProduct.price,img:currentProduct.img,size:selectedSize,color:selectedColor,qty};
  const existing=cart.find(c=>c.id===item.id&&c.size===item.size&&c.color===item.color);
  if(existing) existing.qty+=qty; else cart.push(item);
  saveCart();
  closeOverlay('productModal');
  toast('Added to cart');
  updateCartUI();
}

function cartTotals(){
  const subtotal=cart.reduce((a,c)=>a+c.price*c.qty,0);
  const discount=promoDiscount?Math.round(subtotal*promoDiscount):0;
  const afterDiscount=subtotal-discount;
  const shipping=afterDiscount>=1000||cart.length===0?0:80;
  const total=afterDiscount+shipping;
  return {subtotal,discount,shipping,total};
}

function updateCartUI(){
  $('#cartCount').textContent=cart.reduce((a,c)=>a+c.qty,0);
  const body=$('#cartBody');
  const foot=$('#cartFoot');
  if(cart.length===0){
    body.innerHTML='<div class="empty-cart">Your cart is empty.</div>';
    foot.innerHTML='';
    return;
  }
  body.innerHTML=cart.map((c,i)=>`
    <div class="cart-item">
      <img src="${c.img}" alt="${c.name}" />
      <div>
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-meta">Size ${c.size} · ${c.color}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-i="${i}" data-d="-1">−</button>
          <span>${c.qty}</span>
          <button class="qty-btn" data-i="${i}" data-d="1">+</button>
          <button class="cart-remove" data-remove="${i}">Remove</button>
        </div>
      </div>
      <div class="cart-item-price">${money(c.price*c.qty)}</div>
    </div>
  `).join('');
  body.querySelectorAll('.qty-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      const i=+b.dataset.i; const d=+b.dataset.d;
      cart[i].qty=Math.max(1,cart[i].qty+d);
      saveCart();updateCartUI();
    });
  });
  body.querySelectorAll('.cart-remove').forEach(b=>{
    b.addEventListener('click',()=>{
      cart.splice(+b.dataset.remove,1);
      saveCart();updateCartUI();
    });
  });
  const t=cartTotals();
  foot.innerHTML=`
    <div class="promo-row">
      <input type="text" id="promoInput" placeholder="Promo code (EDDY10)" value="${promoCode}" />
      <button class="btn btn-ghost btn-sm" id="applyPromo">Apply</button>
    </div>
    ${promoDiscount?`<div class="shipping-line"><span>Discount (${Math.round(promoDiscount*100)}%)</span><span style="color:var(--success)">-${money(t.discount)}</span></div>`:''}
    <div class="shipping-line"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    <div class="shipping-line"><span>Shipping</span><span>${t.shipping===0?'Free':money(t.shipping)}</span></div>
    <div class="cart-total"><span>Total</span><strong>${money(t.total)}</strong></div>
    <button class="btn btn-primary" id="checkoutBtn" style="width:100%">Checkout — ${money(t.total)}</button>
  `;
  $('#applyPromo').addEventListener('click',()=>{
    const v=$('#promoInput').value.trim().toUpperCase();
    if(v==='EDDY10'){promoCode=v;promoDiscount=0.1;toast('Promo applied: 10% off');}
    else if(v===''){promoCode='';promoDiscount=0;toast('Promo cleared');}
    else{toast('Invalid promo code');}
    saveCart();updateCartUI();
  });
  $('#checkoutBtn').addEventListener('click',openCheckout);
}

function openCheckout(){
  closeDrawer();
  const t=cartTotals();
  const content=$('#checkoutContent');
  content.innerHTML=`
    <button class="close-btn" data-close="checkoutModal" aria-label="Close">✕</button>
    <div class="checkout-form">
      <h2>Checkout</h2>
      <p style="color:var(--muted);font-size:.9rem">Order total: <strong style="color:var(--accent)">${money(t.total)}</strong></p>
      <div class="checkout-summary">
        ${cart.map(c=>`<div><span>${c.name} × ${c.qty}</span><span>${money(c.price*c.qty)}</span></div>`).join('')}
        ${promoDiscount?`<div><span>Discount</span><span style="color:var(--success)">-${money(t.discount)}</span></div>`:''}
        <div><span>Shipping</span><span>${t.shipping===0?'Free':money(t.shipping)}</span></div>
        <div class="tot"><span>Total</span><span>${money(t.total)}</span></div>
      </div>
      <div class="checkout-row">
        <div class="field"><input placeholder="First name" required autocomplete="given-name" /></div>
        <div class="field"><input placeholder="Last name" required autocomplete="family-name" /></div>
      </div>
      <div class="field"><input type="email" placeholder="Email" required autocomplete="email" /></div>
      <div class="field"><input placeholder="Shipping address" required autocomplete="street-address" /></div>
      <div class="checkout-row">
        <div class="field"><input placeholder="City" required autocomplete="address-level2" /></div>
        <div class="field"><input placeholder="Postal code" required autocomplete="postal-code" /></div>
      </div>
      <div class="field"><input placeholder="Card number" required inputmode="numeric" autocomplete="cc-number" /></div>
      <div class="checkout-row">
        <div class="field"><input placeholder="MM/YY" required autocomplete="cc-exp" /></div>
        <div class="field"><input placeholder="CVC" required autocomplete="cc-csc" /></div>
      </div>
      <label style="display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--muted)"><input type="checkbox" checked /> Save info for next time</label>
      <button class="btn btn-primary" id="placeOrderBtn">Place Order — ${money(t.total)}</button>
      <p class="checkout-trust">🔒 256-bit SSL encrypted · We never store your full card details</p>
    </div>
  `;
  openOverlay('checkoutModal');
  $('#placeOrderBtn').addEventListener('click',()=>{
    const orderId='EDDY-'+Math.random().toString(36).slice(2,8).toUpperCase();
    const t2=cartTotals();
    const items=[...cart];
    cart=[];promoCode='';promoDiscount=0;saveCart();updateCartUI();
    closeOverlay('checkoutModal');
    showConfirmation(orderId,items,t2);
  });
}

function showConfirmation(orderId,items,totals){
  const content=$('#confirmContent');
  content.innerHTML=`
    <div class="confirm-body">
      <div class="confirm-icon">✓</div>
      <h2>Order confirmed</h2>
      <p style="color:var(--muted)">Thank you for your order. A confirmation has been sent to your email.</p>
      <div class="confirm-order">
        <div><span>Order number</span><span><strong>${orderId}</strong></span></div>
        <div><span>Items</span><span>${items.reduce((a,c)=>a+c.qty,0)}</span></div>
        <div><span>Total</span><span><strong style="color:var(--accent)">${money(totals.total)}</strong></span></div>
        <div><span>Est. delivery</span><span>3–5 business days</span></div>
      </div>
      <button class="btn btn-primary" data-close="confirmModal" style="margin-top:8px">Continue Shopping</button>
    </div>
  `;
  openOverlay('confirmModal');
}

function openOverlay(id){const el=document.getElementById(id); if(el){el.classList.add('open');$('#backdrop').classList.add('open');}}
function closeOverlay(id){const el=document.getElementById(id); if(el){el.classList.remove('open');if(!$('.drawer.open'))$('#backdrop').classList.remove('open');}}
function openDrawer(){ $('#cartDrawer').classList.add('open');$('#backdrop').classList.add('open');}
function closeDrawer(){ $('#cartDrawer').classList.remove('open');if(!$('.overlay.open'))$('#backdrop').classList.remove('open');}
function openWishDrawer(){ $('#wishDrawer').classList.add('open');$('#backdrop').classList.add('open');}
function closeWishDrawer(){ $('#wishDrawer').classList.remove('open');if(!$('.overlay.open'))$('#backdrop').classList.remove('open');}

function toast(msg){
  const t=$('#toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600);
}

window.addEventListener('scroll',()=>{
  $('#siteHeader').classList.toggle('scrolled',window.scrollY>40);
  const btt=$('#backToTop');
  btt.classList.toggle('show',window.scrollY>600);
});

$('#filters').addEventListener('click',e=>{
  const b=e.target.closest('.filter'); if(!b) return;
  $$('.filter').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false');});
  b.classList.add('active');b.setAttribute('aria-selected','true');
  activeCat=b.dataset.cat; renderProducts();
});

$('#sortSelect').addEventListener('change',e=>{sortMode=e.target.value;renderProducts();});

$('#cartToggle').addEventListener('click',openDrawer);
$('#wishlistToggle').addEventListener('click',()=>{updateWishUI();openWishDrawer();});
$('#searchToggle').addEventListener('click',()=>openOverlay('searchOverlay'));
$('#searchInput').addEventListener('input',e=>{searchQuery=e.target.value;renderProducts();});
$('#menuToggle').addEventListener('click',()=>{
  const nav=$('#nav');nav.classList.toggle('open');
  $('#menuToggle').setAttribute('aria-expanded',nav.classList.contains('open'));
});
$('#backToTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

document.addEventListener('click',e=>{
  const c=e.target.closest('[data-close]');
  if(c){const id=c.dataset.close;
    if(id==='cartDrawer')closeDrawer();
    else if(id==='wishDrawer')closeWishDrawer();
    else closeOverlay(id);
  }
  if(e.target.id==='backdrop'){closeDrawer();closeWishDrawer();$$('.overlay.open').forEach(o=>o.classList.remove('open'));$('#backdrop').classList.remove('open');}
  const m=e.target.closest('[data-modal]');
  if(m){e.preventDefault();openModalContent(m.dataset.modal);}
  const cl=e.target.closest('[data-catlink]');
  if(cl){e.preventDefault();activeCat=cl.dataset.catlink;$$('.filter').forEach(x=>{x.classList.toggle('active',x.dataset.cat===activeCat);});renderProducts();document.getElementById('shop').scrollIntoView({behavior:'smooth'});}
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeDrawer();closeWishDrawer();$$('.overlay.open').forEach(o=>o.classList.remove('open'));$('#backdrop').classList.remove('open');
  }
});

$('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=e.target.querySelector('input[type="text"]').value;
  const email=e.target.querySelector('input[type="email"]').value;
  const subject=e.target.querySelector('input[placeholder="Subject"]').value||'Website enquiry';
  const msg=e.target.querySelector('textarea').value;
  const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  window.location.href=`mailto:hello@eddyclothing.co.za?subject=${encodeURIComponent(subject)}&body=${body}`;
  $('#formNote').textContent='Opening your email client…';
  e.target.reset();
});

$('#newsletterForm').addEventListener('submit',e=>{
  e.preventDefault();
  const email=e.target.querySelector('input').value;
  $('#newsNote').textContent=`Thanks! ${email} is on the list.`;
  e.target.reset();
});

const cf=$('#clearFilters'); if(cf) cf.addEventListener('click',()=>{activeCat='all';searchQuery='';$('#searchInput').value='';$$('.filter').forEach(x=>x.classList.toggle('active',x.dataset.cat==='all'));renderProducts();});

function openModalContent(id){
  const map={
    sizeModal:()=>sizeContent(),
    shippingModal:()=>shippingContent(),
    privacyModal:()=>privacyContent(),
    termsModal:()=>termsContent(),
    cookiesModal:()=>cookiesContent(),
  };
  if(map[id]) map[id]();
  openOverlay(id);
}

function sizeContent(){
  $('#sizeContent').innerHTML=`
    <div class="content-modal">
      <button class="close-btn" data-close="sizeModal" aria-label="Close">✕</button>
      <h2>Size Guide</h2>
      <p>Measurements are in centimetres. If between sizes, size up for outerwear.</p>
      <h3>Tops &amp; Outerwear</h3>
      <table class="size-table">
        <tr><th>Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr>
        <tr><td>S</td><td>88-93</td><td>76-81</td><td>68</td></tr>
        <tr><td>M</td><td>94-99</td><td>82-87</td><td>70</td></tr>
        <tr><td>L</td><td>100-105</td><td>88-93</td><td>72</td></tr>
        <tr><td>XL</td><td>106-111</td><td>94-99</td><td>74</td></tr>
      </table>
      <h3>Bottoms (waist)</h3>
      <table class="size-table">
        <tr><th>Size</th><th>Waist (cm)</th><th>Hip</th><th>Inseam</th></tr>
        <tr><td>28</td><td>71</td><td>91</td><td>76</td></tr>
        <tr><td>30</td><td>76</td><td>96</td><td>76</td></tr>
        <tr><td>32</td><td>81</td><td>101</td><td>76</td></tr>
        <tr><td>34</td><td>86</td><td>106</td><td>76</td></tr>
        <tr><td>36</td><td>91</td><td>111</td><td>76</td></tr>
      </table>
      <h3>Footwear (UK)</h3>
      <table class="size-table">
        <tr><th>UK</th><th>EU</th><th>US</th><th>Foot length (cm)</th></tr>
        <tr><td>7</td><td>40.5</td><td>8</td><td>25.4</td></tr>
        <tr><td>8</td><td>42</td><td>9</td><td>26.0</td></tr>
        <tr><td>9</td><td>43</td><td>10</td><td>27.0</td></tr>
        <tr><td>10</td><td>44.5</td><td>11</td><td>27.9</td></tr>
        <tr><td>11</td><td>46</td><td>12</td><td>28.6</td></tr>
        <tr><td>12</td><td>47</td><td>13</td><td>29.4</td></tr>
      </table>
    </div>`;
}
function shippingContent(){
  $('#shippingContent').innerHTML=`
    <div class="content-modal">
      <button class="close-btn" data-close="shippingModal" aria-label="Close">✕</button>
      <h2>Shipping &amp; Returns</h2>
      <h3>Shipping</h3>
      <p>Standard delivery within South Africa: 3–5 business days. Free on orders over R1,000; otherwise R80.</p>
      <p>Express delivery: 1–2 business days, R120 (select at checkout).</p>
      <p>International shipping available to most countries; rates calculated at checkout.</p>
      <h3>Returns</h3>
      <p>We accept returns within 30 days of delivery on unworn, unwashed items with original tags attached.</p>
      <p>Refunds are processed to the original payment method within 5 business days of receiving the return.</p>
      <p>To start a return, email <a href="mailto:returns@eddyclothing.co.za">returns@eddyclothing.co.za</a> with your order number.</p>
      <h3>Exchanges</h3>
      <p>Need a different size? We'll ship the replacement free of charge once we receive your return.</p>
    </div>`;
}
function privacyContent(){
  $('#privacyContent').innerHTML=`
    <div class="content-modal">
      <button class="close-btn" data-close="privacyModal" aria-label="Close">✕</button>
      <h2>Privacy Policy</h2>
      <p>EDDY CLOTHING respects your privacy. We collect only the information needed to process orders and improve your experience.</p>
      <h3>What we collect</h3>
      <ul>
        <li>Contact details (name, email, shipping address)</li>
        <li>Order and payment information (processed by our payment provider; we never store full card numbers)</li>
        <li>Browsing data via cookies for site functionality and analytics</li>
      </ul>
      <h3>How we use it</h3>
      <p>To fulfil orders, provide customer support, send transactional emails, and (with your consent) marketing communications.</p>
      <h3>Your rights</h3>
      <p>You may request access, correction, or deletion of your personal data at any time by emailing hello@eddyclothing.co.za.</p>
      <p>Last updated: November 2026.</p>
    </div>`;
}
function termsContent(){
  $('#termsContent').innerHTML=`
    <div class="content-modal">
      <button class="close-btn" data-close="termsModal" aria-label="Close">✕</button>
      <h2>Terms of Service</h2>
      <p>By using this site and placing an order, you agree to these terms.</p>
      <h3>Orders &amp; pricing</h3>
      <p>Prices are in South African Rand (ZAR) and include VAT. We reserve the right to correct pricing errors and cancel affected orders with a full refund.</p>
      <h3>Availability</h3>
      <p>Products are subject to availability. If an item becomes unavailable after ordering, we will notify you and refund in full.</p>
      <h3>Intellectual property</h3>
      <p>All content on this site — images, text, branding — is the property of EDDY CLOTHING and may not be reproduced without permission.</p>
      <h3>Limitation of liability</h3>
      <p>EDDY CLOTHING is not liable for indirect or consequential losses arising from use of this site or products.</p>
      <p>Last updated: November 2026.</p>
    </div>`;
}
function cookiesContent(){
  $('#cookiesContent').innerHTML=`
    <div class="content-modal">
      <button class="close-btn" data-close="cookiesModal" aria-label="Close">✕</button>
      <h2>Cookie Policy</h2>
      <p>We use cookies to keep the site functioning (cart, wishlist) and to understand how visitors use the site.</p>
      <h3>Essential cookies</h3>
      <p>Required for cart, wishlist and checkout to work. Cannot be disabled.</p>
      <h3>Analytics cookies</h3>
      <p>Help us understand traffic and improve the site. You can opt out via your browser settings.</p>
      <p>You can clear or block cookies at any time through your browser preferences.</p>
    </div>`;
}

// Init
renderProducts();
updateCartUI();
updateWishUI();
