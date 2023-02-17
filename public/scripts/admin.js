const createOrderElement = function (order) {
  let date = "";
  let time = "";
  let disabled = "";

  if (order.ready_by) {
    date = new Date(order.ready_by);
    time = `value="${date.toTimeString().slice(0, 5)}"`;
    // disabled = "disabled";
  }

  const $order = $(`
    <tr class="order" data-id="${order.id}">
      <td class="order-number" data-title="Order">
        <p>#${order.id}</p>
      </td>

      <td class="order-user" data-title="User">
        <p>${order.name}</p>
      </td>

      <td class="order-dishes" data-title="Dishes">
      </td>

      <td class="order-total" data-title="Total">
        <span class="amount">${order.total}</span>
      </td>

      <td class="order-actions" data-title="Action">
        <div id="time">
          <label for="appt">Select a time:</label>
          <input type="time" id="appt" name="appt" ${time}/>
        </div>
      </td>

      <td class="order-button" data-title="Button">
        <button class="button" type="submit" ${disabled}>Confirm</button>
      </td>
    </tr>
  `);

  return $order;
};

const createOrderDishElement = function (dish) {
  const $dish = $(`
    <p>${dish.name}: ${dish.quantity}</p>
  `);

  return $dish;
};

const renderOrders = function (orders) {
  orders.forEach((order) => {
    const $order = createOrderElement(order);
    $("tbody").prepend($order);

    $.ajax({
      method: "GET",
      url: `/api/orders/${order.id}`,
    }).done((response) => {
      renderOrderDishes(response.dishes, order.id);
      adminButtonListeners(order.id);
      console.log(response);
    });
  });
};

const renderOrderDishes = function (dishes, id) {
  dishes.forEach((dish) => {
    const $dish = createOrderDishElement(dish);
    $(`tr[data-id="${id}"]`).find("td.order-dishes").append($dish);
  });
};

const adminButtonListeners = function(id) {
  const $button = $(`tr[data-id="${id}"]`).find("button");

  $button.click(function() {
    const id = this.parentElement.parentElement.dataset.id;
    let time = new Date().toJSON().slice(0, 10);
    time += " " + this.parentElement.parentElement.querySelector("#appt").value;
    time += ":00 " + getTimeZone();

    $.ajax({
      method: 'POST',
      url: `/api/orders/${id}`,
      data: {id, time}
    })
    .done(response => {
      location.reload();
    });
  });
};

function getTimeZone() {
  const num = - (new Date().getTimezoneOffset()) / 60;

  return num.toString() + ":00";
};

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/orders",
  }).done((response) => {
    renderOrders(response.orders);
  });
});
