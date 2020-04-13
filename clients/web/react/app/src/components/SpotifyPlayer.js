import React, { useState, useEffect, useCallback } from "react";
import { Slider } from "office-ui-fabric-react/lib/Slider";
import HttpClient from "../services/HttpClient";
import "../css/SpotifyPlayer.css";
import {
  MdPlayCircleOutline,
  MdPauseCircleOutline,
  MdSkipNext,
  MdSkipPrevious,
  MdQueueMusic,
  MdQueuePlayNext,
  MdRepeat,
  MdRepeatOne,
  MdShuffle,
} from "react-icons/md";
import { FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";
const SpotifyPlayer = ({ authService }) => {
  const playerEndpoint = "http://127.0.0.1:6001";

  const [currentTrack, setCurrentTrack] = useState({});
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPaused, setPaused] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds === 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  const setupPlayer = () => {
    window.player._options.getOAuthToken = (cb) => {
      cb(authService.getAccessToken());
    };
    window.player.addListener("ready", ({ device_id }) => {
      // handleInput("pause");
      // handleInput("play", device_id);
    });

    window.player.addListener("player_state_changed", (st) => {
      if (st) {
        const {
          track_window,
          paused,
          repeat_mode,
          shuffle,
          position,
          duration,
        } = st;

        document.title = `${
          track_window.current_track.name
        } · ${track_window.current_track.artists
          .map((a) => {
            return `${a.name}`;
          })
          .join(",")
          .replace(",", ", ")}`;

        setPaused(paused);
        setDuration(duration);
        setPosition(position);
        setCurrentTrack(track_window.current_track);
        setShuffle(shuffle);

        switch (repeat_mode) {
          case 1:
            setRepeat("context");
            break;
          case 2:
            setRepeat("track");
            break;
          default:
            setRepeat("off");
            break;
        }
      } else {
        setPaused(true);
        setDuration(0);
        setPosition(0);
        setCurrentTrack({});
      }
    });
    window.player.connect();
  };
  const playerCallback = useCallback(setupPlayer);
  useEffect(
    () => {
      playerCallback();
      let interval = setInterval(() => {
        if (!isPaused) {
          setPosition((position) => position + 1000);
        }
      }, 1000);
      return () => clearInterval(interval);
    } /*[playerCallback, isPaused]*/
  );

  const handleInput = async (
    command,
    device = "",
    shuffle = "",
    repeat = ""
  ) => {
    await HttpClient.get(
      `${playerEndpoint}/${command}?device_id=${device}&shuffle=${shuffle}&repeat=${repeat}`,
      [
        {
          Authorization: await authService.getAccessToken(),
        },
      ]
    );
  };
  const renderRepeat = () => {
    switch (repeat) {
      case "track":
        return (
          <MdRepeatOne
            className="spotify-enabled icon-20"
            onClick={() => handleInput("repeat", "", "", "off")}
          />
        );
      case "context":
        return (
          <MdRepeat
            className="spotify-enabled icon-25"
            onClick={() => handleInput("repeat", "", "", "track")}
          />
        );
      default:
        return (
          <MdRepeat
            className="icon-20"
            onClick={() => handleInput("repeat", "", "", "context")}
          />
        );
    }
  };

  const renderVolume = () => {
    switch (true) {
      case volume >= 0.6:
        return (
          <FiVolume2
            onClick={() => {
              window.player.setVolume(0);
              setVolume(0);
            }}
          />
        );
      case volume < 0.6 && volume >= 0.1:
        return (
          <FiVolume1
            onClick={() => {
              window.player.setVolume(0);
              setVolume(0);
            }}
          />
        );
      default:
        return (
          <FiVolumeX
            onClick={() => {
              window.player.setVolume(1);
              setVolume(1);
            }}
          />
        );
    }
  };
  return (
    <footer className="player-container">
      <div className="player-bar">
        <div className="player-bar-left">
          <div>
            {!isEmpty(currentTrack) ? (
              <img
                alt="Album Cover"
                className="player-bar-left-album"
                src={currentTrack.album.images[0].url}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="player-bar-left-info">
            <a href="/#" className="player-bar-left-title">
              {!isEmpty(currentTrack) ? currentTrack.name : ""}
            </a>
            <a href="/#" className="player-bar-left-artist">
              {!isEmpty(currentTrack)
                ? currentTrack.artists
                    .map((a) => {
                      return `${a.name}`;
                    })
                    .join(",")
                    .replace(",", ", ")
                : ""}
            </a>
          </div>
        </div>
        <div className="player-bar-center">
          <div className="player-bar-center-controls">
            <div className="player-bar-center-controls-buttons">
              <div className="button-control-wrapper">
                <MdShuffle
                  className={shuffle ? "spotify-enabled icon-20" : "icon-20"}
                  onClick={() => {
                    handleInput("shuffle", "", shuffle ? "false" : "true");
                  }}
                />
              </div>
              <div className="button-control-wrapper">
                <MdSkipPrevious
                  className="icon-25"
                  onClick={() => handleInput("previous")}
                />
              </div>
              {isPaused ? (
                <div className="button-control-wrapper">
                  <MdPlayCircleOutline
                    onClick={() => {
                      handleInput("play");
                      setPaused(false);
                    }}
                    className="icon-35"
                  />
                </div>
              ) : (
                <div className="button-control-wrapper">
                  <MdPauseCircleOutline
                    onClick={() => {
                      handleInput("pause");
                      setPaused(true);
                    }}
                    className="icon-35"
                  />
                </div>
              )}
              <div className="button-control-wrapper">
                <MdSkipNext
                  className="icon-25"
                  onClick={() => handleInput("next")}
                />
              </div>
              <div className="button-control-wrapper">{renderRepeat()}</div>
            </div>
            <div className="player-bar-center-controls-progress">
              <div className="progress-time">
                {millisToMinutesAndSeconds(position)}
              </div>
              <div className="progress-bar">
                <div className="progress-bar-wrapper">
                  <Slider
                    min={0}
                    max={duration}
                    value={position}
                    step={1000}
                    onChange={(value) => setPosition(value)}
                    showValue={false}
                  />
                </div>
              </div>
              <div className="progress-time">
                {millisToMinutesAndSeconds(duration)}
              </div>
            </div>
          </div>
        </div>
        <div className="player-bar-right">
          <div className="extra-buttons-bar">
            <div className="extra-buttons">
              <div className="button-control-wrapper">
                <MdQueueMusic />
              </div>
              <div className="button-control-wrapper">
                <MdQueuePlayNext />
              </div>
              <div className="volume">
                <div className="button-control-wrapper">{renderVolume()}</div>
                <div className="volume-slider">
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={(value) => {
                      setVolume(value);
                      window.player.setVolume(value);
                    }}
                    showValue={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SpotifyPlayer;
