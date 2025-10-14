export const BASE_URL = "https://d04e61395001.ngrok-free.app";

// ===== Логин курьера =====
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Ошибка логина");

  // Важно: сервер должен возвращать { token: "..." }
  return data;
};

// ===== Получение заказов =====
export const getOrders = async (token) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Ошибка получения заказов");
  return data;
};

// ===== Обновление статуса заказа =====
export const updateOrderStatus = async (token, orderId, status) => {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Ошибка обновления заказа");
  return data;
};
