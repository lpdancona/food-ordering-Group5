// Client facing scripts here
const createDishElement = function(dish) {
  const $dish = $(`
    <li class="menu-item">
      <div class="dish-desc">
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
      </div>
      <div class="price">
        <p>${dish.cost}</p>
      </div>
      <button class="add-to-cart" name="add-to-cart" data-id="${dish.id}">
        <i class="fa-solid fa-plus"></i>
      </button>
    </li>
  `);

  return $dish;
};

const renderDishes = function(dishes, id) {
  dishes.forEach(dish => {
    const $dish = createDishElement(dish);
    $(id).append($dish);
  });
};

const loadDishes = function(callback) {
  $.get("/api/dishes/main")
    .then((response) => callback(response.dishes, "#mains"));
  console.log('work');
};

const buttonListeners = function(cart) {
  const buttons = document.querySelectorAll(".menu-item button");

  buttons.forEach(function(button) {
    $(button).click(function() {
      const id = this.dataset.id;
      const name = this.parentElement.querySelector(".dish-desc h3").innerHTML;
      const price = Number((this.parentElement.querySelector(".price p").innerHTML).replace("$", ""));

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

  const promise1 = new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/api/dishes/main'
    })
    .done(response => {
      renderDishes(response.dishes, "#mains");
      resolve();
    });
  });

  const promise2 = new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/api/dishes/appetizer'
    })
    .done(response => {
      renderDishes(response.dishes, "#appetizers");
      resolve();
    });
  });

  const promise3 = new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/api/dishes/dessert'
    })
    .done(response => {
      renderDishes(response.dishes, "#desserts");
      resolve();
    });
  });

  Promise.all([promise1, promise2, promise3]).then(() => {
    buttonListeners(cart);
  });
});
