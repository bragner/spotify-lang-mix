import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

const Callback = ({ key, authService, handleAuth }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      var cookies = document.cookie.split(";");

      let stateCookie = "";
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];

        const cookieKeyVal = cookie.split("=");

        if (cookieKeyVal[0] === "stateKey") {
          stateCookie = cookieKeyVal[1];
        }
      }
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (state === stateCookie) {
        document.cookie = "stateKey=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        authService.login(code).then(() => {
          setLoading(false);
          handleAuth();
        });
      }
    }
  });

  return loading ? <></> : <Redirect to="/" />;
};

export default Callback;
