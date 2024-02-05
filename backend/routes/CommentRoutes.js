const express = require("express");
const router = express.Router();

const protectedResource = require("../middlewares/ProtectedResource");

const mongoose = require("mongoose");
const CommentModel = mongoose.model("CommentModel");
const PostModel = mongoose.model("PostModel");

router.get("/comment/health", protectedResource, (req, res) => {
  res.status(200).json({
    success: "Comment API Up",
  });
});

// sorting by date descending
const dateSort = {
  date: -1,
};

// POST - add comment
router.post("/comment/add", protectedResource, async (req, res) => {
  const { comment, postId } = req.body;
  if (!comment || !postId) {
    return res.status(400).json({
      error: "Cannot have empty fields",
    });
  } else {
    const post = await PostModel.findById(postId).then((post) => {
      return post;
    });
    req.user.password = undefined;
    const Comment = new CommentModel({
      comment: comment,
      post: post,
      author: req.user,
      date: new Date(),
    });

    await Comment.save()
      .then((savedComment) => {
        return res.status(201).json({
          success: "Comment Added",
          savedComment,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error: error,
        });
      });
  }
});

// GET - GET all post of a post
router.get("/comment/get", protectedResource, (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    return res.status(400).json({
      error: "Cannot have empty field",
    });
  } else {
    const comments = CommentModel.find({
      postId: postId,
    })
      .sort(dateSort)
      .then((allComments) => {
        res.status(200).json({
          allComments,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error: "Error getting comments. contact admin",
        });
      });
  }
});

module.exports = router;
