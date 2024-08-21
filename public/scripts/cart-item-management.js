const cartItemUpdateFormElements = document.querySelectorAll(
  ".cart-item-managemenet"
);

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;
  const quantityElement = form.children[2].children[1];

  const productId = form.dataset.productid;
  const csrf = form.dataset.csrf;
  const quantity = quantityElement.value;

  let response;

  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrf,
      }),
    });
    console.log(response);
  } catch (error) {
    alert("An error occurred while updating the cart item. Please try again.");
    return;
  }
  if (!response.ok) {
    alert("An error occurred while updating the cart item. Please try again.");
    return;
  }

  const responseData = await response.json();

  const cartItemTotalPriceElement = form.children[1].children[1];
  cartItemTotalPriceElement.textContent =
    responseData.updatedCartData.updatedItemPrice.toFixed(2);
  const cartTotalPriceElement = document.querySelector(".cart-total-price");
  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);
  const cartBadge = document.querySelector(".badge");
  cartBadge.textContent = responseData.updatedCartData.newTotalQuantity;
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem);
}
