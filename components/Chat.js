import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Dialogflow_V2 } from "react-native-dialogflow";
import { dialogflowConfig } from "./../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTrashAlt,
  faCircle,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

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

//created ChatBot
const ChatBot = {
  uid: 1,
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
      loginText: "Loading..",
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
    };

    //if no firebase
    if (!firebase.apps.length) {
      //initialize
      firebase.initializeApp(firebaseConfig);
    }
    //reference to the messages collection
    this.referenceMessages = firebase.firestore().collection("messages");
    this.referenceUsers = null;
  }

  //loads messages from asyncStorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  addMessages() {
    const message = this.state.messages[0];
    //added new message to firebase
    this.referenceMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  //save messages to asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  //delete messages from asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //warn user that messages will be deleted from AsyncStorage
  deleteAlert = () =>
    Alert.alert(
      "Are you sure to delete messages from your device?",
      "They will be available again after connecting to the internet.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => this.deleteMessages() },
      ]
    );

  componentDidMount() {
    //inputted name from Start screen
    let name = this.props.route.params.name;

    this.props.navigation.setOptions({
      //display the name in header as screen title in Chat
      title: name,
      //added trash icon to header
      headerRight: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.deleteAlert();
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} style={styles.delete} />
          </TouchableOpacity>
          {/*added dot */}
          <View>
            {this.state.isConnected ? (
              //green if online
              <FontAwesomeIcon
                icon={faCircle}
                style={[styles.onlineOffline, { color: "#090" }]}
                size={10}
              />
            ) : (
              //red if offline
              <FontAwesomeIcon
                icon={faCircle}
                style={[styles.onlineOffline, { color: "#900" }]}
                size={10}
              />
            )}
          </View>
        </View>
      ),
    });

    this.setState({
      isTyping: false,
    });

    //config dialogflow
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );

    //check network connection
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");

        //listen to authentication event
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
              avatar: "https://placeimg.com/140/140/any",
            },
          });

          //add messages to user
          this.referenceMessagesUsers = firebase
            .firestore()
            .collection("messages")
            .where("uid", "==", this.state.uid);

          this.unsubscribe = this.referenceMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log("offline");
        this.setState({ isConnected: false });

        //loads messages from asyncStorage
        this.getMessages();
      }
    });

    //after 2s the 'loading..' text changes to 'Online!'
    setTimeout(() => {
      this.setState({ loginText: "Online!" });
    }, 2000);
    //+2s the text disappears
    setTimeout(() => {
      this.setState({ loginText: "" });
    }, 4000);
  }

  componentWillUnmount() {
    //stop listening to authentication
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
          avatar: data.user.avatar,
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
        timeTextStyle={{
          right: { color: "#787878" },
        }}
      />
    );
  }

  //customize send button
  renderSend = (props) => {
    return (
      <TouchableOpacity
        {...props}
        style={styles.sendBtn}
        onPress={() => props.onSend({ text: props.text }, true)}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          size={30}
          style={{
            color: "#000",
            borderRadius: 15,
            transform: [{ rotate: "28deg" }],
          }}
        />
      </TouchableOpacity>
    );
  };

  //Do not render inputToolbar when offline
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  //typing indicator --not working yet
  setIsTyping = () => {
    this.setState({
      isTyping: !this.state.isTyping,
    });
  };

  handleGoogleResponse(result) {
    //don't need the whole data just the text
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  //added user, createdAt and id to the Dialogbox response
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
        this.saveMessages();
      }
    );

    // let message = messages[0].text;

    // Dialogflow_V2.requestQuery(
    //   message,
    //   (result) => this.handleGoogleResponse(result),
    //   (error) => console.log(error)
    //   //possible unhandled promise rejection on real ios device (iphone8)
    // );
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

  render() {
    return (
      <View style={styles.chatContainer}>
        {/*hide login text after 2+2 seconds*/}
        <Text style={styles.online}>{this.state.loginText}</Text>

        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          renderUsernameOnMessage={true}
          isTyping={this.state.isTyping}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          user={this.state.user}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderSend={this.renderSend}
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
    textAlign: "center",
    color: "#555",
  },
  delete: {
    marginRight: 20,
    marginBottom: 5,
    color: "#aaa",
    padding: 10,
  },
  onlineOffline: {
    position: "absolute",
    top: -20,
    right: 60,
  },
  sendBtn: {
    marginRight: 20,
    marginBottom: 10,
  },
});
