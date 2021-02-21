class Order {
	constructor(
		userId,
		items = [],
		customer,
		type,
		totalAmount,
		paymentMethod,
		status = 'new',
		instruction,
		restaurant,
		isPaid = false

	) {
		(this.userId = userId),
			(this.items = items),
			(this.customer = customer),
			(this.type = type),
			(this.totalAmount = totalAmount),
			(this.paymentMethod = paymentMethod),
			(this.status = status),
			(this.instruction = instruction),
			(this.restaurant = restaurant),
			(this.isPaid = isPaid)

	}

}

export default Order;
