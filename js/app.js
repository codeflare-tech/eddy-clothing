/* EDDY CLOTHING app */
const PRODUCTS = [
  {id:1,name:'Essential Oversized Tee',cat:'tops',price:450,img:'images/tee.png',sizes:['S','M','L','XL'],desc:'Heavyweight cotton tee with a relaxed drop shoulder. Pre-washed for a lived-in softness.',badge:'New'},
  {id:2,name:'Merino Crew Sweater',cat:'tops',price:1290,img:'images/sweater.png',sizes:['S','M','L','XL'],desc:'Fine-gauge merino wool crew neck. Lightweight warmth, year-round wear.',badge:null},
  {id:3,name:'Classic Polo Shirt',cat:'tops',price:690,img:'images/polo.png',sizes:['S','M','L','XL'],desc:'Pique cotton polo with a structured collar. Smart-casual staple.',badge:null},
  {id:4,name:'Charcoal Hoodie',cat:'tops',price:990,img:'images/hoodie.png',sizes:['S','M','L','XL'],desc:'Brushed fleece hoodie with kangaroo pocket. Everyday comfort.',badge:'Bestseller'},
  {id:5,name:'Olive Bomber Jacket',cat:'outerwear',price:1890,img:'images/bomber.png',sizes:['S','M','L','XL'],desc:'Water-resistant nylon bomber with ribbed cuffs and hem. Transitional layer.',badge:'New'},
  {id:6,name:'Black Leather Biker',cat:'outerwear',price:4990,img:'images/leather.png',sizes:['S','M','L','XL'],desc:'Full-grain leather biker jacket. YKK zips, quilted lining. Built to age.',badge:'Premium'},
  {id:7,name:'Slim Dark Denim',cat:'bottoms',price:1190,img:'images/jeans.png',sizes:['28','30','32','34','36'],desc:'Selvedge-inspired slim jeans in deep indigo. Stretch comfort.',badge:null},
  {id:8,name:'Beige Chinos',cat:'bottoms',price:890,img:'images/chino.png',sizes:['28','30','32','34','36'],desc:'Tapered chino in garment-dyed beige. Office to weekend.',badge:null},
  {id:9,name:'Minimalist Sneakers',cat:'footwear',price:1590,img:'images/sneakers.png',sizes:['7','8','9','10','11','12'],desc:'Clean leather low-top sneakers. Margom sole, hand-stitched.',badge:'New'},
];

const CAT_LABEL={tops:'Tops',outerwear:'Outerwear',bottoms:'Bottoms',footwear:'Footwear'};

let cart=JSON.parse(localStorage.getItem('eddy_cart')||'[]');
let activeCat='all';
let searchQuery='';
let selectedSize=null;
let qty=1;
let currentProduct=null;

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function money(n){return 'R '+n.toLocaleString('en-ZA')}

function renderProducts(){
  const grid=$('#productGrid');
  const list=PRODUCTS.filter(p=>{
    const catOk=activeCat==='all'||p.cat===activeCat;
    const q=searchQuery.trim().toLowerCase();
    const searchOk=!q||p.name.toLowerCase().includes(q)||p.cat.includes(q);
    return catOk&&searchOk;
  });
  grid.innerHTML=list.map(p=>`
    <div class="product-card" data-id="${p.id}">
      <div class="product-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.badge?`<span class="product-badge">${p.badge}</span>`:''}
        <div class="product-quick">Quick View</div>
      </div>
      <div class="product-info">
        <div>
          <div class="product-name">${p.name}</div>
          <div class="product-cat">${CAT_LABEL[p.cat]}</div>
        </div>
        <div class="product-price">${money(p.price)}</div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.product-card').forEach(c=>{
    c.addEventListener('click',()=>openProduct(+c.dataset.id));
  });
}

function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id);
  currentProduct=p;
  selectedSize=p.sizes[0];
  qty=1;
  const content=$('#productModalContent');
  content.innerHTML=`
    <div class="modal-media"><img src="${p.img}" alt="${p.name}" /></div>
    <div class="modal-body">
      <div class="modal-cat">${CAT_LABEL[p.cat]}</div>
      <h2>${p.name}</h2>
      <div class="modal-price">${money(p.price)}</div>
      <p class="modal-desc">${p.desc}</p>
      <div>
        <p class="eyebrow" style="margin-bottom:8px">Size</p>
        <div class="size-row">
          ${p.sizes.map(s=>`<button class="size-btn ${s===selectedSize?'active':''}" data-size="${s}">${s}</button>`).join('')}
        </div>
      </div>
      <div>
        <p class="eyebrow" style="margin-bottom:8px">Quantity</p>
        <div class="qty-row">
          <button class="qty-btn" id="qtyMinus">−</button>
          <span class="qty-val" id="qtyVal">1</span>
          <button class="qty-btn" id="qtyPlus">+</button>
        </div>
      </div>
      <button class="btn btn-primary" id="addToCartBtn" style="margin-top:8px">Add to Cart — ${money(p.price)}</button>
    </div>
    <button class="close-btn" data-close="productModal">✕</button>
  `;
  openOverlay('productModal');
  content.querySelectorAll('.size-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      selectedSize=b.dataset.size;
      content.querySelectorAll('.size-btn').forEach(x=>x.classList.toggle('active',x===b));
      updateAddBtn();
    });
  });
  $('#qtyMinus').addEventListener('click',()=>{if(qty>1){qty--;$('#qtyVal').textContent=qty;updateAddBtn();}});
  $('#qtyPlus').addEventListener('click',()=>{qty++;$('#qtyVal').textContent=qty;updateAddBtn();});
  $('#addToCartBtn').addEventListener('click',addToCart);
}

function updateAddBtn(){
  if(!currentProduct) return;
  $('#addToCartBtn').textContent=`Add to Cart — ${money(currentProduct.price*qty)}`;
}

function addToCart(){
  const item={id:currentProduct.id,name:currentProduct.name,price:currentProduct.price,img:currentProduct.img,size:selectedSize,qty};
  const existing=cart.find(c=>c.id===item.id&&c.size===item.size);
  if(existing) existing.qty+=qty; else cart.push(item);
  saveCart();
  closeOverlay('productModal');
  toast('Added to cart');
  updateCartUI();
}

function saveCart(){localStorage.setItem('eddy_cart',JSON.stringify(cart));}

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
        <div class="cart-item-meta">Size ${c.size}</div>
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
  const total=cart.reduce((a,c)=>a+c.price*c.qty,0);
  foot.innerHTML=`
    <div class="cart-total"><span>Total</span><strong>${money(total)}</strong></div>
    <button class="btn btn-primary" id="checkoutBtn" style="width:100%">Checkout</button>
  `;
  $('#checkoutBtn').addEventListener('click',openCheckout);
}

function openCheckout(){
  closeDrawer();
  const total=cart.reduce((a,c)=>a+c.price*c.qty,0);
  const content=$('#checkoutContent');
  content.innerHTML=`
    <button class="close-btn" data-close="checkoutModal">✕</button>
    <div class="checkout-form">
      <h2>Checkout</h2>
      <p style="color:var(--muted);font-size:.9rem">Order total: <strong style="color:var(--accent)">${money(total)}</strong></p>
      <div class="checkout-summary">
        ${cart.map(c=>`<div><span>${c.name} × ${c.qty}</span><span>${money(c.price*c.qty)}</span></div>`).join('')}
        <div class="tot"><span>Total</span><span>${money(total)}</span></div>
      </div>
      <div class="checkout-row">
        <div class="field"><input placeholder="First name" required /></div>
        <div class="field"><input placeholder="Last name" required /></div>
      </div>
      <div class="field"><input type="email" placeholder="Email" required /></div>
      <div class="field"><input placeholder="Shipping address" required /></div>
      <div class="checkout-row">
        <div class="field"><input placeholder="City" required /></div>
        <div class="field"><input placeholder="Postal code" required /></div>
      </div>
      <div class="field"><input placeholder="Card number" required /></div>
      <div class="checkout-row">
        <div class="field"><input placeholder="MM/YY" required /></div>
        <div class="field"><input placeholder="CVC" required /></div>
      </div>
      <button class="btn btn-primary" id="placeOrderBtn">Place Order</button>
    </div>
  `;
  openOverlay('checkoutModal');
  $('#placeOrderBtn').addEventListener('click',()=>{
    cart=[];saveCart();updateCartUI();
    closeOverlay('checkoutModal');
    toast('Order placed — thank you!');
  });
}

function openOverlay(id){document.getElementById(id).classList.add('open');$('#backdrop').classList.add('open');}
function closeOverlay(id){document.getElementById(id).classList.remove('open');if(!$('.drawer.open'))$('#backdrop').classList.remove('open');}
function openDrawer(){$('#cartDrawer').classList.add('open');$('#backdrop').classList.add('open');}
function closeDrawer(){$('#cartDrawer').classList.remove('open');if(!$('.overlay.open'))$('#backdrop').classList.remove('open');}

function toast(msg){
  let t=$('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400);
}

// Header scroll
window.addEventListener('scroll',()=>{
  $('#siteHeader').classList.toggle('scrolled',window.scrollY>40);
});

// Filters
$('#filters').addEventListener('click',e=>{
  const b=e.target.closest('.filter'); if(!b) return;
  $$('.filter').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); activeCat=b.dataset.cat; renderProducts();
});

// Cart toggle
$('#cartToggle').addEventListener('click',openDrawer);
// Search
$('#searchToggle').addEventListener('click',()=>openOverlay('searchOverlay'));
$('#searchInput').addEventListener('input',e=>{searchQuery=e.target.value;renderProducts();});
// Menu
$('#menuToggle').addEventListener('click',()=>$('#nav').classList.toggle('open'));

// Close handlers
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-close]');
  if(c){const id=c.dataset.close;if(id==='cartDrawer')closeDrawer();else closeOverlay(id);}
  if(e.target.id==='backdrop'){closeDrawer();$$('.overlay.open').forEach(o=>o.classList.remove('open'));$('#backdrop').classList.remove('open');}
});

// Contact form
$('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  $('#formNote').textContent='Message sent — we will be in touch shortly.';
  e.target.reset();
});

// Init
renderProducts();
updateCartUI();
