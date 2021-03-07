import React, { useEffect, useState } from "react";

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import reactDom from "react-dom";

import "./App.css";

let track = 0;

function findElement(data, id) {
  let i;
  for (i = 0; i < data.length; i++) {
    console.log(data[i].songID, id);
    if (data[i].songID === id) {
      break;
    }
  }
  return i;
}

function UpdateForm(props) {
  const key = findElement(props.songs_data, props.currentID);
  const currentName = props.songs_data[key].songName;
  const currentId = props.songs_data[key].songID;
  const currentAlbumName = props.songs_data[key].albumName;
  console.log("Key", key, currentName, currentId);

  const currentGenreName = props.songs_data[key].genreName;

  const [nameInput, setNameInput] = useState("");
  const [albumSelection, setalbumSelection] = useState("");
  const [genreSelection, setgenreSelection] = useState("");
  const [albumUpdate, setalbumUpdate] = useState(currentAlbumName);
  const [genreUpdate, setgenreUpdate] = useState(currentGenreName);
  const [newName, setNewName] = useState(currentName);

  function selectOption(e, type) {
    e.preventDefault();
    if (type === 1) {
      setalbumSelection(e.target.value);
      console.log(e.target.value);
    } else {
      setgenreSelection(e.target.value);
      console.log(e.target.value);
    }
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
      console.log("updateing--", newName);
      try {
        let link =
          "http://flip2.engr.oregonstate.edu:2341/songs/update/" +
          currentId +
          "&" +
          newName +
          "&" +
          albumUpdate +
          "&" +
          genreUpdate;
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
  }, [newName, albumUpdate, genreUpdate]);

  function updateNewName(e) {
    e.preventDefault();
    if (nameInput != "") {
      console.log(nameInput);
      setNewName(nameInput);
    }
    if (albumSelection != "") {
      setalbumUpdate(albumSelection);
    }

    if (genreSelection != "") {
      setgenreUpdate(genreSelection);
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
          setupdate_data={props.setupdate_data}
        />
      </Modal>
    </div>
  );
}

function DeleteForm(props) {
  const key = Object.keys(props.songs_data)[props.currentID].toString();
  const currentName = props.songs_data[key].songName;
  const currentId = props.songs_data[key].songID;
  console.log(currentId);
  const [deleteElement, setdeleteElement] = useState(false);

  useEffect(async () => {
    async function deleteData() {
      if (deleteElement == true) {
        console.log("deleting--", currentName, currentId);
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/songs/delete/" + currentId;
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
          songs_data={props.songs_data}
          setsongs_data={props.setsongs_data}
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

  const [newName, setNewName] = useState("");

  const [albumSelection, setalbumSelection] = useState("NULL");
  const [genreSelection, setgenreSelection] = useState("NULL");
  const [albumUpdate, setalbumUpdate] = useState("NULL");
  const [genreUpdate, setgenreUpdate] = useState("NULL");

  function selectOption(e, type) {
    e.preventDefault();
    if (type === 1) {
      setalbumSelection(e.target.value);
      console.log(e.target.value);
    } else {
      setgenreSelection(e.target.value);
      console.log(e.target.value);
    }
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
    async function insertData() {
      if (newName != "") {
        console.log("addding--", newName);
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/songs/insert/" +
            newName +
            "&" +
            albumUpdate +
            "&" +
            genreUpdate;
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
  }, [newName]);

  function updateNewName(e) {
    e.preventDefault();
    if (nameInput != "") {
      console.log(nameInput);
      setNewName(nameInput);
    }
    if (albumSelection != "NULL") {
      setalbumUpdate(albumSelection);
    }

    if (genreSelection != "NULL") {
      setgenreUpdate(genreSelection);
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
          <Form.Label>Please Select New Album Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 1)}
          >
            {Object.keys(db_albums_data).map((item, i) => (
              <option key={i}>{db_albums_data[item].albumName}</option>
            ))}
          </Form.Control>

          <Form.Label>Please Select New Genres Name</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            custom
            onChange={(e) => selectOption(e, 3)}
          >
            {Object.keys(db_genres_data).map((item, i) => (
              <option key={i}>{db_genres_data[item].genreName}</option>
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
        Add a new song
      </Button>
      <Modal isOpen={modelIsOpen} className="update-modal" ariaHideApp={false}>
        <AddForm
          type="Song"
          songs_data={props.songs_data}
          setsongs_data={props.setsongs_data}
          setmodelIsOpen={setmodelIsOpen}
          setupdate_data={props.setupdate_data}
        />
      </Modal>
    </div>
  );
}

function SongsPage(props) {
  const [songs_data, setsongs_data] = useState([]);
  const [update_data, setupdate_data] = useState(0);
  const [alertUser, setalertUser] = useState(false);
  const [searchMode, setsearchMode] = useState(false);

  const [input, setInput] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (alertUser == true) {
      alert(newName + " Not Found. Please try a new name");
      setalertUser(false);
    }
  }, [alertUser]);

  useEffect(async () => {
    async function featchSearchResults() {
      let jsBody = {};
      try {
        let link = "http://flip2.engr.oregonstate.edu:2341/songs";
        const res = await fetch(link);
        jsBody = await res.json();
        console.log(link);
        console.log(res);
        console.log(jsBody);
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
  }, [update_data]);

  useEffect(async () => {
    async function searchData() {
      if (newName != "") {
        console.log("searching--", newName);
        let jsBody = {};
        try {
          let link =
            "http://flip2.engr.oregonstate.edu:2341/songs/search/" + newName;
          const res = await fetch(link);
          console.log(link);
          // console.log(res);
          jsBody = await res.json();
          console.log(jsBody);
        } catch (e) {
          if (e instanceof DOMException) {
            console.log("HTTP request abort");
          } else {
            console.log("error");
            console.log(e);
          }
        }
        console.log(jsBody);
        if (Object.keys(jsBody).length != 0) {
          setsongs_data(jsBody);
          setsearchMode(true);
        } else {
          setalertUser(true);
        }
      }
    }
    searchData();
  }, [newName]);

  function searchSong(e) {
    e.preventDefault();
    if (input != "") {
      console.log("search");
      console.log(input);
      setNewName(input);
    }
  }

  return (
    <div className="main-page">
      <h1>Music Songs Page</h1>
      <Form className="search-box">
        <Form.Group controlId="formBasicPassword">
          <Form.Control
            type="text"
            placeholder="Search Song Name Here"
            onChange={(e) => {
              setInput(e.target.value);
              console.log(input);
            }}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="search-button"
          onClick={(e) => searchSong(e)}
        >
          Submit
        </Button>
      </Form>
      <ul className="list-group">
        <div className="list-column">
          <h4>Song Name</h4>
          {Object.keys(songs_data).map(
            (item, i) =>
              songs_data[item].songName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {songs_data[item].songName}
                </li>
              )
          )}
        </div>

        <div className="list-column">
          <h4>Album Name</h4>
          {Object.keys(songs_data).map(
            (item, i) =>
              songs_data[item].songName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {songs_data[item].albumName}
                </li>
              )
          )}
        </div>

        <div className="list-column">
          <h4>Genre Name</h4>
          {Object.keys(songs_data).map(
            (item, i) =>
              songs_data[item].songName != "NULL" && (
                <li className="list-group-item" key={i}>
                  {songs_data[item].genreName}
                </li>
              )
          )}
        </div>

        {searchMode == false && (
          <div className="list-column">
            <h4>Update Song</h4>
            {Object.keys(songs_data).map(
              (item, i) =>
                songs_data[item].songName != "NULL" && (
                  <UpdateModal
                    type="Song"
                    currentID={songs_data[i].songID}
                    key={i}
                    songs_data={songs_data}
                    setsongs_data={setsongs_data}
                    setupdate_data={setupdate_data}
                  />
                )
            )}
          </div>
        )}
        {searchMode == false && (
          <div className="list-column">
            <h4>Delete Song</h4>
            {Object.keys(songs_data).map(
              (item, i) =>
                songs_data[item].songName != "NULL" && (
                  <DeleteModal
                    type="Song"
                    currentID={songs_data[i].songID}
                    key={i}
                    songs_data={songs_data}
                    setsongs_data={setsongs_data}
                    setupdate_data={setupdate_data}
                  />
                )
            )}
          </div>
        )}

        <AddModal
          type="Song"
          songs_data={songs_data}
          setsongs_data={setsongs_data}
          setupdate_data={setupdate_data}
        />
      </ul>
    </div>
  );
}

export default SongsPage;
