import React from "react";

//for navigation 
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../.expo/navigation/type";

import { Login } from "@/components/Loginpage";
import { Signup } from "@/components/SignupPage";

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  return(
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{title : "Login"}}/>
        <Stack.Screen name="Signup" component={Signup} options={{title : "Signup"}}/>
      </Stack.Navigator>
  );
}
