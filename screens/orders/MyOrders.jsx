// @ts-nocheck
import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import ordersContext from "../../context/order/orderContext";
import Loader from "../../components/Loader";
import OrderTile from "../../components/OrderTile";
import AppButton from "../../components/AppButton";

const MyOrders = ({ navigation }) => {
  const { user } = useContext(authContext);
  const { orders, getOrders, loading, Unsubscribe } = useContext(ordersContext);

  const goToOrderDetails = (order) => {
    navigation.navigate("OrderDetails", { order });
  };

  useEffect(() => {
    console.log("getting orders");
    getOrders(user.id);

    return () => {
      console.log("Unsubscribe from My Orders");
      Unsubscribe();
    };
  }, []);

  if (loading) {
    console.log("from MyOrders", loading);
    <Loader />;
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>No Orders Found</Text>
        <AppButton
          style={{ width: "90%" }}
          title="Place My First Order"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    );
  }

  return (
    <Screen style={styles.container}>
      <View style={{ marginTop: 5 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <OrderTile
              onPress={() => goToOrderDetails(item)}
              index={index + 1}
              order={item}
            />
          )}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyOrders;
