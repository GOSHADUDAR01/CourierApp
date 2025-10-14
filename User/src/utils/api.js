export const BASE_URL = "http://localhost:5000";

// Получение всех заказов
export const getAllOrders = async () => {
  const res = await fetch(`${BASE_URL}/api/orders`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Ошибка получения заказов");
  return data;
};

// Получение всех курьеров
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Ошибка получения курьеров");
  return data.filter(u => u.role === "courier");
};

// Создание заказа
export const createOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Ошибка создания заказа");
  return data;
};

