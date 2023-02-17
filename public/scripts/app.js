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

};

const deleteCartItems = (cart, id) => {
  if (id in cart && cart[id].qty > 0){
    cart[id].qty--;
  } else {
    delete cart[id];
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

const cartListener = function(cart){
  $("#item-container").addClass("blackout");

  $( "#nav-icons" ).click(function() {
    showShoppingCart(cart);
    if($("#item-container").hasClass("blackout")){
      $("#item-container").removeClass("blackout").addClass("whiteout");
    } else {
      $("#item-container").removeClass("whiteout").addClass("blackout");
    }
  });
}

const addToDishQty = function (cart) {
  $('#item-container').on('click','.plus-btn',function(e){
    // changing quantity on shopping cart
    $input = $(this).next();
    const qty = parseInt($input.val());
    $input.val(qty+1);

    $description = $(this).parent('.quantity').siblings('.description');
    const $name = $(this).parent('.quantity').siblings('.description').find('.dish-name').text();
    const $price = $(this).siblings('.price').text();
    const $id = $(this).parents('.item').attr('id');
    addToCart(cart,$id, {$name, $price});

  });
}

  const removeDishQty = function (cart) {
    $('#item-container').on('click','.minus-btn',function(e){
      // changing quantity on shopping cart
      $input = $(this).siblings('input');
      const qty = parseInt($input.val());
      const id = $(this).parents('.item').attr('id');
      console.log($input, qty,id)
      if( qty === 0){
        const $dishItem = $(this).parents(`.item#${id}`);
        // const $dishItem = $(this).parents('.item');
        // $('.shopping-cart').remove('.item');
        $dishItem.remove();
        deleteCartItems(cart,id);
        return;
      }
      $input.val(qty - 1);
      deleteCartItems(cart,id);

   });




}
/**
 *
 * @param {*} cart
 * @returns item containing information on one dish in cart
 */

const createCartItem = function (cart, id){

  const $item = $('<div>').addClass('item').attr('id',id);
  const $deleteBtnDiv = $('<div>').addClass('buttons');
  const $deleteBtn = $('<span>').addClass('delete-btn');
  const $deleteIcon = $('<i>').addClass('fa-solid fa-x');

  const $descriptionDiv = $('<div>').addClass("description");
  const $dishName = $('<span>').addClass('dish-name').text(cart[id].name);
  const $quantityContainer = $('<div>').addClass('quantity');
  const $plusBtn = $('<button type="button">').addClass('plus-btn').attr('name','button');
  const $plusIcon = $('<i>').addClass('fa-solid fa-plus');
  const $input = $('<input type="text">').attr('name', 'name').attr('value', cart[id].qty);
  const $minusBtn = $('<button type="button">').addClass('minus-btn').attr('name','button');
  const $minusIcon = $('<i>').addClass('fa-solid fa-minus');
  const $dishCost = $('<div>').addClass('price').text(cart[id].price);

  $deleteBtn.append($deleteIcon);
  $deleteBtnDiv.append($deleteBtn);
  $descriptionDiv.append($dishName);
  $plusBtn.append($plusIcon);
  $minusBtn.append($minusIcon);
  $quantityContainer.append($plusBtn,$input,$minusBtn,$dishCost);
  $item.append($deleteBtnDiv, $descriptionDiv, $quantityContainer);

  return $item;

}
/**
 * @returns shoppingCartContainer
 * a div containing all html elements
 *  needed to "render" a shopping cart on the homepage
 */

const createShoppingCart = function(cart) {

  const $shoppingCartContainer = $('<div>').addClass('shopping-cart');
  const $title = $('<div>').addClass('title').text('Shopping Cart');
  $shoppingCartContainer.append($title);
  if (localStorage.getItem("cart")) {
    for (id in cart){
      let $item = createCartItem(cart, id);
      $shoppingCartContainer.append($item);
    }

  }

  const $totalPrice = $('<div>').addClass('total-price').text('0');
  const $submitBtn = $('<button type="submit" id="order-btn">Submit</button>');
  $shoppingCartContainer.append($totalPrice, $submitBtn);
  return $shoppingCartContainer;
};
/**
 * showShoppingCart function displays the shopping cart
 * by appending it to a empty div in
 * the home page
 */
const showShoppingCart =  function(cart){
  const $itemContainer = $('#item-container');
  // empties container before appending cart
  $itemContainer.empty();
  // calls function to create cart
  const shoppingCart = createShoppingCart(cart);
  $itemContainer.append(shoppingCart);
};

const placeOrderButton = function(cart) {
  $('#item-container').on('click', "#order-btn", function(e){
    // changing quantity on shopping cart
    console.log('button is clicked');
    if (Object.keys(cart).length === 0) {
      // alert
    } else {
      $.ajax({
        method: 'POST',
        url: `/api/orders`,
        data: cart
      })
      .done(response => {
        // location.reload();
        console.log('order successfully placed');
      });
    }
  });
}

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
    cartListener(cart);
    addToDishQty(cart);
    removeDishQty(cart);
    placeOrderButton(cart);
  });
});
