// require express
const express = require("express");

// require mongoose for UserModel
const mongoose = require("mongoose");

// bcryptjs
const bcrypt = require("bcryptjs");

// jwt and secret key
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config");

// include middleware
const protectedResource = require("../middlewares/ProtectedResource");

// require UserModel from monggose
const UserModel = mongoose.model("UserModel");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("GET / Received");
  res.status(200).send("From routes/Auth ...");
});

// REGISTER
router.post("/auth/register", (req, res) => {
  console.log("POST /auth/register Received");

  console.log(req.body);

  //destructure object
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Cannot have Empty Fields");

    res.status(400).json({
      error: "Cannot have Empty Fields",
    });
  } else {
    // find duplicate user
    UserModel.findOne({ email: email })
      .then(async (user) => {
        if (user) {
          res.status(400).json({
            error: "User with this email already exists.",
          });
        } else {
          // register user

          // bcrypt password and create new usermodel here reason - bcrypt takes some time and while save() is
          // called for model and hence password goes null
          var newUser = null;
          await bcrypt
            .hash(password, 16)
            .then((newPass) => {
              console.log("Hashed PAss: " + newPass);
              newUser = new UserModel({
                name: name,
                email: email,
                password: newPass,
              });
            })
            .catch((error) => {
              console.log("Password hash error: " + error);
              res.status(500).json({
                error: "Error Registerring",
              });
            });

          //save user
          await newUser
            .save()
            .then((savedUser) => {
              res.status(201).json({
                success: "User Registered",
                id: savedUser.id,
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error: "Error Registerring",
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "Error. Contact admin",
        });
      });
  }
});

// LOGIN
router.post("/auth/login", (req, res) => {
  console.log("POST /auth/login Received");
  console.log("Body:");
  console.log(req.body);

  // destructure body object
  const { email, password } = req.body;

  // return if any field empty
  if (!email || !password) {
    return res.status(400).json({
      error: "Fields cannot be empty",
    });
  }

  // check if user exists and verify credentials
  UserModel.findOne({ email: email })
    .then((foundUser) => {
      if (foundUser) {
        // match password
        var isPasswordCorrect = false;
        isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
        if (isPasswordCorrect) {
          // correct pass -> login
          // return JWT
          const jwtToken = jwt.sign({ _id: foundUser._id }, JWT_SECRET_KEY);
          console.log("Password matched, returning JWT");

          // destrucutre found user and send more info in response
          const { _id, name, email } = foundUser;

          return res.status(200).json({
            token: jwtToken,
            userInfo: { _id, name, email },
          });
        } else {
          console.log("Password not matching");
          return res.status(400).json({
            error: "Incorrect Credentials",
          });
        }
      } else {
        return res.status(400).json({
          error: "User do not exists with this email. Signup instead",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: "Error...",
      });
    });

  // // all good so far
  // res.status(200).json({
  //     success: "Request received"
  // })
});

// secured auth for testing
router.get("/auth/secured", protectedResource, (req, res) => {
  res.status(200).json({
    success: "You are in secured area",
  });
});

module.exports = router;
