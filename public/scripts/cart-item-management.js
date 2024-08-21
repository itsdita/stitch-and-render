const cartItemUpdateFormElements = document.querySelectorAll(
  ".cart-item-managemenet"
);

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const csrf = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;

  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrf,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
    });
  } catch (error) {
    alert("An error occurred while updating the cart item. Please try again.");
    return;
  }
  if (!response) {
    alert("An error occurred while updating the cart item. Please try again.");
    return;
  }

  const responseData = await response.json();

  const cartItemTotalPriceElement = document.querySelector(".cart-item-total-price");
  cartItemTotalPriceElement.textContent =
    responseData.updatedCartItem.updatedItemPrice.toFixed(2);
  const cartTotalPriceElement = document.querySelector(".cart-ttl-price");
  cartTotalPriceElement.textContent =
    responseData.updatedCartItem.newTotalPrice.toFixed(2);
  const cartBadge = document.querySelector(".badge");
  cartBadge.textContent = responseData.updatedCartItem.newTotalQuantity;
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem);
}
