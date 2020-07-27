class Order {
  constructor(items = [], customer, type, total, placedOn) {
    (this.items = items),
      (this.customer = customer),
      (this.type = type),
      (this.total = total),
      (this.placedOn = placedOn);
  }
}

export default Order;
