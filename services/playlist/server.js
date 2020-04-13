const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

var corsOptions = {
  origin: "https://localhost:3000",
};

var app = express();
app.listen(4001, () => {
  console.log("Server running on port 4001");
});

const endpoint = "https://api.spotify.com/v1/me/playlists?limit=50";
app.options("*", cors());
app.get("/playlists", cors(corsOptions), async (req, res, next) => {
  const auth = req.get("Authorization");
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  const json = await response.json();
  res.json(json);
});
