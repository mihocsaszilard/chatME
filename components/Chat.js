import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

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
});
