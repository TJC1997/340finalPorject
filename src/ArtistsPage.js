import React, { useEffect, useState } from "react";

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import reactDom from "react-dom";

import "./App.css";

let track = 0;

function UpdateForm(props) {
  const key = Object.keys(props.artists_data)[props.currentID].toString();
  const currentName = props.artists_data[key].singerName;
  const currentCity = props.artists_data[key].homeCity;
  const currentState = props.artists_data[key].homeState;
  const currentId = props.artists_data[key].singerID;

  const [nameInput, setNameInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [newName, setNewName] = useState(currentName);
  const [newCity, setNewCity] = useState(currentCity);
  const [newState, setNewState] = useState(currentState);

  useEffect(async () => {
    async function updateData() {
      try {
        let link =
          "http://flip2.engr.oregonstate.edu:2341/singers/update/" +
          currentId +
          "&" +
          newName +
          "&" +
          newCity +
          "&" +
          newState;
        const res = await fetch(link);
        console.log(link);
        props.setupdate_data(++track);
      } catch (e) {
        if (e instanceof DOMException) {
          console.log("HTTP request abort");
        } else {
          console.log("error");
          console.log(e);
        }
      }
    }
    updateData();
  }, [newName, newCity, newState]);

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
    if (stateInput != "") {
      console.log(stateInput);
      setNewState(stateInput);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="artist-update-form">
        <Form.Group>
          <h4>Update {props.type} Name</h4>
          <h5>The current Artist Name is {currentName}</h5>
          <h5>The current Home City is {currentCity}</h5>
          <h5>The current Home State is {currentState}</h5>
          <Form.Control
            placeholder="Enter New Artist Name"
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
          <Form.Control
            placeholder="Enter New Home City"
            onChange={(e) => {
              setCityInput(e.target.value);
            }}
          />
          <Form.Control
            placeholder="Enter New Home State"
            onChange={(e) => {
              setStateInput(e.target.value);
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
          artists_data={props.artists_data}
          setartists_data={props.setartists_data}
          type={props.type}
          currentID={props.currentID}
          setmodelIsOpen={setmodelIsOpen}
          setupdate_data={props.setupdate_data}
        />
      </Modal>
    </div>
  );
}

function DeleteForm(props) {
  const key = Object.keys(props.artists_data)[props.currentID].toString();
  const currentName = props.artists_data[key].singerName;
  const currentId = props.artists_data[key].singerID;
  const [deleteElement, setdeleteElement] = useState(false);

  useEffect(async () => {
    async function deleteData() {
      if (deleteElement == true) {
        console.log("deleting--", currentName, currentId);
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/singers/delete/" +
            currentId;
          const res = await fetch(link);
          props.setupdate_data(++track);

          console.log(link);
        } catch (e) {
          if (e instanceof DOMException) {
            console.log("HTTP request abort");
          } else {
            console.log("error");
            console.log(e);
          }
        }
      }
    }
    deleteData();
  }, [deleteElement]);

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
          <h5>The current Artist is {currentName}</h5>
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
          artists_data={props.artists_data}
          setartists_data={props.setartists_data}
          type={props.type}
          currentID={props.currentID}
          setmodelIsOpen={setmodelIsOpen}
          setupdate_data={props.setupdate_data}
        />
      </Modal>
    </div>
  );
}

function AddForm(props) {
  const [nameInput, setNameInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");

  useEffect(async () => {
    async function insertData() {
      if (newName != "" && newCity != "" && newState != "") {
        console.log("addding--", newName, newCity, newState);
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/singers/insert/" +
            newName +
            "&" +
            newCity +
            "&" +
            newState;
          const res = await fetch(link);
          console.log(link);
          props.setupdate_data(++track);
        } catch (e) {
          if (e instanceof DOMException) {
            console.log("HTTP request abort");
          } else {
            console.log("error");
            console.log(e);
          }
        }
      }
    }
    insertData();
  }, [newName, newCity, newState]);

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
    if (stateInput != "") {
      console.log(stateInput);
      setNewState(stateInput);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="artist-update-form">
        <Form.Group>
          <h4>Add New {props.type} Name</h4>
          <Form.Control
            placeholder="Add New Artist Name"
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
          <Form.Control
            placeholder="Add New Home City"
            onChange={(e) => {
              setCityInput(e.target.value);
            }}
          />
          <Form.Control
            placeholder="Add New Home State"
            onChange={(e) => {
              setStateInput(e.target.value);
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
        Add a new Artist
      </Button>
      <Modal isOpen={modelIsOpen} className="update-modal" ariaHideApp={false}>
        <AddForm
          type="artist"
          artists_data={props.artists_data}
          setartists_data={props.setartists_data}
          setmodelIsOpen={setmodelIsOpen}
          setupdate_data={props.setupdate_data}
        />
      </Modal>
    </div>
  );
}

function ArtistsPage(props) {
  const [artists_data, setartists_data] = useState([]);
  const [update_data, setupdate_data] = useState(0);
  useEffect(async () => {
    async function featchSearchResults() {
      let jsBody = {};
      try {
        let link = "http://flip2.engr.oregonstate.edu:2341/singers";
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
      setartists_data(jsBody);
    }
    featchSearchResults();
  }, [update_data]);

  return (
    <div className="main-page">
      <h1>Music Artists Page</h1>
      <ul className="list-group">
        <div className="list-column">
          <h4>Artist Name</h4>
          {Object.keys(artists_data).map((item, i) => (
            <li className="list-group-item" key={i}>
              {artists_data[item].singerName}
            </li>
          ))}
        </div>
        <div className="list-column">
          <h4>Home City</h4>
          {Object.keys(artists_data).map((item, i) => (
            <li className="list-group-item" key={i}>
              {artists_data[item].homeCity}
            </li>
          ))}
        </div>
        <div className="list-column">
          <h4>Home State</h4>
          {Object.keys(artists_data).map((item, i) => (
            <li className="list-group-item" key={i}>
              {artists_data[item].homeState}
            </li>
          ))}
        </div>

        <div className="list-column">
          <h4>Update Artist</h4>
          {Object.keys(artists_data).map((item, i) => (
            <UpdateModal
              type="Artist"
              currentID={i}
              key={i}
              artists_data={artists_data}
              setartists_data={setartists_data}
              setupdate_data={setupdate_data}
            />
          ))}
        </div>

        <div className="list-column">
          <h4>Delete Artist</h4>
          {Object.keys(artists_data).map((item, i) => (
            <DeleteModal
              type="Artist"
              currentID={i}
              key={i}
              artists_data={artists_data}
              setartists_data={setartists_data}
              setupdate_data={setupdate_data}
            />
          ))}
        </div>

        <AddModal
          type="Artist"
          artists_data={artists_data}
          setartists_data={setartists_data}
          setupdate_data={setupdate_data}
        />
      </ul>
    </div>
  );
}

export default ArtistsPage;
