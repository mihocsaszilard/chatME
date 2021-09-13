import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Start from "./components/Start";
import Chat from "./components/Chat";
import "react-native-gesture-handler";

const Stack = createStackNavigator();
var width = Dimensions.get("window").width;
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{
            headerTransparent: true,
            headerTintColor: "#555",
          }}
        >
          <Stack.Screen
            name="Start"
            component={Start}
            options={{
              headerTitleStyle: {
                color: "white",
              },
            }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              headerTitleStyle: {
                color: "#aaa",
                borderBottomColor: "#555",
                borderBottomWidth: 1,
                width: width / 1.48,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
