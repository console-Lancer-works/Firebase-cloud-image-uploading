import logo from "./logo.svg";
import "./App.css";
import firebase from "./firebase";
import React, { Component } from "react";
import Image from "./component/ImageUploading";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  handlechange = (files) => {
    this.setState({
      files: files,
    });
  };

  handlesave = () => {
    let bucketname = "images";
    let file = this.state.files[0];
    let storageRef = firebase.storage().ref(`${bucketname}/${file.name}`);
    let uploadTask = storageRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
      let downloadUrl = uploadTask.snapshot.downloadUrl;
      console.log(downloadUrl);
    });
  };
  showImage = () => {
    let storageRef = firebase.storage().ref();
    let spaceRef = storageRef.child("images/" + this.state.files[0].name);
    storageRef
      .child("images/" + this.state.files[0].name)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
      });
  };
  render() {
    return (
      <Image></Image>
      // <div>
      //   <input
      //     type="file"
      //     onChange={(e) => this.handlechange(e.target.files)}
      //   ></input>
      //   <button onClick={this.handlesave}>Save</button>
      //   <button onClick={this.showImage}>Show image</button>
      //   <img id="new-img" />
      // </div>
    );
  }
}
