import React, { useEffect, useState } from "react";

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import reactDom from "react-dom";

import "./App.css";

let track = 0;

function UpdateForm(props) {
  const key = Object.keys(props.albums_data)[props.currentID].toString();
  const currentName = props.albums_data[key].albumName;
  const currentCity = props.albums_data[key].albumReleaseDate;
  const currentId = props.albums_data[key].albumID;
  const currentsingerName = props.albums_data[key].singerName;

  const [nameInput, setNameInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [artistSelection, setartistSelection] = useState("NULL");

  const [newName, setNewName] = useState(currentName);
  const [newCity, setNewCity] = useState(currentCity);
  const [artistUpdate, setartistUpdate] = useState(currentsingerName);

  function selectOption(e, type) {
    e.preventDefault();
    setartistSelection(e.target.value);
    // console.log(e.target.value);
  }
  const [db_artists_data, setdb_artists_data] = useState([]);

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
      setdb_artists_data(jsBody);
    }
    featchSearchResults();
  }, []);

  useEffect(async () => {
    async function updateData() {
      try {
        let link =
          "http://flip2.engr.oregonstate.edu:2341/albums/update/" +
          currentId +
          "&" +
          newName +
          "&" +
          newCity +
          "&" +
          artistUpdate;
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
  }, [newName, newCity, artistUpdate]);

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
    if (artistSelection != "NULL") {
      setartistUpdate(artistSelection);
      console.log(artistSelection);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="artist-update-form">
        <Form.Group>
          <h4>Update {props.type} Name</h4>
          <h5>The current Album Name is {currentName}</h5>
          <h5>The current release date is {currentCity}</h5>
          <h5>The current Aritst Name is {currentsingerName}</h5>
          <Form.Control
            placeholder="Enter New Album Name"
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
          <Form.Control
            placeholder="Enter New Release Date (YEAR-MM-DD)"
            onChange={(e) => {
              setCityInput(e.target.value);
            }}
          />
          <Form.Label>Please Select New Artist Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 2)}
          >
            <option>{""}</option>
            {Object.keys(db_artists_data).map((item, i) => (
              <option key={i}>{db_artists_data[item].singerName}</option>
            ))}
          </Form.Control>
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
          albums_data={props.albums_data}
          setalbums_data={props.setalbums_data}
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
  const key = Object.keys(props.albums_data)[props.currentID].toString();
  const currentName = props.albums_data[key].albumName;
  const [deleteElement, setdeleteElement] = useState(false);
  const currentId = props.albums_data[key].albumID;

  useEffect(async () => {
    async function deleteData() {
      if (deleteElement == true) {
        console.log("deleting--", currentName, currentId);
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/albums/delete/" + currentId;
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
          <h5>The current album is {currentName}</h5>
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
          albums_data={props.albums_data}
          setalbums_data={props.setalbums_data}
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

  const [artistSelection, setartistSelection] = useState("NULL");

  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");

  const [artistUpdate, setartistUpdate] = useState("NULL");

  function selectOption(e, type) {
    e.preventDefault();
    setartistSelection(e.target.value);
    console.log(e.target.value);
  }
  const [db_artists_data, setdb_artists_data] = useState([]);

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
      setdb_artists_data(jsBody);
    }
    featchSearchResults();
  }, []);

  useEffect(async () => {
    async function insertData() {
      if (newName != "" && newCity != "") {
        console.log("addding--", newName, newCity);
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/albums/insert/" +
            newName +
            "&" +
            newCity +
            "&" +
            artistUpdate;
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
  }, [newName, newCity, artistUpdate]);

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
    if (artistSelection != "NULL") {
      setartistUpdate(artistSelection);
    }
    props.setmodelIsOpen(false);
  }

  return reactDom.createPortal(
    <div>
      <Form className="artist-update-form">
        <Form.Group>
          <h4>Add New {props.type} Name</h4>
          <Form.Control
            placeholder="Add New Album Name"
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
          <Form.Control
            placeholder="Add New Release Date (YEAR-MM-DD)"
            onChange={(e) => {
              setCityInput(e.target.value);
            }}
          />

          <Form.Label>Please Select New Artist Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 2)}
          >
            <option>{""}</option>
            {Object.keys(db_artists_data).map((item, i) => (
              <option key={i}>{db_artists_data[item].singerName}</option>
            ))}
          </Form.Control>
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
        Add a new Album
      </Button>
      <Modal isOpen={modelIsOpen} className="update-modal" ariaHideApp={false}>
        <AddForm
          type="album"
          albums_data={props.albums_data}
          setalbums_data={props.setalbums_data}
          setmodelIsOpen={setmodelIsOpen}
          setupdate_data={props.setupdate_data}
        />
      </Modal>
    </div>
  );
}

function AlbumsPage(props) {
  const [albums_data, setalbums_data] = useState([]);
  const [update_data, setupdate_data] = useState(0);
  useEffect(async () => {
    async function featchSearchResults() {
      let jsBody = {};
      try {
        let link = "http://flip2.engr.oregonstate.edu:2341/albums";
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
      setalbums_data(jsBody);
      console.log(jsBody);
    }
    featchSearchResults();
  }, [update_data]);

  return (
    <div className="main-page">
      <h1>Music Albums Page</h1>
      <ul className="list-group">
        <div className="list-column">
          <h4>Album Name</h4>
          {Object.keys(albums_data).map(
            (item, i) =>
              albums_data[item].albumName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {albums_data[item].albumName}
                </li>
              )
          )}
        </div>
        <div className="list-column">
          <h4>Release Date</h4>
          {Object.keys(albums_data).map(
            (item, i) =>
              albums_data[item].albumName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {albums_data[item].albumReleaseDate.slice(0, 10)}
                </li>
              )
          )}
        </div>
        <div className="list-column">
          <h4>Artist Name</h4>
          {Object.keys(albums_data).map(
            (item, i) =>
              albums_data[item].albumName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {albums_data[item].singerName}
                </li>
              )
          )}
        </div>

        <div className="list-column">
          <h4>Update Album</h4>
          {Object.keys(albums_data).map(
            (item, i) =>
              albums_data[item].albumName != "NULL" && (
                <UpdateModal
                  type="Album"
                  currentID={i}
                  key={i}
                  albums_data={albums_data}
                  setalbums_data={setalbums_data}
                  setupdate_data={setupdate_data}
                />
              )
          )}
        </div>

        <div className="list-column">
          <h4>Delete Album</h4>
          {Object.keys(albums_data).map(
            (item, i) =>
              albums_data[item].albumName != "NULL" && (
                <DeleteModal
                  type="Album"
                  currentID={i}
                  key={i}
                  albums_data={albums_data}
                  setalbums_data={setalbums_data}
                  setupdate_data={setupdate_data}
                />
              )
          )}
        </div>

        <AddModal
          type="Album"
          albums_data={albums_data}
          setalbums_data={setalbums_data}
          setupdate_data={setupdate_data}
        />
      </ul>
    </div>
  );
}

export default AlbumsPage;
