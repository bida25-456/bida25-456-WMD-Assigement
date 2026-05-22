let cart = JSON.parse(localStorage.getItem('delroyCart')) || [];

function saveCart() {
  localStorage.setItem('delroyCart', JSON.stringify(cart));
}

function addToCart(id, name, price, emoji) {
  const existing = cart.find(item => item.id === id);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id, name, price, emoji, qty: 1 }); }
  saveCart();
  updateCartUI();
  showToast(`${name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart(); updateCartUI(); renderCartItems();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart(); updateCartUI(); renderCartItems();
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = total);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const el = document.querySelector('.cart-total-price');
  if (el) el.textContent = `BWP ${totalPrice.toFixed(2)}`;
}

function renderCartItems() {
  const body = document.querySelector('.cart-body');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = `<div style="text-align:center;padding:60px 20px;color:#888"><div style="font-size:4rem">🛒</div><p>Your cart is empty</p></div>`;
    return;
  }
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="name">${item.name}</div>
        <div class="price">BWP ${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.id}')">✕</button>
    </div>
  `).join('');
}

function openCart() {
  document.querySelector('.cart-overlay').classList.add('open');
  document.querySelector('.cart-sidebar').classList.add('open');
  renderCartItems(); updateCartUI();
}

function closeCart() {
  document.querySelector('.cart-overlay').classList.remove('open');
  document.querySelector('.cart-sidebar').classList.remove('open');
}

function showToast(msg) {
  const toast = document.querySelector('.toast-cart');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function handleAddToCart(btn, id, name, price, emoji) {
  addToCart(id, name, price, emoji);
  btn.classList.add('added');
  btn.textContent = '✓ Added!';
  setTimeout(() => { btn.classList.remove('added'); btn.textContent = '🛒 Add to Cart'; }, 1800);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) overlay.addEventListener('click', closeCart);
});