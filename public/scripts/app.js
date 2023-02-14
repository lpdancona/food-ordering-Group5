// Client facing scripts here
const buttonListeners = function(cart) {
  const buttons = document.querySelectorAll(".menu-item button");

  buttons.forEach(function(button) {
    $(button).click(function() {
      const id = this.dataset.id;
      const name = this.parentElement.querySelector(".dish-desc h3").innerHTML;
      const price = Number(this.parentElement.querySelector(".price p").innerHTML);

      addToCart(cart, id, { name, price });
    })
  });
};

const addToCart = (cart, id, product) => {
  if (id in cart) {
    cart[id].qty++;
  } else {
    cart[id] = product;
    cart[id].qty = 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  console.log(cart);
};

$(document).ready(function() {
  let cart = {};

  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
  }

  console.log(cart);

  buttonListeners(cart);
});
