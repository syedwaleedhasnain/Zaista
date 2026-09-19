const Cart = {
  STORAGE_KEY: 'zaista_cart_items',
  getItems() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  save(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateBadge();
  },
  addItem(recipe, quantity = 1, servings = 4) {
    const items = this.getItems();
    const existing = items.find(i => i.recipe.id === recipe.id);
    const unitPrice = recipe.price || 24.50;
    if (existing) {
      existing.quantity += quantity;
      existing.customServings = servings;
    } else {
      items.push({ recipe, quantity, customServings: servings, unitPrice });
    }
    this.save(items);
  },
  updateBadge() {
    const items = this.getItems();
    const count = items.reduce((acc, i) => acc + i.quantity, 0);
    const badges = document.querySelectorAll('#cart-badge');
    badges.forEach(b => b.textContent = count);
  },
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateBadge();
  },
  renderCartPage() {
    const list = document.getElementById('cart-list');
    if (!list) return;
    const items = this.getItems();
    if (items.length === 0) {
      list.innerHTML = '<p class="empty-cart-text">Your cart is currently empty. Explore chef recipes to begin.</p>';
      return;
    }
    let subtotal = 0;
    list.innerHTML = items.map(item => {
      const itemTotal = item.unitPrice * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #EEE;">
          <img src="${item.recipe.image}" width="70" height="70" style="object-fit:cover; border-radius:8px;">
          <div style="flex:1; margin-left:14px;">
            <h4>${item.recipe.name}</h4>
            <small>Servings: ${item.customServings} | $${item.unitPrice.toFixed(2)} each</small>
          </div>
          <div><strong>$${itemTotal.toFixed(2)}</strong></div>
        </div>
      `;
    }).join('');

    const sub = document.getElementById('summary-subtotal');
    const tot = document.getElementById('summary-total');
    if (sub) sub.textContent = '$' + subtotal.toFixed(2);
    if (tot) tot.textContent = '$' + (subtotal + 4.99).toFixed(2);
  }
};