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
import { QuerySnapshot } from "@firebase/firestore";

const firebase = require("firebase");
require("firebase/firestore");
//cpnfigure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqcDCs-wSluDnUiPVyxf5uc_9QHg7kBxU",
  authDomain: "chat-app-4ae7f.firebaseapp.com",
  projectId: "chat-app-4ae7f",
  storageBucket: "chat-app-4ae7f.appspot.com",
  messagingSenderId: "706220138883",
  appId: "1:706220138883:web:46b85201b3680c6a9756b6",
};

const ChatBot = {
  _id: 2,
  name: "ChatBot",
  avatar: "https://placeimg.com/140/140/any",
};

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      isTyping: false,
      messages: [],
    };

    //if no firebase
    if (!firebase.apps.length) {
      //initialize
      firebase.initializeApp(firebaseConfig);
    }
    //reference to the chatME collection
    this.referenceMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    //inputted name from Start screen
    let name = this.props.route.params.name;
    //display the name in header as screen title in Chat
    this.props.navigation.setOptions({ title: name });
    this.setState({
      isTyping: false,
    });

    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );

    this.referenceMessages = firebase.firestore().collection("messages");
    if (this.referenceMessages) {
      this.unsubscribe = this.referenceMessages.onSnapshot(
        this.onCollectionUpdate
      );
    } else {
      (error) => console.log(error);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (QuerySnapshot) => {
    const messages = [];
    //go through each document
    QuerySnapshot.forEach((doc) => {
      //get the queryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages: messages.sort((a, b) => Date.parse(b._id) - Date.parse(a._id)),
    });
  };

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

  setIsTyping = () => {
    this.setState({
      isTyping: !this.state.isTyping,
    });
  };

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 2,
      text,
      createdAt: new Date(),
      user: ChatBot,
    };
    this.referenceMessages.add(msg);
  }

  //add new messages to 'message' array
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
      }
    );

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error)
      //possible unhandled promise rejection on real ios device (iphone8)
    );
  }

  // onQuickReply(quickReply) {
  //   this.setState((previousState) => ({
  //     messages: GiftedChat.append(previousState.messages, quickReply),
  //   }));

  //   let message = quickReply[0].value;

  //   Dialogflow_V2.requestQuery(
  //     message,
  //     (result) => this.handleGoogleResponse(result),
  //     (error) => console.log(error)
  //   );
  // }

  addMessages(message) {
    message = this.state.messages[0];
    this.referenceMessages.add({
      _id: this.state.messages.length + 1,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  render() {
    return (
      <View style={styles.chatContainer}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          renderUsernameOnMessage={true}
          isTyping={this.state.isTyping}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          user={{
            _id: 1,
            name: this.props.route.params.name,
            avatar: "https://placeimg.com/140/140/any",
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
