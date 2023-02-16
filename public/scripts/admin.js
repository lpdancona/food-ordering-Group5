const createOrderElement = function (order) {
  const $order = $(`
    <tr class="order" data-id="${order.id}">
      <td class="order-number" data-title="Order">
        <p>#${order.id}</p>
      </td>

      <td class="order-dishes" data-title="Dishes">
      </td>

      <td class="order-total" data-title="Total">
        <span class="amount">${order.total}</span>
      </td>

      <td class="order-actions" data-title="Action">
        <div id="time">
          <label for="appt">Select a time:</label>
          <input type="time" id="appt" name="appt" />
        </div>
      </td>

      <td class="order-button" data-title="Button">
        <button class="button" type="submit">Confirm</button>
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

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/orders",
  }).done((response) => {
    renderOrders(response.orders);
    console.log(response.orders);
  });
});
