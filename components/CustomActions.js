import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";

export default class CustomActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      text: "",
      recording: null,
      location: null,
    };
  }

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        this.setState({
          image: result,
        });
      }
    }
  };

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY,
      Permissions.CAMERA
    );

    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync().catch((error) =>
        console.log(error)
      );

      if (!result.cancelled) {
        this.setState({
          image: result,
          text: "",
        });
      }
    }
  };

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === "granted") {
      let result = await Location.getCurrentPositionAsync({}).catch((error) =>
        console.log(error)
      );

      if (result) {
        this.setState({
          location: result,
        });
      }
    }
  };

  onActionPress = () => {
    const options = ["Choose Image", "Take Photo", "Location", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          //don't forget to replace with functions!!!
          case 0:
            console.log("image from galerry");
            return this.pickImage();
          case 1:
            console.log("camera");
            return this.takePhoto();
          case 2:
            console.log("position");
            return this.getLocation();
          default:
        }
      }
    );
  };

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.container} onPress={this.onActionPress}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    marginLeft: 5,
    marginBottom: 6,
  },
  wrapper: {
    borderRadius: 14,
    flex: 1,
  },
  iconText: {
    color: "#999",
    fontWeight: "bold",
    fontSize: 24,
    backgroundColor: "transparent",
    textAlign: "center",
  },
  separator: {
    flexDirection: "row",
    position: "absolute",
    height: 32,
    left: 40,
    width: 1,
    backgroundColor: "#ccc",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
