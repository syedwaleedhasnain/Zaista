const API = {
  BASE_URL: 'https://dummyjson.com/recipes',
  async getRecipes(limit = 12, skip = 0) {
    const res = await fetch(this.BASE_URL + '?limit=' + limit + '&skip=' + skip);
    return res.json();
  },
  async getRecipeById(id) {
    const res = await fetch(this.BASE_URL + '/' + id);
    return res.json();
  },
  async searchRecipes(q) {
    const res = await fetch(this.BASE_URL + '/search?q=' + encodeURIComponent(q));
    return res.json();
  },
  async addRecipe(data) {
    const res = await fetch(this.BASE_URL + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};