import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Список заказов</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Адрес</th>
            <th>Товары</th>
            <th>Курьер</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.address}</td>
              <td>{o.items.join(", ")}</td>
              <td>{o.courier || "-"}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
