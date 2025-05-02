const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE0YTFmNjFjMjUwNDAwMTUxYWI3M2MiLCJpYXQiOjE3NDYxODI2NDYsImV4cCI6MTc0NzM5MjI0Nn0.v6BeT57DX4pnQ-bleSyfnqzYAA-uu_SeSkyRRoQwHOk";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
console.log(productId);

const productCard = document.getElementById("product-detail");
const alertPlaceholder = document.getElementById("alert-placeholder");

if (!productId) {
  showAlert("ID del prodotto mancante!", "danger");
} else {
  fetchProductDetails(productId);
}

function fetchProductDetails(id) {
  fetch(`${endpoint}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Impossibile recuperare i dettagli del prodotto.");
      return res.json();
    })
    .then((product) => {
      if (product) {
        updateProductDetails(product);
      } else {
        showAlert("Prodotto non trovato!", "danger");
      }
    })
    .catch((err) => {
      showAlert(err.message, "danger");
    });
}

function updateProductDetails(product) {
  document.getElementById("product-img").src = product.imageUrl || "default-image.jpg";
  document.getElementById("product-img").alt = product.name || "Immagine non disponibile";
  document.getElementById("product-name").textContent = product.name || "Nome non disponibile";
  document.getElementById("product-description").textContent = product.description || "Descrizione non disponibile";
  document.getElementById("product-brand").textContent = product.brand || "Marca non disponibile";
  document.getElementById("product-price").textContent = product.price ? `${product.price}€` : "Prezzo non disponibile";
  productCard.classList.remove("d-none");
}

function showAlert(message, type) {
  alertPlaceholder.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
}
