// @ts-nocheck
import CarItem from "./CartItem";

class ShoppingCart {
	constructor(items = [], total = 0, quantity = 0) {
		this.items = items;
		this.total = total;
		this.quantity = quantity;
	}

	addToCart(item) {
		const found = this.items.find((i) => {
			console.log(i.id);
			return i.id === item.id;
		});
		if (found) {
			console.log("found");
		} else {
			console.log("not found");
			const newItem = new CarItem(item, +item.price, 1);
			this.items.push(newItem);
			this.quantity = 1;
			this.total = newItem.price;
		}
	}
}

export default ShoppingCart;
