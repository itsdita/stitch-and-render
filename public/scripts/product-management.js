const deleteProductButtonElements = document.querySelectorAll("#delete-product-btn");

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productId;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/admin/products/" + productId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }
  buttonElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener("click", deleteProduct);
}
