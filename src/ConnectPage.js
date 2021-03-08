import React, { useEffect, useState } from "react";

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import reactDom from "react-dom";

import "./App.css";

let track = 0;

function UpdateForm(props) {
  const key = Object.keys(props.connections_data)[props.currentID].toString();
  const currentName = props.connections_data[key].songName;
  const currentAlbumName = props.connections_data[key].albumName;
  const currentsingerName = props.connections_data[key].singerName;
  const currentGenreName = props.connections_data[key].genreName;
  const currentId = props.connections_data[key].songID;

  const [albumSelection, setalbumSelection] = useState("NULL");
  const [artistSelection, setartistSelection] = useState("NULL");
  const [genreSelection, setgenreSelection] = useState("NULL");

  const [albumUpdate, setalbumUpdate] = useState(currentAlbumName);
  const [artistUpdate, setartistUpdate] = useState(currentsingerName);
  const [genreUpdate, setgenreUpdate] = useState(currentGenreName);

  function selectOption(e, type) {
    e.preventDefault();
    if (type == 1) {
      setalbumSelection(e.target.value);
      // console.log(e.target.value);
    } else if (type == 2) {
      setartistSelection(e.target.value);
      // console.log(e.target.value);
    } else {
      setgenreSelection(e.target.value);
      // console.log(e.target.value);
    }
  }

  function updateNewConnection(e) {
    e.preventDefault();
    if (albumSelection != "NULL") {
      setalbumUpdate(albumSelection);
      console.log(albumSelection);
    }
    if (artistSelection != "NULL") {
      setartistUpdate(artistSelection);
      console.log(artistSelection);
    }
    if (genreSelection != "NULL") {
      setgenreUpdate(genreSelection);
      console.log(genreSelection);
    }
    props.setmodelIsOpen(false);
  }

  const [db_albums_data, setdb_albums_data] = useState([]);

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
      setdb_albums_data(jsBody);
    }
    featchSearchResults();
  }, []);

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

  const [db_genres_data, setdb_genres_data] = useState([]);

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
      setdb_genres_data(jsBody);
    }
    featchSearchResults();
  }, []);

  useEffect(async () => {
    async function updateData() {
      console.log("updateing--", currentName);

      try {
        let link =
          "http://flip2.engr.oregonstate.edu:2341/connections/update/" +
          currentId +
          "&" +
          albumUpdate +
          "&" +
          currentName +
          "&" +
          genreUpdate +
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
  }, [albumUpdate, genreUpdate, artistUpdate]);

  return reactDom.createPortal(
    <div>
      <Form className="connect-update-form">
        <Form.Group>
          <h4>Update {props.type}</h4>
          <h5>The current Song Name is {currentName}</h5>
          <h5>The current Album Name is {currentAlbumName}</h5>
          <h5>The current Aritst Name is {currentsingerName}</h5>
          <h5>The current Genre Name is {currentGenreName}</h5>

          <Form.Label>Please Select New Album Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 1)}
          >
            <option>{""}</option>
            {Object.keys(db_albums_data).map((item, i) => (
              <option key={i}>{db_albums_data[item].albumName}</option>
            ))}
          </Form.Control>

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

          <Form.Label>Please Select New Genres Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 3)}
          >
            <option>{""}</option>
            {Object.keys(db_genres_data).map((item, i) => (
              <option key={i}>{db_genres_data[item].genreName}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button
          variant="success"
          type="submit"
          onClick={(e) => updateNewConnection(e)}
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
          connections_data={props.connections_data}
          setconnections_data={props.setconnections_data}
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
  const key = Object.keys(props.connections_data)[props.currentID].toString();
  const currentName = props.connections_data[key].songName;
  const currentId = props.connections_data[key].songID;
  const [deleteElement, setdeleteElement] = useState(false);

  useEffect(async () => {
    async function deleteData() {
      if (deleteElement == true) {
        console.log("deleting--", currentName, currentId);
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/connections/delete/" +
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
          connections_data={props.connections_data}
          setconnections_data={props.setconnections_data}
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
  const [songSelection, setsongSelection] = useState("NULL");
  const [albumSelection, setalbumSelection] = useState("NULL");
  const [artistSelection, setartistSelection] = useState("NULL");
  const [genreSelection, setgenreSelection] = useState("NULL");

  const [songUpdate, setsongUpdate] = useState("NULL");
  const [albumUpdate, setalbumUpdate] = useState("NULL");
  const [artistUpdate, setartistUpdate] = useState("NULL");
  const [genreUpdate, setgenreUpdate] = useState("NULL");

  function selectOption(e, type) {
    e.preventDefault();
    if (type === 4) {
      setsongSelection(e.target.value);
      console.log(e.target.value);
    } else if (type === 1) {
      setalbumSelection(e.target.value);
      console.log(e.target.value);
    } else if (type === 2) {
      setartistSelection(e.target.value);
      console.log(e.target.value);
    } else {
      setgenreSelection(e.target.value);
      console.log(e.target.value);
    }
  }

  function addNewConnection(e) {
    e.preventDefault();
    if (songSelection != "NULL") {
      setsongUpdate(songSelection);
    }
    if (albumSelection != "NULL") {
      setalbumUpdate(albumSelection);
    }
    if (artistSelection != "NULL") {
      setartistUpdate(artistSelection);
    }
    if (genreSelection != "NULL") {
      setgenreUpdate(genreSelection);
    }
    props.setmodelIsOpen(false);
  }

  const [db_albums_data, setdb_albums_data] = useState([]);

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
      setdb_albums_data(jsBody);
    }
    featchSearchResults();
  }, []);

  const [db_songs_data, setdb_songs_data] = useState([]);

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
      setdb_songs_data(jsBody);
    }
    featchSearchResults();
  }, []);

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

  const [db_genres_data, setdb_genres_data] = useState([]);

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
      setdb_genres_data(jsBody);
    }
    featchSearchResults();
  }, []);

  useEffect(async () => {
    async function updateData() {
      console.log("adding--", songUpdate);
      if (
        songUpdate != "NULL" ||
        albumUpdate != "NULL" ||
        artistUpdate != "NULL" ||
        genreUpdate != "NULL"
      ) {
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/connections/insert/" +
            albumUpdate +
            "&" +
            songUpdate +
            "&" +
            genreUpdate +
            "&" +
            artistUpdate;
          const res = await fetch(link);
          console.log("INSERT  ", link);
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
    updateData();
  }, [albumUpdate, genreUpdate, artistUpdate, songUpdate]);

  return reactDom.createPortal(
    <div>
      <Form className="connect-update-form">
        <Form.Group>
          <h4>Add a new {props.type}</h4>

          <Form.Label>Please Select New Song Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 4)}
          >
            <option>{""}</option>
            {Object.keys(db_songs_data).map(
              (item, i) =>
                db_songs_data[item].songName != "NULL" && (
                  <option key={i}>{db_songs_data[item].songName}</option>
                )
            )}
          </Form.Control>

          <Form.Label>Please Select New Album Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 1)}
          >
            <option>{""}</option>
            {Object.keys(db_albums_data).map((item, i) => (
              <option key={i}>{db_albums_data[item].albumName}</option>
            ))}
          </Form.Control>

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

          <Form.Label>Please Select New Genres Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 3)}
          >
            <option>{""}</option>
            {Object.keys(db_genres_data).map((item, i) => (
              <option key={i}>{db_genres_data[item].genreName}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button
          variant="success"
          type="submit"
          onClick={(e) => addNewConnection(e)}
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
        Add a new Connection
      </Button>
      <Modal isOpen={modelIsOpen} className="update-modal" ariaHideApp={false}>
        <AddForm
          type="Connection"
          connections_data={props.connections_data}
          setconnections_data={props.setconnections_data}
          setmodelIsOpen={setmodelIsOpen}
          setupdate_data={props.setupdate_data}
        />
      </Modal>
    </div>
  );
}

function ConnectPage(props) {
  const [connections_data, setconnections_data] = useState([]);
  const [update_data, setupdate_data] = useState(0);
  useEffect(async () => {
    async function featchSearchResults() {
      let jsBody = {};
      try {
        let link = "http://flip2.engr.oregonstate.edu:2341/connections";
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
      setconnections_data(jsBody);
    }
    featchSearchResults();
  }, [update_data]);

  console.log(connections_data);

  return (
    <div className="main-page">
      <h1>Music Connect Page</h1>
      <ul className="list-group">
        <div className="list-column">
          <h4>Song Name</h4>
          {Object.keys(connections_data).map(
            (item, i) =>
              connections_data[item].songName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {connections_data[item].songName}
                </li>
              )
          )}
        </div>
        <div className="list-column">
          <h4>Album Name</h4>
          {Object.keys(connections_data).map(
            (item, i) =>
              connections_data[item].songName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {connections_data[item].albumName}
                </li>
              )
          )}
        </div>
        <div className="list-column">
          <h4>Artist Name</h4>
          {Object.keys(connections_data).map(
            (item, i) =>
              connections_data[item].songName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {connections_data[item].singerName}
                </li>
              )
          )}
        </div>
        <div className="list-column">
          <h4>Genre Name</h4>
          {Object.keys(connections_data).map(
            (item, i) =>
              connections_data[item].songName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {connections_data[item].genreName}
                </li>
              )
          )}
        </div>

        <div className="list-column">
          <h4>Update Connection</h4>
          {Object.keys(connections_data).map(
            (item, i) =>
              connections_data[item].songName != "NULL" && (
                <UpdateModal
                  type="Connection"
                  currentID={i}
                  key={i}
                  connections_data={connections_data}
                  setconnections_data={setconnections_data}
                  setupdate_data={setupdate_data}
                />
              )
          )}
        </div>

        <div className="list-column">
          <h4>Delete connection</h4>
          {Object.keys(connections_data).map(
            (item, i) =>
              connections_data[item].songName != "NULL" && (
                <DeleteModal
                  type="Connection"
                  currentID={i}
                  key={i}
                  connections_data={connections_data}
                  setconnections_data={setconnections_data}
                  setupdate_data={setupdate_data}
                />
              )
          )}
        </div>

        <AddModal
          type="Connection"
          connections_data={connections_data}
          setconnections_data={setconnections_data}
          setupdate_data={setupdate_data}
        />
      </ul>
    </div>
  );
}

export default ConnectPage;
