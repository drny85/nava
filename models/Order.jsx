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
		isPaid = false,
		coupon,
		serviceFee = null

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
			(this.isPaid = isPaid),
			(this.coupon = coupon),
			(this.serviceFee = serviceFee)

	}

}

export default Order;
