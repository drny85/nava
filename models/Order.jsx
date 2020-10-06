class Order {
	constructor(
		userId,
		items = [],
		customer,
		type,
		totalAmount,
		paymentMethod,
		status,
		instruction,
		restaurant
	) {
		(this.userId = userId),
			(this.items = items),
			(this.customer = customer),
			(this.type = type),
			(this.totalAmount = totalAmount),
			(this.paymentMethod = paymentMethod),
			(this.status = status),
			(this.instruction = instruction),
			(this.restaurant = restaurant)
	}
}

export default Order;
