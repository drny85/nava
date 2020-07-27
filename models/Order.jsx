class Order {
  constructor(
    items = [],
    customer,
    type,
    totalAmount,
    paymentMethod,
    status = "new"
  ) {
    (this.items = items),
      (this.customer = customer),
      (this.type = type),
      (this.totalAmount = totalAmount),
      (this.paymentMethod = paymentMethod),
      (this.status = status);
  }
}

export default Order;
