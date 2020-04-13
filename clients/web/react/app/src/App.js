import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./css/App.css";
import Callback from "./components/auth/Callback";
import Spotify from "./components/Spotify";
import AuthService from "./services/AuthService";

function App() {
  const [auth, setAuth] = useState(false);
  const authService = new AuthService();

  const handleAuth = () => {
    setAuth(authService.isAuthenticated());
  };
  const onClick = () => {
    const stateKey = Date.now();
    var date = new Date();
    date.setTime(date.getTime() + 60 * 1000);
    document.cookie = `stateKey=${stateKey};expires=${date};secure`;

    var url =
      "https://accounts.spotify.com/authorize?client_id=&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Flogin&scope=user-read-playback-state,user-modify-playback-state,streaming,user-read-email,user-read-private,playlist-read-private,playlist-read-collaborative&state=" +
      stateKey;
    window.location.href = url;
  };
  const authCallback = useCallback(handleAuth);
  useEffect(
    () => {
      authService.SSO().then(() => {
        authCallback();
      });
    } /*[authService, authCallback]*/
  );

  return (
    <Router>
      <div>
        {auth ? (
          <Spotify authService={authService} />
        ) : (
          <>
            <button onClick={onClick}>Sign in to Spotify</button>
            <Route path="/login">
              <Callback authService={authService} handleAuth={handleAuth} />
            </Route>
          </>
        )}
      </div>
    </Router>
  );
}

/* function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
} */
export default App;
