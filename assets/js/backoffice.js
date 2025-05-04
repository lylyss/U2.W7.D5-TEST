document.addEventListener("DOMContentLoaded", () => {
  /* DOM -Migliorie per evitare errori */
  const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE0YTFmNjFjMjUwNDAwMTUxYWI3M2MiLCJpYXQiOjE3NDYxODI2NDYsImV4cCI6MTc0NzM5MjI0Nn0.v6BeT57DX4pnQ-bleSyfnqzYAA-uu_SeSkyRRoQwHOk";

  const form = document.getElementById("product-form");
  const deleteBtn = document.getElementById("delete-btn");
  const resetBtn = document.getElementById("reset-btn");
  const alertPlaceholder = document.getElementById("alert-placeholder");
  const imageUrlInput = document.getElementById("imageUrl");
  const imagePreview = document.getElementById("image-preview");

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  /* SE ID, carica i dati del prodotto */
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
        updateImagePreview(data.imageUrl);
      })
      .catch((err) => showAlert("Errore nel caricamento del prodotto", "danger"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const product = {
      name: document.getElementById("name").value.trim(),
      description: document.getElementById("description").value.trim(),
      brand: document.getElementById("brand").value.trim(),
      imageUrl: document.getElementById("imageUrl").value.trim(),
      price: parseFloat(document.getElementById("price").value),
    };

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
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Errore durante il salvataggio");
          });
        }
        return res.json();
      })
      .then(() => {
        showAlert(productId ? "Prodotto modificato con successo!" : "Prodotto creato con successo!", "success");
        if (!productId) {
          form.reset();
          imagePreview.classList.add("d-none");
          imagePreview.src = "";
        }
      })
      .catch((err) => showAlert(err.message, "danger"));
  });

  /*   Cancella prodotto */
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
          imagePreview.classList.add("d-none");
          setTimeout(() => (window.location.href = "index.html"), 1500);
        })
        .catch((err) => showAlert(err.message, "danger"));
    }
  });

  /* Reset form con conferma */
  resetBtn.addEventListener("click", function (e) {
    if (!confirm("Vuoi davvero resettare il form?")) {
      e.preventDefault();
    } else {
      imagePreview.classList.add("d-none");
      imagePreview.src = "";
    }
  });

  /* anteprima immagine */
  imageUrlInput.addEventListener("input", () => {
    const url = imageUrlInput.value.trim();
    updateImagePreview(url);
  });

  function updateImagePreview(url) {
    if (url) {
      imagePreview.src = url;
      imagePreview.classList.remove("d-none");

      imagePreview.onerror = () => {
        imagePreview.classList.add("d-none");
      };
    } else {
      imagePreview.classList.add("d-none");
      imagePreview.src = "";
    }
  }

  /*messaggio  in caso di errore */
  function showAlert(message, type) {
    alertPlaceholder.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
});
