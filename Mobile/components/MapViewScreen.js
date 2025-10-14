import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapViewScreen({ route, navigation }) {
  const { order } = route.params;
  const [coords, setCoords] = useState(order.coordinates || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Если координаты уже есть, ничего не делаем
    if (coords && coords.lat && coords.lng) return;

    // Иначе пытаемся геокодировать адрес
    const fetchCoordinates = async () => {
      setLoading(true);
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
          setCoords({ lat, lng });
        }
      } catch (err) {
        Alert.alert("Ошибка", "Не удалось определить координаты");
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, []);

  // Если координаты нет и не удалось получить
  if ((!coords || !coords.lat) && !loading) {
    return (
      <View style={styles.container}>
        <Text>Для этого заказа нет координат</Text>
        <Button title="Закрыть" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // Пока координаты загружаются
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка координат...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: coords.lat, longitude: coords.lng }}
          title="Точка доставки"
          description={order.address}
        />
      </MapView>
      <Button title="Закрыть" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { flex: 1 },
});
