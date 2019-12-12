// Dependencies
var express = require("express");
var mongoose = require("mongoose");

// Database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Sets up Express
var app = express();
var PORT = process.env.PORT || 8080;

// Data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Routes
require("./routes.js")(app);

// Turn on server
app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
});
