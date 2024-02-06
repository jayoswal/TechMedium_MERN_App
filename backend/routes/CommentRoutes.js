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
  const { commentBody, postId } = req.body;
  if (!commentBody || !postId) {
    return res.status(400).json({
      error: "Cannot have empty fields",
    });
  } else {
    const Comment = new CommentModel({
      commentBody: commentBody,
      commentedBy: req.user,
      date: new Date(),
    });

    Comment.save()
      .then((savedComment) => {
        PostModel.findByIdAndUpdate(
          postId,
          {
            $push: {
              comment: savedComment,
            },
          },
          {
            new: true,
          }
        )
          .exec()
          .then((result) => {
            return res.status(200).json({
              savedComment: savedComment,
            });
          })
          .catch((error) => {});
      })
      .catch((error) => {
        res.status(500).json({
          error: "Error Contact Admin",
        });
      });
  }
});

// GET - GET all post of a post
router.get("/comment/get/:postId", protectedResource, (req, res) => {
  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({
      error: "Cannot have empty field",
    });
  } else {
    PostModel.findById(postId)
      .sort(dateSort)
      .select("comment")
      .populate({
        path: "comment",
        options: { sort: { date: -1 } },
        populate: {
          path: "commentedBy",
          select: "_id name", // Specify the fields you want to select from UserModel
        },
      })
      .then((allComments) => {
        res.status(200).json({
          postComment: allComments,
        });
      })
      .catch((error) => {
        console.log("error getting posts of logged in user");
        res.status(500).json({
          error: "Error fetching comments...",
        });
      });
  }
});

module.exports = router;
