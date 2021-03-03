import React, { useEffect, useState } from "react";

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import reactDom from "react-dom";
import "./App.css";

function findElement(data, id) {
  let i;
  for (i = 0; i < data.length; i++) {
    console.log(data[i].genreID, id);
    if (data[i].genreID === id) {
      break;
    }
    ++i;
  }
  return i;
}

function UpdateForm(props) {
  const key = findElement(props.genres_data, props.currentID);
  const currentName = props.genres_data[key].genreName;
  console.log("key---", key);
  const [input, setInput] = useState("");
  const [newName, setNewName] = useState("");

  // useEffect(() => {
  //   if (newName != "") {
  //     console.log("updateing--", newName);
  //     let copy = JSON.parse(JSON.stringify(props.genres_data));
  //     copy[key].genreName = newName;
  //     props.setgenres_data(copy);
  //   }
  // }, [newName]);

  function updateNewName(e) {
    e.preventDefault();
    if (input != "") {
      console.log(input);
      setNewName(input);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="update-form">
        <Form.Group>
          <h4>Update {props.type} Name</h4>
          <h5>The current Genre Name is {currentName}</h5>
          <Form.Control
            placeholder="Enter New Name"
            onChange={(e) => {
              setInput(e.target.value);
              console.log(input);
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
          genres_data={props.genres_data}
          setgenres_data={props.setgenres_data}
          type={props.type}
          currentID={props.currentID}
          setmodelIsOpen={setmodelIsOpen}
        />
      </Modal>
    </div>
  );
}

function DeleteForm(props) {
  const key = findElement(props.genres_data, props.currentID);
  const currentName = props.genres_data[key].genreName;
  const [deleteElement, setdeleteElement] = useState(false);

  // useEffect(() => {
  //   if (deleteElement == true) {
  //     console.log("deleting--", currentName);
  //     let copy = JSON.parse(JSON.stringify(props.genres_data));
  //     copy.pop(key);
  //     props.setgenres_data(copy);
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
          <h5>The current Genre Name is {currentName}</h5>
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
          genres_data={props.genres_data}
          setgenres_data={props.setgenres_data}
          type={props.type}
          currentID={props.currentID}
          setmodelIsOpen={setmodelIsOpen}
        />
      </Modal>
    </div>
  );
}

function AddForm(props) {
  const [input, setInput] = useState("");
  const [newName, setNewName] = useState("");
  // useEffect(() => {
  //   if (newName != "") {
  //     console.log("addding--", newName);
  //     // console.log("old", props.genres_data);
  //     let copy = JSON.parse(JSON.stringify(props.genres_data));
  //     copy[newName] = { genreName: newName };
  //     props.setgenres_data(copy);
  //     console.log("new", copy);
  //   }
  // }, [newName]);

  function updateNewName(e) {
    e.preventDefault();
    if (input != "") {
      console.log(input);
      setNewName(input);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="update-form">
        <Form.Group>
          <h4>Add New {props.type} Name</h4>
          <Form.Control
            placeholder="Add New Name"
            onChange={(e) => {
              setInput(e.target.value);
              console.log(input);
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
        Add a new Genre
      </Button>
      <Modal isOpen={modelIsOpen} className="update-modal" ariaHideApp={false}>
        <AddForm
          type="Genre"
          genres_data={props.genres_data}
          setgenres_data={props.setgenres_data}
          setmodelIsOpen={setmodelIsOpen}
        />
      </Modal>
    </div>
  );
}

function GenresPage(props) {
  const [genres_data, setgenres_data] = useState([]);

  useEffect(async () => {
    async function featchSearchResults() {
      let jsBody = {};
      try {
        let link = "http://flip2.engr.oregonstate.edu:2341/genres";
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
      setgenres_data(jsBody);
    }
    featchSearchResults();
  }, []);

  console.log(genres_data);

  console.log(genres_data);
  return (
    <div className="main-page">
      <h1>Music Genres Page</h1>
      <ul className="list-group">
        <div className="list-column">
          <h4>Genre Name</h4>
          {Object.keys(genres_data).map((item, i) => (
            <li className="list-group-item" key={i}>
              {genres_data[item].genreName}
            </li>
          ))}
        </div>

        <div className="list-column">
          <h4>Update Name</h4>
          {Object.keys(genres_data).map((item, i) => (
            <UpdateModal
              type="Genre"
              currentID={genres_data[i].genreID}
              key={i}
              genres_data={genres_data}
              setgenres_data={setgenres_data}
            />
          ))}
        </div>

        <div className="list-column">
          <h4>Delete Name</h4>
          {Object.keys(genres_data).map((item, i) => (
            <DeleteModal
              type="Genre"
              currentID={genres_data[i].genreID}
              key={i}
              genres_data={genres_data}
              setgenres_data={setgenres_data}
            />
          ))}
        </div>

        <AddModal
          type="Genre"
          genres_data={genres_data}
          setgenres_data={setgenres_data}
        />
      </ul>
    </div>
  );
}

export default GenresPage;
