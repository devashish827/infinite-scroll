
const productContainer = document.getElementById('product-container');
const loader = document.getElementById('loader');

let currentPage = 1;
const limit = 5; 
let isLoading = false;


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function fetchProducts(page, limit) {
  if (isLoading) return; 

  try {
    isLoading = true;
    loader.style.display = 'flex'; 

   
    await delay(1000);

    const response = await fetch(`https://api.escuelajs.co/api/v1/products?offset=${(page - 1) * limit}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    isLoading = true;
    loader.style.display = 'hidden';
    renderProducts(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    if (page === 1) {
      productContainer.innerHTML = "<p>Error loading product details. Please try again later.</p>";
    }
  } finally {
    loader.style.display = 'none'; 
    isLoading = false;
  }
}


function renderProducts(products) {
 
  productContainer.innerHTML += products.map(product => `
    <div class="product-card">
      <img src="https://cdn.britannica.com/84/232784-050-1769B477/Siberian-Husky-dog.jpg" alt="${product.title}" class="product-image">
      <div class="product-info">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-price">${product.price.toFixed(2)}</p>
        <p class="product-description">${product.description}</p>
        <div class="category-info">
          ${product.category?.image ? `<img src="${product.category.image}" alt="${product.category.name}">` : ''}
          <div>
            <p class="category-name">${product.category?.name || 'Unknown Category'}</p>
            <p class="date-info">Created on: ${formatDate(product.creationAt)}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');
 
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60 && !isLoading) {
    currentPage++;
    fetchProducts(currentPage, limit);
  }
}
fetchProducts(currentPage, limit);

window.addEventListener('scroll', handleScroll);
