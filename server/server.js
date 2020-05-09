const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const router = express.Router();

const app = express();
app.use(cors());
app.options("*", cors());

/**
 * Middleware config
 * bodyParser.json() returns a function that is passed as a param to
 * app.use() as middleware. We can now send JSON to our express
 * application.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// We export the router so that the server.js file can pick it up
module.exports = router;

const object = require("./routes/api/object");
app.use("/api/object", object);
// Combine react and node js servers when deploying, unecessary for dev runs
if (process.env.NODE_ENV === "production") {
  // Set a static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

// Set up a port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port: ${port}`));
