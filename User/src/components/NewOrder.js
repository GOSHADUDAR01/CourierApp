import React, { useState } from "react";
import axios from "axios";

export default function NewOrder() {
  const [address, setAddress] = useState("");
  const [items, setItems] = useState("");
  const [courier, setCourier] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/orders", {
        address,
        items: items.split(",").map(i => i.trim()),
        courier
      });
      alert("Заказ создан!");
      setAddress("");
      setItems("");
      setCourier("");
    } catch (err) {
      alert("Ошибка при создании заказа");
    }
  };

  return (
    <div>
      <h2>Создать заказ</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Адрес: </label>
          <input value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <div>
          <label>Товары (через запятую): </label>
          <input value={items} onChange={e => setItems(e.target.value)} required />
        </div>
        <div>
          <label>Курьер (email): </label>
          <input value={courier} onChange={e => setCourier(e.target.value)} />
        </div>
        <button type="submit">Создать</button>
      </form>
    </div>
  );
}
