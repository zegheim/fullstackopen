const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: Number,
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});

blogSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
