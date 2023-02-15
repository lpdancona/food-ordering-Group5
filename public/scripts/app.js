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

const createShoppingCart = function() {
  const $shoppingCartContainer = $('<div>').addClass('shopping-cart');
  const $title = $('<div>').addClass('title').text('Shopping Cart');
  const $item = $('<div>').addClass('item');
  const $deleteBtnDiv = $('<div>').addClass('buttons');
  const $deleteBtn = $('<span>').addClass('delete-btn');
  const $deleteIcon = $('<i>').addClass('fa-solid fa-x');
  const $imageDiv = $('<div>').addClass('image');
  const $dishImage = $("<img/>", {
    src:'pasta.jpeg'}).addClass('item-img');
  const $descriptionDiv = $('<div>').addClass("description");
  const $dishName = $('<span>').text("Spaghetti");
  const $dishType = $('<span>').text('Main');
  const $quantityContainer = $('<div>').addClass('quantity');
  const $plusBtn = $('<button type="button">').addClass('plus-btn').attr('name','button');
  const $plusIcon = $('<i>').addClass('fa-solid fa-plu');
  const $input = $('<input type="text">').attr('name', 'name').text(1);
  const $minusBtn = $('<button type="button">').addClass('minus-btn').attr('name','button');
  const $minusIcon = $('<i>').addClass('fa-solid fa-minus');
  const $dishCost = $('<div>').addClass('total-price').text('$549');
  
  $deleteBtn.append($deleteIcon);
  $deleteBtnDiv.append($deleteBtn);
  $imageDiv.append($dishImage);
  $descriptionDiv.append($dishName,$dishType);
  $plusBtn.append($plusIcon);
  $minusBtn.append($minusIcon);
  $quantityContainer.append($plusBtn,$input,$minusBtn,$dishCost);
  $item.append($deleteBtnDiv, $imageDiv, $descriptionDiv, $quantityContainer);
  $shoppingCartContainer.append($title,$item);

  return $shoppingCartContainer;
};

const showShoppingCart =  function(){
  const cart = createShoppingCart();
  $('#item-container').append(cart);
};


$(document).ready(function() {
  let cart = {};

  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
  }
  $("#item-container").addClass("blackout");

  $( "#nav-icons" ).click(function() {
    alert( "Handler for .click() called." );
    showShoppingCart();
    if($("#item-container").hasClass("blackout")){
      $("#item-container").removeClass("blackout").addClass("whiteout");
    } else {
      $("#item-container").removeClass("whiteout").addClass("blackout");
    }
  });

  

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

  $.ajax({
    method: 'GET',
    url: '/api/orders/1'
  })
  .done(response => {
    console.log(response);
  });
});
