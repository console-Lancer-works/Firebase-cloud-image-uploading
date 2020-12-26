import React, { useEffect, useState } from "react";
import firebase from "../firebase";

export default function ImageUploading() {
  const [files, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const handlechange = (files) => {
    setFile(files);
  };

  const handlesave = () => {
    let bucketname = "images";
    let file = files[0];
    let storageRef = firebase.storage().ref(`${bucketname}/${file.name}`);
    let uploadTask = storageRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
      let downloadUrl = uploadTask.snapshot.downloadUrl;
    });
    showImage(file.name);
  };
  const showImage = (name) => {
    let storageRef = firebase.storage().ref();
    let spaceRef = storageRef.child("images/" + files[0].name);
    storageRef
      .child("images/" + files[0].name)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        fetch("http://localhost:4000/image/saveimage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            image: url,
            name: name,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("http://localhost:4000/image/allimages", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setImages(data.data);
        console.log(images);
      })
      .catch((err) => console.log(err));
  }, []);
  const deleteimage = (id, name) => {
    fetch("http://localhost:4000/image/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = images.filter((item) => {
          return item._id !== result._id;
        });
        deleteim(name);
        setImages(newData);
        // setImages(result);
      })
      .catch((err) => console.log(err));
  };

  const deleteim = (name) => {
    let storagePath = firebase.storage().ref();

    storagePath.child("images/" + name).delete();
  };
  return (
    <>
      <div>
        <input
          type="file"
          onChange={(e) => handlechange(e.target.files)}
        ></input>
        <button onClick={handlesave}>upload</button>
        {images.map((i) => {
          return (
            <>
              <img src={i.image} />
              <button onClick={() => deleteimage(i._id, i.name)}>delete</button>
            </>
          );
        })}
      </div>
    </>
  );
}
// export default ImageUploading;
