const express = require("express");
const router = express.Router();

// include middleware
const protectedResource = require("../middlewares/ProtectedResource");

// include mongoose and model
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel");

// sorting by date descending
const dateSort = {
  date: -1,
};

// POST - Create Post
router.post("/post/create", protectedResource, (req, res) => {
  const { title, body, imageUrl } = req.body;
  if (!title || !body || !imageUrl) {
    return res.status(400).json({
      error: "Cannot have empty fields",
    });
  }

  // remove password from req.user came from middleware
  req.user.password = undefined;
  const postModel = new PostModel({
    title: title,
    body: body,
    imageUrl: imageUrl,
    date: new Date(),
    author: req.user,
  });

  postModel
    .save()
    .then((savedPost) => {
      res.status(201).json({
        success: "Post Created",
        post: savedPost,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "Error creating post...",
      });
    });
});

// GET - get all posts of all users
router.get("/post/all", protectedResource, (req, res) => {
  PostModel.find()
    .sort(dateSort)
    .populate("author", "_id name")
    .then((allPosts) => {
      res.status(200).json({
        allPosts,
      });
    })
    .catch((error) => {
      console.log("error getting all posts");
      res.status(500).json({
        error: "Error fetching post...",
      });
    });
});

// Get posts of logged in user
router.get("/post/myPost", protectedResource, (req, res) => {
  PostModel.find({ author: req.user._id })
    .sort(dateSort)
    .then((allPosts) => {
      res.status(200).json({
        allPosts,
      });
    })
    .catch((error) => {
      console.log("error getting posts of logged in user");
      res.status(500).json({
        error: "Error fetching post...",
      });
    });
});

// export the route
module.exports = router;
