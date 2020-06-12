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

describe("when there is initially some blogs saved", () => {
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

  test("uid property of each blog is named `id`", async () => {
    const res = await api.get("/api/blogs");
    const allIdExists = res.body.reduce(
      (acc, curr) => acc && curr.id !== undefined,
      true
    );
    expect(allIdExists).toBe(true);
  });
});

describe("addition of a new blog", () => {
  test("succeeds with valid data", async () => {
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

  test("defaults to 0 likes if not specified", async () => {
    const blogWithoutLikes = {
      title: "Express patterns",
      author: "Michael Chan",
      url: "https://expresspatterns.com/",
    };

    const res = await api.post("/api/blogs").send(blogWithoutLikes);
    expect(res.body.likes).toBe(0);
  });

  test("fails with status code 400 if data is invalid", async () => {
    const blogWithoutTitle = {
      author: "Michael Chan",
      url: "https://expresspatterns.com/",
    };
    const blogWithoutUrl = {
      title: "Express patterns",
      author: "Michael Chan",
    };

    await api.post("/api/blogs").send(blogWithoutTitle).expect(400);
    await api.post("/api/blogs").send(blogWithoutUrl).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => mongoose.connection.close());
