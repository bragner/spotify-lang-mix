import React from "react";
import "../css/Spotify.css";
import SpotifyPlayer from "./SpotifyPlayer";
import SpotifyNavBar from "./SpotifyNavBar";

const Spotify = ({ authService }) => {
  return (
    <>
      <div className="container">
        <div className="body">
          <div className="sidebar">
            <SpotifyNavBar authService={authService} />
          </div>
          <div className="main">
            <div className="header">.header</div>
            <div className="content">
              Lorem ipsum dolor sit amet... repeat enough of these to overflow
              your browser's viewport.
            </div>
          </div>
        </div>
        <div className="footer">
          <SpotifyPlayer authService={authService} />
        </div>
      </div>
    </>
  );
};

export default Spotify;

// <ul>
// <li>
//   <button onClick={() => handleInput("play")}>Play</button>
// </li>
// <li>
//   <button onClick={() => handleInput("pause")}>Pause</button>
// </li>
// <li>
//   <button onClick={() => handleInput("next")}>Next</button>
// </li>
// <li>
//   <button onClick={() => handleInput("previous")}>Previous</button>
// </li>
// </ul>
