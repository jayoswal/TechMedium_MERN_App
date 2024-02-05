const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  post: {
    type: ObjectId,
    ref: "PostModel",
  },
  author: {
    type: ObjectId,
    ref: "UserModel",
  },
  date: {
    type: Date,
  },
});

mongoose.model("CommentModel", CommentSchema);
