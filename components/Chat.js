import React, { Component } from "react";
import {
  View,
  Button,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      //mock-data
      messages: [
        {
          _id: 4,
          text: "Hello!",
          createdAt: new Date(),
          user: {
            _id: 1,
            name: this.props.route.params.name,
          },
        },
        {
          _id: 3,
          text: this.props.route.params.name + " has joined the chat!",
          createdAt: new Date(),
          system: true,
        },
        {
          _id: 2,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 1,
          text: "ChatBot has joined the chat!",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  //changing the text bubble color
  renderBubble(props) {
    let bgColor = this.props.route.params.bgColor; //choosed color in start view
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          //user's color
          right: {
            backgroundColor: bgColor,
          },
          //chat partner's color
          left: {
            backgroundColor: "#555",
          },
        }}
      />
    );
  }

  //add new messages to 'message' array
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    //inputted name from Start screen
    let name = this.props.route.params.name;
    //display the name in header as screen title in Chat
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={styles.chatContainer}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* fix for older Android devices where the input field is hidden beneath the keyboard. */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: "#222",
  },
});
