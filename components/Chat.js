import React, { Component } from "react";
import { View, Text, TextInput, Button, Icon, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default class Chat extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let name = this.props.route.params.name;
    let bgColor = this.props.route.params.bgColor;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
        }}
      >
        <Text
          style={styles.back}
          onPress={() => {
            this.props.navigation.navigate("Start");
          }}
        >
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={40} color="black" />
          </TouchableOpacity>
        </Text>
        {
          // if the user doesn't type a name the welcome message changes
        }
        {name ? (
          <Text style={styles.welcomeText}>Hello, {name}!</Text>
        ) : (
          <Text style={styles.welcomeText}>You forgot to type your name!</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 16,
    color: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    textShadowColor: "#000",
  },
  back: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, .3)",
    borderRadius: 15,
  },
});
