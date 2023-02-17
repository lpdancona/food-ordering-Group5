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
/**
 *
 * @param {*} cart an nest object from local storage containing
 * a specific customer's order details
 * @param {*} id is an id referencing a specfic dish inside the cart
 * function is responsible for deleting quantity of a specfic dish
 */

const deleteCartItems = (cart, id) => {
  if (id in cart && cart[id].qty > 0){
    cart[id].qty--;
  } else {
    // delete the entire dish from local storage if qty is equal to zero
    delete cart[id];
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 *
 * @param {*} cart is a nested object from local storage
 * containing details of a specfic customer's order
 * function calculates the total price of order
 */

const calcTotalPrice = (cart)  => {
  let total = 0;
  for (const key in cart) {
    total += Number(cart[key].price) * Number(cart[key].qty)
  }
  $('.total-price').text(`$${total.toFixed(2)}`);
}
/**
 *
 * @param {*} cart is a nested object from local storage
 * representing a customer's order
 * function listens to click on shopping cart icon
 * and displays shopping cart when icon is clicked
 */
const cartListener = function(cart){

  //  when blackout is on the shopping cart is hidden
  $("#item-container").addClass("blackout");

  $( "#nav-icons" ).click(function() {
    showShoppingCart(cart);
    calcTotalPrice(cart);
    if($("#item-container").hasClass("blackout")){
      // whiteout reveals the cart
      $("#item-container").removeClass("blackout").addClass("whiteout");
    } else {
      $("#item-container").removeClass("whiteout").addClass("blackout");
    }
  });
}
/**
 *
 * @param {*} cart is a nested object in local storage
 * representing the order details of a specific customer's order
 * function is responsible for adding to dish qty on the shopping cart
 */
const addToDishQty = function (cart) {
  $('#item-container').on('click','.plus-btn',function(e){
    // changing quantity on shopping cart
    $input = $(this).next();
    const newQty = parseInt($input.val()) +1;
    $input.val(newQty);
    const name = $(this).parent('.quantity').siblings('.description').find('.dish-name').text();
    const id = $(this).parents('.item').attr('id');
    const price = $(this).siblings('.price').text();
    // updating local storage to change qty
    addToCart(cart,id, {name, price});
    calcTotalPrice(cart);
  });
}
/**
 * @param {*} cart is a nested object in local storage
 * representing the order details of a specific customer's order
 * function is responsible for removing dish qty
 */
  const removeDishQty = function (cart) {
    $('#item-container').on('click','.minus-btn',function(e){
      // changing quantity on shopping cart
      $input = $(this).siblings('input');
      const qty = parseInt($input.val());
      const id = $(this).parents('.item').attr('id');
      console.log($input, qty,id)
      // if qty is 0 remove dish item container from cart
      if( qty === 0){
        const $dishItem = $(this).parents(`.item#${id}`);
        $dishItem.remove();
        //call function to update local storage to delete dish
        deleteCartItems(cart,id);
        return;
      }
      // remove dish quantity on screen
      $input.val(qty - 1);
      // update local storage with single deletion of qty from cart
      deleteCartItems(cart,id);
      //calculate new total price
      calcTotalPrice(cart);

   });
 }
/**
 *
 * @param {*} cart is a nested object in local storage
 * representing the order details of a specific customer's order
 * function is responsible for deleting all instances of a dish regardless of qty
 * from the cart
 */
 const deleteDish = (cart) => {
  $('#item-container').on('click', '.delete-btn', function() {
    const id = this.parentElement.parentElement.id; // get product id
    this.parentElement.parentElement.remove(); // remove the div from cart
    delete cart[id]; // delete dish from cart
    localStorage.setItem("cart", JSON.stringify(cart)); // update local storage with changes
    calcTotalPrice(cart); // calculate new total
});




}
/**
 *
 * @param {*} cart is a nested object in local storage
 * representing the order details of a specific customer's order
 * @returns item containing information on a single dish in cart
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
 * @param {*} cart is a nested object in local storage
 * representing the order details of a specific customer's order
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
  const $priceDiv = $('<div>').addClass('price-div');
  const $priceBtnDiv = $('<div>').addClass('price-btn-div');
  const $grandTotal = $('<p>').addClass('price-label').text('Grand Total');
  const $totalPrice = $('<p>').addClass('total-price').text('0');
  const $submitBtn = $('<button type="submit" id="order-btn">Submit</button>')
  $priceDiv.append($grandTotal,$totalPrice);
  $priceBtnDiv.append($priceDiv, $submitBtn);
  $shoppingCartContainer.append($priceBtnDiv);
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
        sessionStorage.reloadAfterPageLoad = true;
        cart = {};
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log('order successfully placed');
        location.reload();
      });
    }
  });
}

$(document).ready(function() {
  if (sessionStorage.reloadAfterPageLoad === 'true') {
    alert("Your order has been placed");
    sessionStorage.reloadAfterPageLoad = false;
  }

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
    deleteDish(cart);

    placeOrderButton(cart);
  });
});
