const express = require("express");
const mongoose = require("mongoose");

const { MONGO_DB_URL } = require("./config");

// initialize
const app = express();
// DB Schema & Mongoose Connection initialize
mongoose.connect(MONGO_DB_URL);
// MONGODB CONNECTION AND TEST
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected ...");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB Error: " + err);
});
require("./models/UserModel");
require("./models/PostModel");

const PORT = 4000;

// Custom middleware function
const customMiddleware = (req, res, next) => {
  console.log("From customMiddleware...");
  next();
};

const middleware = (req, res, next) => {
  console.log("From middleware...");
  next();
};

//app.use(customMiddleware);
app.use(express.json());
app.use(require("./routes/Auth"));
app.use(require("./routes/PostRoutes"));

// // get
// app.get('/', (req, res) => {

//     console.log("GET / Received")
//     res.status(200).send("Hello World.")
// })

// // get /home
// app.get('/home', middleware,(req, res) => {

//     console.log("GET /home Received")
//     res.status(200).send("Inside Home.")
// })

// listen
app.listen(PORT, () => {
  console.log("Backend Server Started and Listening on PORT " + PORT);
});
