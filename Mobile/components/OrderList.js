import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { getOrders, BASE_URL } from "../utils/api";

// Функция для обновления статуса заказа на сервере
const updateOrder = async (token, orderId, status) => {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.msg || "Ошибка обновления заказа");
  }
  return await res.json();
};

// Функция для конвертации русских статусов в серверные enum
const mapStatusToEnum = (status) => {
  switch (status) {
    case "В пути":
      return "delivering";
    case "Доставлено":
      return "delivered";
    default:
      return "pending";
  }
};

export default function OrderList({ token, navigation }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);

      // 🔥 фильтруем доставленные заказы (и на русском, и на английском)
      const activeOrders = data.filter(
        (order) => order.status !== "delivered" && order.status !== "Доставлено"
      );

      const ordersWithAnim = activeOrders.map((order) => ({
        ...order,
        animValue: new Animated.Value(0),
        statusColor: "#fff",
      }));
      setOrders(ordersWithAnim);
    } catch (err) {
      Alert.alert("Ошибка", err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Конвертируем статус для сервера
      const serverStatus = mapStatusToEnum(newStatus);

      // Обновляем на сервере
      await updateOrder(token, orderId, serverStatus);

      // Обновляем локальный стейт с анимацией
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            let toColor = "#fff";
            if (serverStatus === "delivering") toColor = "#FFD700";
            if (serverStatus === "delivered") toColor = "#32CD32";

            Animated.timing(order.animValue, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }).start(() => {
              if (serverStatus === "delivered") {
                Animated.timing(order.animValue, {
                  toValue: 0,
                  duration: 500,
                  useNativeDriver: false,
                }).start(() => {
                  setOrders((prev) => prev.filter((o) => o._id !== orderId));
                });
              }
            });

            return { ...order, status: newStatus, statusColor: toColor };
          }
          return order;
        })
      );
    } catch (err) {
      Alert.alert("Ошибка обновления заказа", err.message);
    }
  };

  const openMap = async (order) => {
    if (order.coordinates && order.coordinates.lat && order.coordinates.lng) {
      navigation.navigate("MapViewScreen", { order });
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          order.address
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        navigation.navigate("MapViewScreen", {
          order: { ...order, coordinates: { lat, lng } },
        });
      } else {
        Alert.alert("Ошибка", "Не удалось определить координаты по адресу");
      }
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось получить координаты");
    }
  };

  const renderOrder = ({ item }) => {
    const bgColor = item.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#fff", item.statusColor],
    });

    return (
      <Animated.View style={[styles.orderItem, { backgroundColor: bgColor }]}>
        <Text style={styles.orderText}>Адрес: {item.address}</Text>
        <Text style={styles.orderText}>Статус: {item.status}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.buttonMap}
            onPress={() => openMap(item)}
          >
            <Text style={styles.buttonText}>Карта</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonInWay}
            onPress={() => updateOrderStatus(item._id, "В пути")}
          >
            <Text style={styles.buttonText}>В пути</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonDelivered}
            onPress={() => updateOrderStatus(item._id, "Доставлено")}
          >
            <Text style={styles.buttonText}>Доставлено</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список заказов</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        ListEmptyComponent={<Text>Заказы отсутствуют</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f2f2f2" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  orderItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  orderText: { fontSize: 16, marginBottom: 5 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonMap: { backgroundColor: "#1E90FF", padding: 8, borderRadius: 5 },
  buttonInWay: { backgroundColor: "#FFD700", padding: 8, borderRadius: 5 },
  buttonDelivered: { backgroundColor: "#32CD32", padding: 8, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
