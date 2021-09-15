import React, { Component } from "react";
import {
  View,
  Button,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Dialogflow_V2 } from "react-native-dialogflow";

import { dialogflowConfig } from "./../env";

const ChatBot = {
  _id: 2,
  name: "ChatBot",
  avatar: "https://placeimg.com/140/140/any",
};

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    //inputted name from Start screen
    let name = this.props.route.params.name;
    //display the name in header as screen title in Chat
    this.props.navigation.setOptions({ title: name });
    this.setState({
      //mock-data
      messages: [
        {
          _id: 4,
          text: "Hello!",
          createdAt: new Date(),
          user: {
            _id: 1,
            name: name,
          },
        },
        {
          _id: 3,
          text: name + " has joined the chat!",
          createdAt: new Date(),
          system: true,
        },
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "ChatBot",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 0,
          text: "ChatBot has joined the chat!",
          createdAt: new Date(),
          system: true,
        },
      ],
    });

    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
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

  hadleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: ChatBot,
    };

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  //add new messages to 'message' array
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.hadleGoogleResponse(result),
      (error) => console.log(error)
      //possible unhandled promise rejection on real ios device (iphone8)
    );
  }

  onQuickReply(quickReply) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, quickReply),
    }));

    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.hadleGoogleResponse(result),
      (error) => console.log(error)
    );
  }

  render() {
    return (
      <View style={styles.chatContainer}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
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
