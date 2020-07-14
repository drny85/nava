import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import AppButton from "../components/AppButton";
import cartContext from "../context/cart/cartContext";
import colors from "../config/colors";
import CartItemTile from "../components/CartItemTile";
import Loader from "../components/Loader";

const Cart = ({ navigation }) => {
	const { clearCart, cartItems, getCartItems, loading, addToCart, cartTotal } = useContext(
		cartContext
	);

	useEffect(() => {
		getCartItems();
	}, []);

	// if (loading) return <Loader />;

	return (
		<View style={styles.container}>
			<FlatList
				style={{ flex: 1, marginTop: 10 }}
				data={cartItems}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<CartItemTile
               onRemove={() => {}}
               onAddMore={() =>addToCart(item)}
						item={item}
						onLongPress={() => navigation.navigate("ProductDetail", { item })}
					/>
				)}
			/>
         <View style={styles.cartTotalView}><Text style={styles.text}>Cart Total: ${cartTotal}</Text></View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	btn: {
		backgroundColor: colors.primary,
   },
   
   cartTotalView: {
      height: 60,
      width: '100%',
      backgroundColor: 'beige',
      justifyContent: 'center',
      alignItems: 'center',
   }

   ,
   text: {
      fontSize: 28,
      fontWeight: 'bold'

   }
});

export default Cart;
