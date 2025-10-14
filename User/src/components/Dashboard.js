import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getAllOrders, getAllUsers, createOrder } from "../utils/api";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 });
  const [items, setItems] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // Получение заказов
  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      alert("Ошибка при загрузке заказов");
      console.error(err);
    }
  };

  // Получение курьеров
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      alert("Ошибка при загрузке курьеров");
      console.error(err);
    }
  };

  // Выбор точки на карте
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => setAddress(data.display_name || `${lat}, ${lng}`))
          .catch(() => setAddress(`${lat}, ${lng}`));
      },
    });
    return <Marker position={coordinates}></Marker>;
  }

  // Создание заказа
  const submitOrder = async () => {
    if (!address || !items || !selectedCourier) {
      alert("Заполните все поля!");
      return;
    }
    try {
      await createOrder({
        address,
        coordinates,
        items: items.split(",").map(i => i.trim()),
        courier: selectedCourier,
      });
      alert("Заказ создан!");
      setAddress("");
      setItems("");
      setSelectedCourier("");
      fetchOrders();
    } catch (err) {
      alert("Ошибка при создании заказа");
      console.error(err);
    }
  };

  const statusColors = {
    pending: "#f1c40f",
    assigned: "#3498db",
    delivering: "#e67e22",
    delivered: "#2ecc71",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#2c3e50" }}>Админка — Создание заказа</h2>

      <h3>Адрес</h3>
      <MapContainer center={coordinates} zoom={13} style={{ height: "300px", width: "100%", borderRadius: "12px", marginBottom: "10px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker />
      </MapContainer>
      <p><strong>Выбранный адрес:</strong> {address}</p>

      <h3>Список товаров (через запятую)</h3>
      <input
        type="text"
        value={items}
        onChange={e => setItems(e.target.value)}
        style={{ width: "300px", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
      />

      <h3>Выбор курьера</h3>
      <select
        value={selectedCourier}
        onChange={e => setSelectedCourier(e.target.value)}
        style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
      >
        <option value="">-- Выберите курьера --</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.email}</option>
        ))}
      </select>

      <br /><br />
      <button
        onClick={submitOrder}
        style={{ backgroundColor: "#3498db", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer" }}
      >
        Создать заказ
      </button>

      <h3 style={{ marginTop: "30px" }}>Список заказов</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {orders.map(o => (
          <li
            key={o._id}
            style={{
              background: "#ecf0f1",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "8px",
              borderLeft: `6px solid ${statusColors[o.status] || "#7f8c8d"}`
            }}
          >
            <div>
              <strong>Адрес:</strong> {o.address} <br />
              <strong>Курьер:</strong> {o.courier?.email || "Не назначен"} <br />
              <strong>Товары:</strong> {o.items.join(", ")} <br />
              <strong>Статус:</strong> {o.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

