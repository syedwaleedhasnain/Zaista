document.addEventListener('DOMContentLoaded', async () => {
  Cart.updateBadge();
  const grid = document.getElementById('recipe-grid');
  const pillsContainer = document.getElementById('category-pills');
  let allRecipes = [];

  const categories = ['All', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Dessert', 'Quick'];
  if (pillsContainer) {
    pillsContainer.innerHTML = categories.map(c => `<button class="pill-btn ${c === 'All' ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
    pillsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('pill-btn')) {
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.getAttribute('data-cat');
        filterByTag(cat);
      }
    });
  }

  async function loadInitial() {
    try {
      const data = await API.getRecipes(12, 0);
      allRecipes = data.recipes.map(r => ({ ...r, price: 18.50 + (r.cookTimeMinutes || 20) * 0.2 }));
      renderRecipes(allRecipes);
    } catch (err) {
      grid.innerHTML = '<p>Could not load recipes from DummyJSON API.</p>';
    }
  }

  function renderRecipes(recipes) {
    if (!grid) return;
    grid.innerHTML = recipes.map(r => `
      <div class="recipe-card">
        <div class="recipe-card-media">
          <img src="${r.image}" alt="${r.name}">
          <span class="badge-cuisine">${r.cuisine}</span>
        </div>
        <div class="recipe-card-body">
          <h3 class="recipe-title">${r.name}</h3>
          <div class="recipe-meta">
            <span>⏱ ${r.cookTimeMinutes} min</span>
            <span>⭐ ${r.rating}</span>
            <span>🔥 ${r.caloriesPerServing} kcal</span>
          </div>
          <div class="card-bottom-row">
            <span class="price-tag">$${(r.price || 22.00).toFixed(2)}</span>
            <button class="btn btn-accent quick-add-btn" data-id="${r.id}">Add to Cart</button>
          </div>
          <a href="recipe-detail.html?id=${r.id}" style="font-size:13px; color:#E63946; margin-top:8px; display:inline-block;">View Recipe & Portions →</a>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.quick-add-btn').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.getAttribute('data-id'));
        const recipe = allRecipes.find(r => r.id === id);
        if (recipe) {
          Cart.addItem(recipe, 1, 4);
          Toast.show('Added to Cart', recipe.name, 'success');
        }
      };
    });
  }

  function filterByTag(tag) {
    if (tag === 'All') {
      renderRecipes(allRecipes);
    } else {
      const filtered = allRecipes.filter(r => 
        r.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())) ||
        r.cuisine.toLowerCase().includes(tag.toLowerCase())
      );
      renderRecipes(filtered);
    }
  }

  const searchInput = document.getElementById('recipe-search-input');
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const val = e.target.value.trim();
        if (val) {
          const res = await API.searchRecipes(val);
          renderRecipes(res.recipes);
        } else {
          renderRecipes(allRecipes);
        }
      }, 350);
    });
  }

  loadInitial();
});