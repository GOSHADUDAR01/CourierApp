import React, { useState } from "react";
// import { loginAdmin } from '../utils/api'; // больше не нужен


export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAdmin(email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Вход в админку</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Войти</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f7fa"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px"
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px"
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007AFF",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginBottom: "10px"
  }
};

