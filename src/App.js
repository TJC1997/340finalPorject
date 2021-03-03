import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

import GenresPage from "./GenresPage";
import ArtistsPage from "./ArtistsPage";
import AlbumsPage from "./AlbumsPage";
import SongsPage from "./SongsPage";
import ConnectPage from "./ConnectPage";

function MyNavBar(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {props.home ? (
              <a className="nav-link active" href="/home">
                Home
              </a>
            ) : (
              <a className="nav-link" href="/home">
                Home
              </a>
            )}
            {props.genres ? (
              <a className="nav-link active" href="/genres">
                Genres
              </a>
            ) : (
              <a className="nav-link" href="/genres">
                Genres
              </a>
            )}
            {props.artists ? (
              <a className="nav-link active" href="/artists">
                Artists
              </a>
            ) : (
              <a className="nav-link" href="/artists">
                Artists
              </a>
            )}
            {props.albums ? (
              <a className="nav-link active" href="/albums">
                Albums
              </a>
            ) : (
              <a className="nav-link" href="/albums">
                Albums
              </a>
            )}
            {props.songs ? (
              <a className="nav-link active" href="/songs">
                Songs
              </a>
            ) : (
              <a className="nav-link" href="/songs">
                Songs
              </a>
            )}
            {props.connect ? (
              <a className="nav-link active" href="/connect">
                Connect
              </a>
            ) : (
              <a className="nav-link" href="/connect">
                Connect
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <div className="main-page">
      <h1>Super Senior Database Homepage</h1>
      <h2>Welcome to the song database!</h2>
    </div>
  );
}

function AppFooter() {
  return (
    <div className="fixed-bottom">
      <footer className="footer">
        <div>
          <a>340 Final Project.</a>
          <span>&copy; 2020.</span>
        </div>
        <div className="ml-auto">
          <span>Powered by </span>
          <span>
            <a href="https://github.com/TJC1997">Yuhang Chen</a>
            <span> &&</span>
            <a href="https://github.com/mitchbr31"> Mitchell Brown</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/genres">
          <MyNavBar genres />
          <GenresPage />
        </Route>
        <Route exact path="/artists">
          <MyNavBar artists />
          <ArtistsPage />
        </Route>
        <Route exact path="/albums">
          <MyNavBar albums />
          <AlbumsPage />
        </Route>
        <Route exact path="/songs">
          <MyNavBar songs />
          <SongsPage />
        </Route>
        <Route exact path="/connect">
          <MyNavBar connect />
          <ConnectPage />
        </Route>
        <Route exact path="/home">
          <MyNavBar home />
          <HomePage />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/">
          <MyNavBar />
          <h1>404:You are at a wrong page!</h1>
        </Route>
      </Switch>
      <AppFooter />
    </div>
  );
}

export default App;
