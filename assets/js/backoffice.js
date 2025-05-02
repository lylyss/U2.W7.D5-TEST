const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE0YTFmNjFjMjUwNDAwMTUxYWI3M2MiLCJpYXQiOjE3NDYxODI2NDYsImV4cCI6MTc0NzM5MjI0Nn0.v6BeT57DX4pnQ-bleSyfnqzYAA-uu_SeSkyRRoQwHOk";

const form = document.getElementById("product-form");
const deleteBtn = document.getElementById("delete-btn");
const resetBtn = document.getElementById("reset-btn");
const alertPlaceholder = document.getElementById("alert-placeholder");

/* per la modifica URL */
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

/* precompila il form */
if (productId) {
  fetch(endpoint + productId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("name").value = data.name;
      document.getElementById("description").value = data.description;
      document.getElementById("brand").value = data.brand;
      document.getElementById("imageUrl").value = data.imageUrl;
      document.getElementById("price").value = data.price;
      deleteBtn.classList.remove("d-none");
    })
    .catch((err) => showAlert("Errore nel caricamento del prodotto", "danger"));
}

/* FORM */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const product = {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    brand: document.getElementById("brand").value.trim(),
    imageUrl: document.getElementById("imageUrl").value.trim(),
    price: parseFloat(document.getElementById("price").value),
  };
  /* Per validare il form */
  if (!product.name || !product.description || !product.brand || !product.imageUrl || isNaN(product.price)) {
    return showAlert("Tutti i campi sono obbligatori e il prezzo deve essere un numero", "warning");
  }

  const method = productId ? "PUT" : "POST";
  const url = productId ? endpoint + productId : endpoint;

  fetch(url, {
    method: method,
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Prodotto esistente");
      return res.json();
    })
    .then(() => {
      showAlert(productId ? "Prodotto modificato con successo!" : "Prodotto creato con successo!", "success");
      if (!productId) form.reset();
    })
    .catch((err) => showAlert(err.message, "danger"));
});

/* Cancella  */
deleteBtn.addEventListener("click", function () {
  if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
    fetch(endpoint + productId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione");
        showAlert("Prodotto eliminato con successo", "success");
        form.reset();
        deleteBtn.classList.add("d-none");
      })
      .catch((err) => showAlert(err.message, "danger"));
  }
});

/* Reset */
resetBtn.addEventListener("click", function (e) {
  if (!confirm("Vuoi davvero resettare il form?")) {
    e.preventDefault();
  }
});

/* Avviso per complilare  */
function showAlert(message, type) {
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}
