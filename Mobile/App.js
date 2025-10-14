import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./components/Login";
import OrderList from "./components/OrderList";
import MapViewScreen from "./components/MapViewScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: "#f5f5f5" } // светлый фон по умолчанию
        }}
      >
        {!token ? (
          <Stack.Screen name="Login">
            {props => <Login {...props} setToken={setToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Orders" options={{ title: "Список заказов" }}>
              {props => <OrderList {...props} token={token} />}
            </Stack.Screen>
            <Stack.Screen
              name="MapViewScreen"
              component={MapViewScreen}
              options={{ title: "Карта заказа" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}



