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
    .then((products) => {
      renderProducts(products);
    })
    .catch((err) => {
      showAlert(err.message, "danger");
    })
    .finally(() => {
      loadingSpinner.style.display = "none";
    });
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    return showAlert("Nessun prodotto disponibile. Aggiungine uno dal Backoffice!", "info");
  }

  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" style="object-fit: cover; height: 200px;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text fw-bold">€${product.price}</p>
          <div class="mt-auto d-flex justify-content-between">
            <a href="backoffice.html?id=${product._id}" class="btn btn-sm btn-outline-primary">Modifica</a>
            <a href="detail.html?id=${product._id}" class="btn btn-sm btn-outline-dark">Scopri di più</a>
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
