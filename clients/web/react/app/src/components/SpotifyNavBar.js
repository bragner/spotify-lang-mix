import React, { useEffect, useState } from "react";
import "../css/SpotifyNavBar.css";
import logo from "../img/Spotify_Logo_RGB_White.png";
import { FaRegHeart } from "react-icons/fa";
import HttpClient from "../services/HttpClient";

const SpotifyNavBar = ({ authService }) => {
  const playlistEndpoint = "http://localhost:4001";

  const [playlists, setPlaylists] = useState([]);

  const getPlaylists = async () => {
    const response = await HttpClient.get(`${playlistEndpoint}/playlists`, [
      {
        Authorization: await authService.getAccessToken(),
      },
    ]);
    const playlists = await response.json();
    setPlaylists(playlists.items);
  };
  useEffect(() => {
    getPlaylists();
  });

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <a href="/" className="navbar-header-logo">
          <img
            alt="Spotify Logo"
            className="navbar-header-logo-img"
            src={logo}
          />
        </a>
      </div>
      <ul>
        <li>
          <div className="navbar-item">
            <a href="/" className="navbar-link navBar-link--active">
              <div className="navbar-item-text-with-icon">
                <div>
                  <svg
                    viewBox="0 0 512 512"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M448 463.746h-149.333v-149.333h-85.334v149.333h-149.333v-315.428l192-111.746 192 110.984v316.19z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="navbar-item-text ">Home</div>
              </div>
            </a>
          </div>
        </li>
        <li>
          <div className="navbar-item">
            <a href="/search" className="navbar-link">
              <div className="navbar-item-text-with-icon">
                <div>
                  <svg
                    viewBox="0 0 512 512"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285-80.254-21.46-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286 80.254 21.461z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="navbar-item-text ">Search</div>
              </div>
            </a>
          </div>
        </li>
        <li>
          <div className="navbar-item">
            <a href="/collection" className="navbar-link">
              <div className="navbar-item-text-with-icon">
                <div>
                  <svg
                    viewBox="0 0 512 512"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M291.301 81.778l166.349 373.587-19.301 8.635-166.349-373.587zM64 463.746v-384h21.334v384h-21.334zM192 463.746v-384h21.334v384h-21.334z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="navbar-item-text ">Your Library</div>
              </div>
            </a>
          </div>
        </li>
      </ul>
      <div className="navbar-root-list">
        <div className="navbar-root-list-content">
          <div className="navbar-root-list-playlist">
            <h2 className="navbar-playlist-header">PLAYLISTS</h2>
            <div className="navbar-playlist-controls">
              <button className="navbar-playlist-create-btn ">
                <svg
                  className="navbar-playlist-create-btn-icon"
                  viewBox="0 0 36 36"
                >
                  <path d="m28 20h-8v8h-4v-8h-8v-4h8v-8h4v8h8v4z"></path>
                </svg>
                <span className="navbar-playlist-create-btn-text">
                  Create Playlist
                </span>
              </button>
            </div>
            <div className="liked-songs">
              <div className="navbar-item">
                <a href="/collection/tracks" className="navbar-link">
                  <div className="navbar-item-text-with-icon">
                    <div>
                      <FaRegHeart className="liked-songs-icon" />
                    </div>
                    <div className="navbar-item-text">Liked Songs</div>
                  </div>
                </a>
              </div>
            </div>
            <hr className="navbar-divide" />
            <ul className="navbar-playlist-scroll">
              {playlists.length > 0 ? (
                playlists.map((playlist, index) => {
                  console.log(playlist);
                  return (
                    <a href={`playlist/${playlist.id}`}>
                      <div key={index}>
                        <li className="navbar-playlist-item">
                          {playlist.name}
                        </li>
                      </div>
                    </a>
                  );
                })
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="navbar-footer">
        <div className="navbar-item">
          <a className="navbar-link" href="https://open.spotify.com/download">
            <div className="navbar-item-text-with-icon">
              <div className="navbar-icon">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Download icon</title>
                  <path
                    d="M12 11.657V6h-1v5.65L9.076 9.414l-.758.65 3.183 3.702 3.195-3.7-.758-.653L12 11.657zM11.5 2C7.358 2 4 5.358 4 9.5c0 4.142 3.358 7.5 7.5 7.5 4.142 0 7.5-3.358 7.5-7.5C19 5.358 15.642 2 11.5 2zm0 14C7.916 16 5 13.084 5 9.5S7.916 3 11.5 3 18 5.916 18 9.5 15.084 16 11.5 16z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div className="navbar-item-text ">Install App</div>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default SpotifyNavBar;
