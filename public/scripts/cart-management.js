const cartBadgeElement = document.querySelector(".badge");
const addToCartButtonElements = document.querySelectorAll(".add-to-cart");

async function addToCart(event) {
  const addToCartButtonElement = event.target;
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;
  console.log(productId, csrfToken);

  let response;

  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }
  if (!response.ok) {
    alert("Failed to add item to cart!");
    return;
  }

  const responseData = await response.json();
  const newTotalQuantity = responseData.newTotalItems;
  cartBadgeElement.textContent = newTotalQuantity;
  console.log(newTotalQuantity);
}

for (const addToCartButtonElement of addToCartButtonElements) {
  addToCartButtonElement.addEventListener("click", addToCart);
}
