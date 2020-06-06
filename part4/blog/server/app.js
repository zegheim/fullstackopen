const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const config = require("./utils/config");
const logger = require("./utils/logger");

const app = express();

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = process.env.MONGODB_URI;

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to MongoDB"))
  .catch((e) => console.log("error connecting to MongoDB", e.message));

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (req, res) => {
  Blog.find({}).then((blogs) => res.json(blogs));
});

app.post("/api/blogs", (req, res) => {
  const blog = new Blog(req.body);

  blog.save().then((result) => res.status(201).json(result));
});

module.exports = app;
