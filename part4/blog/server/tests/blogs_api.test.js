const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body).toHaveLength(helper.initialBlogs.length);
});

test("uid property of each blog is called `id`", async () => {
  const res = await api.get("/api/blogs");
  const allIdExists = res.body.reduce(
    (acc, curr) => acc && curr.id !== undefined,
    true
  );
  expect(allIdExists).toBe(true);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Express patterns",
    author: "Michael Chan",
    url: "https://expresspatterns.com/",
    likes: 7,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  expect(blogsAtEnd).toEqual(
    expect.arrayContaining([expect.objectContaining(newBlog)])
  );
});

test("no. of likes in a blog defaults to 0", async () => {
  const blogWithoutLikes = {
    title: "Express patterns",
    author: "Michael Chan",
    url: "https://expresspatterns.com/",
  };

  const res = await api.post("/api/blogs").send(blogWithoutLikes);
  expect(res.body.likes).toBe(0);
});

afterAll(() => mongoose.connection.close());
