import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { login } from "../utils/api";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Ошибка", "Введите email и пароль");
      return;
    }

    try {
      const data = await login(email, password);
      setToken(data.token); // установка токена для App.js
      Alert.alert("Успех", `Привет, ${data.user.email}!`);
      // navigation.replace не нужен — экран Orders появится автоматически
    } catch (err) {
      Alert.alert("Ошибка", err.message || "Неверный логин или пароль");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Вход курьера</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Войти" onPress={handleLogin} color="#007AFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff"
  },
  form: {
    width: "90%", 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 10, 
    elevation: 5
  },
  title: {
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#007AFF"
  },
  input: {
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 8, 
    color: "#000"
  },
  buttonContainer: {
    marginTop: 10
  }
});
