const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const PostModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    default: "No Image Available",
    required: true,
  },

  date: {
    type: Date,
  },

  author: {
    type: ObjectId,
    ref: "UserModel",
  },
});

mongoose.model("PostModel", PostModel);
