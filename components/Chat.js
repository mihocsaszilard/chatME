import React, { Component } from "react";
import {
  View,
  Text,
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
  constructor(props) {
    super(props);
    this.state = {
      isTyping: false,
      messages: [],
      uid: 0,
      loginText: "Logging in...",
      user: {
        _id: "",
        name: "",
      },
    };

    //if no firebase
    if (!firebase.apps.length) {
      //initialize
      firebase.initializeApp(firebaseConfig);
    }
    //reference to the chatME collection
    this.referenceMessages = firebase.firestore().collection("messages");
    this.referenceUsers = null;
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //update user data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
        loginText: (
          <Text style={[styles.online, { color: "green" }]}>Online! </Text>
        ),
      });

      this.referenceMessagesUsers = firebase
        .firestore()
        .collection("messages")
        .where("uid", "==", this.state.uid);

      if (this.referenceMessagesUsers) {
        this.unsubscribe = this.referenceMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
      } else {
        (error) => console.log(error);
      }
    });

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

    // this.referenceMessages = firebase.firestore().collection("messages");
    // if (this.referenceMessages) {
    //   this.unsubscribe = this.referenceMessages.onSnapshot(
    //     this.onCollectionUpdate
    //   );
    // } else {
    //   (error) => console.log(error);
    // }
  }

  componentWillUnmount() {
    this.authUnsubscribe();
  }

  onCollectionUpdate = (QuerySnapshot) => {
    const messages = [];
    //go through each document
    QuerySnapshot.forEach((doc) => {
      //get the queryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
    this.setState({
      messages,
      // : messages.sort((a, b) => Date.parse(b._id) - Date.parse(a._id)),
    });
  };

  //changing the text bubble color
  renderBubble(props) {
    let bgColor = this.props.route.params.bgColor; //choosed color in start view
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          //user's chat bubble color
          right: {
            backgroundColor: bgColor,
          },
          //chat partner's bubble color
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
      uid: this.state.uid,
      _id: this.state.messages.length + 1,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  hideOnline() {
    return <Text style={styles.online}>{this.state.loginText}</Text>;
  }

  render() {
    return (
      <View style={styles.chatContainer}>
        <Text>{this.hideOnline()}</Text>
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
  online: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#222",
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    color: "white",
    zIndex: 10,
  },
});
