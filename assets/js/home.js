const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE0YTFmNjFjMjUwNDAwMTUxYWI3M2MiLCJpYXQiOjE3NDYxODI2NDYsImV4cCI6MTc0NzM5MjI0Nn0.v6BeT57DX4pnQ-bleSyfnqzYAA-uu_SeSkyRRoQwHOk";

const loadingSpinner = document.getElementById("loading");
const alertPlaceholder = document.getElementById("alert-placeholder");
const productList = document.getElementById("product-list");

window.addEventListener("DOMContentLoaded", fetchProducts);

function fetchProducts() {
  loadingSpinner.style.display = "inline-block";
  fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Errore nel recupero dei prodotti");
      return res.json();
    })
    .then(renderProducts)
    .catch((err) => showAlert(err.message, "danger"))
    .finally(() => (loadingSpinner.style.display = "none"));
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    return showAlert("Nessun prodotto disponibile al momento.", "info");
  }

  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
    <div class="card h-100" id="backCard">
      <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;" />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-light">${product.name}</h5>
        <p class="card-text text-light">${product.description}</p>
        <p class="fw-bold text-primary">€${product.price}</p>
        <div class="d-grid gap-2 mt-auto">
          <a href="detail.html?id=${product._id}" class="btn btn-outline-light">Scopri di più</a>
          <button id="cartBtn" class="btn add-to-cart-btn" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}">Aggiungi al carrello</button>
        </div>
      </div>
    </div>
  `;
    productList.appendChild(col);
  });
}

function showAlert(message, type) {
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = e.target.dataset.price;

    cart.push({ id, name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartModal();
  }

  if (e.target.classList.contains("remove-from-cart-btn")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartModal();
  }
});

function updateCartModal() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Il carrello è vuoto.</p>";
    cartCount.textContent = "0";
    return;
  }

  cart.forEach((item, i) => {
    cartItems.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <strong>${item.name}</strong> <br />
          <span class="text-muted">€${item.price}</span>
        </div>
        <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-index="${i}">Rimuovi</button>
      </div>
    `;
  });

  cartCount.textContent = cart.length;
}

// Carica il carrello iniziale al primo avvio
updateCartModal();
