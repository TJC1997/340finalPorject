import React, { useEffect, useState } from "react";

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import reactDom from "react-dom";

import "./App.css";

function UpdateForm(props) {
  const key = Object.keys(props.songs_data)[props.currentID].toString();
  const currentName = props.songs_data[key].songName;
  const currentCity = props.songs_data[key].artist_name;

  const [nameInput, setNameInput] = useState("");
  const [cityInput, setCityInput] = useState("");

  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");

  // useEffect(() => {
  //   let copy = JSON.parse(JSON.stringify(props.songs_data));
  //   if (newName != "") {
  //     copy[key].songName = newName;
  //   }

  //   props.setsongs_data(copy);
  // }, [newName, newCity]);

  function updateNewName(e) {
    e.preventDefault();
    if (nameInput != "") {
      console.log(nameInput);
      setNewName(nameInput);
    }
    if (cityInput != "") {
      console.log(cityInput);
      setNewCity(cityInput);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="artist-update-form">
        <Form.Group>
          <h4>Update {props.type} Name</h4>
          <h5>The current Song Name is {currentName}</h5>
          <Form.Control
            placeholder="Enter New Song Name"
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
        </Form.Group>

        <Button
          variant="success"
          type="submit"
          onClick={(e) => updateNewName(e)}
        >
          Submit
        </Button>

        <Button
          variant="secondary"
          type="cancel"
          onClick={(e) => {
            e.preventDefault();
            props.setmodelIsOpen(false);
          }}
        >
          cancel
        </Button>
      </Form>
    </div>,
    document.getElementById("portal")
  );
}

function UpdateModal(props) {
  const [modelIsOpen, setmodelIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setmodelIsOpen(true)}
        type="button"
        className="btn btn-primary"
      >
        Update
      </button>
      <Modal isOpen={modelIsOpen} className="update-modal" ariaHideApp={false}>
        <UpdateForm
          songs_data={props.songs_data}
          setsongs_data={props.setsongs_data}
          type={props.type}
          currentID={props.currentID}
          setmodelIsOpen={setmodelIsOpen}
        />
      </Modal>
    </div>
  );
}

function DeleteForm(props) {
  const key = Object.keys(props.songs_data)[props.currentID].toString();
  const currentName = props.songs_data[key].songName;
  const [deleteElement, setdeleteElement] = useState(false);

  // useEffect(() => {
  //   if (deleteElement == true) {
  //     console.log("deleting--", currentName);
  //     let copy = JSON.parse(JSON.stringify(props.songs_data));
  //     delete copy[key];
  //     props.setsongs_data(copy);
  //   }
  // }, [deleteElement]);

  function deleteName(e) {
    e.preventDefault();
    setdeleteElement(true);
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="update-form">
        <Form.Group>
          <h4>Delete {props.type} Name</h4>
          <h5>The current song is {currentName}</h5>
          <h5>Are you sure to delete it?</h5>
        </Form.Group>

        <Button variant="success" type="submit" onClick={(e) => deleteName(e)}>
          YES
        </Button>

        <Button
          variant="secondary"
          type="cancel"
          onClick={(e) => {
            e.preventDefault();
            props.setmodelIsOpen(false);
          }}
        >
          NO
        </Button>
      </Form>
    </div>,
    document.getElementById("portal")
  );
}

function DeleteModal(props) {
  const [modelIsOpen, setmodelIsOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setmodelIsOpen(true)}
        type="button"
        className="btn btn-danger"
      >
        Delete
      </Button>
      <Modal isOpen={modelIsOpen} className="Delete-modal" ariaHideApp={false}>
        <DeleteForm
          songs_data={props.songs_data}
          setsongs_data={props.setsongs_data}
          type={props.type}
          currentID={props.currentID}
          setmodelIsOpen={setmodelIsOpen}
        />
      </Modal>
    </div>
  );
}

function AddForm(props) {
  const [nameInput, setNameInput] = useState("");

  const [newName, setNewName] = useState("");

  // useEffect(() => {
  //   if (newName != "") {
  //     let copy = JSON.parse(JSON.stringify(props.songs_data));

  //     copy[newName] = {
  //       songName: newName,
  //       artist_name: "NULL",
  //       album_name: "NULL",
  //       genre_name: "NULL",
  //     };
  //     props.setsongs_data(copy);
  //   }
  // });

  function updateNewName(e) {
    e.preventDefault();
    if (nameInput != "") {
      console.log(nameInput);
      setNewName(nameInput);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="artist-update-form">
        <Form.Group>
          <h4>Add New {props.type} Name</h4>
          <Form.Control
            placeholder="Add New Song Name"
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
        </Form.Group>

        <Button
          variant="success"
          type="submit"
          onClick={(e) => updateNewName(e)}
        >
          Submit
        </Button>

        <Button
          variant="secondary"
          type="cancel"
          onClick={(e) => {
            e.preventDefault();
            props.setmodelIsOpen(false);
          }}
        >
          cancel
        </Button>
      </Form>
    </div>,
    document.getElementById("portal")
  );
}

function AddModal(props) {
  const [modelIsOpen, setmodelIsOpen] = useState(false);

  return (
    <div>
      <Button
        type="button"
        className="btn btn-info"
        onClick={() => setmodelIsOpen(true)}
      >
        Add a new song
      </Button>
      <Modal isOpen={modelIsOpen} className="update-modal" ariaHideApp={false}>
        <AddForm
          type="Song"
          songs_data={props.songs_data}
          setsongs_data={props.setsongs_data}
          setmodelIsOpen={setmodelIsOpen}
        />
      </Modal>
    </div>
  );
}

function SongsPage(props) {
  const [songs_data, setsongs_data] = useState([]);

  useEffect(async () => {
    async function featchSearchResults() {
      let jsBody = {};
      try {
        let link = "http://flip2.engr.oregonstate.edu:2341/songs";
        const res = await fetch(link);
        jsBody = await res.json();
        console.log(link);
      } catch (e) {
        if (e instanceof DOMException) {
          console.log("HTTP request abort");
        } else {
          console.log("error");
          console.log(e);
          // throw e;
        }
      }
      setsongs_data(jsBody);
    }
    featchSearchResults();
  }, []);

  return (
    <div className="main-page">
      <h1>Music Songs Page</h1>
      <ul className="list-group">
        <div className="list-column">
          <h4>Song Name</h4>
          {Object.keys(songs_data).map((item, i) => (
            <li className="list-group-item" key={i}>
              {songs_data[item].songName}
            </li>
          ))}
        </div>

        <div className="list-column">
          <h4>Update Song</h4>
          {Object.keys(songs_data).map((item, i) => (
            <UpdateModal
              type="Song"
              currentID={i}
              key={i}
              songs_data={songs_data}
              setsongs_data={setsongs_data}
            />
          ))}
        </div>

        <div className="list-column">
          <h4>Delete Song</h4>
          {Object.keys(songs_data).map((item, i) => (
            <DeleteModal
              type="Song"
              currentID={i}
              key={i}
              songs_data={songs_data}
              setsongs_data={setsongs_data}
            />
          ))}
        </div>

        <AddModal
          type="Song"
          songs_data={songs_data}
          setsongs_data={setsongs_data}
        />
      </ul>
    </div>
  );
}

export default SongsPage;