import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../components/Login";
import OrderList from "../components/OrderList";
import MapViewScreen from "../components/MapViewScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Orders" component={OrderList} />
      <Stack.Screen name="Map" component={MapViewScreen} />
    </Stack.Navigator>
  );
}
