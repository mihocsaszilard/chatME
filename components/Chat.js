import React, { Component } from "react";
import { View, Text, TextInput, Button } from "react-native";

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
        {name ? (
          <Text>Hello, {name}!</Text>
        ) : (
          <Text>You forgot to type your name!</Text>
        )}
      </View>
    );
  }
}
