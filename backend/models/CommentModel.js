const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new mongoose.Schema({
  commentBody: {
    type: String,
    required: true,
  },
  commentedBy: {
    type: ObjectId,
    ref: "UserModel",
  },
  date: {
    type: Date,
  },
});

mongoose.model("CommentModel", CommentSchema);
