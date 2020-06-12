const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  const deletePromises = [Blog.deleteMany({}), User.deleteMany({})];
  await Promise.all(deletePromises);

  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  const hashPromises = helper.initialUsers.map((user) =>
    bcrypt.hash(user.password, saltRounds)
  );
  const passwordHashes = await Promise.all(hashPromises);

  const userObjects = helper.initialUsers.map(
    (user, idx) =>
      new User({
        username: user.username,
        name: user.name,
        passwordHash: passwordHashes[idx],
      })
  );
  const initUserPromises = userObjects.map((user) => user.save());
  await Promise.all(initUserPromises);

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const initBlogPromises = blogObjects.map((blog) => blog.save());
  await Promise.all(initBlogPromises);
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
    const header = await helper.authHeader();
    const newBlog = {
      title: "Express patterns",
      author: "Michael Chan",
      url: "https://expresspatterns.com/",
      likes: 7,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", header)
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
    const header = await helper.authHeader();
    const blogWithoutLikes = {
      title: "Express patterns",
      author: "Michael Chan",
      url: "https://expresspatterns.com/",
    };

    const res = await api
      .post("/api/blogs")
      .set("Authorization", header)
      .send(blogWithoutLikes);
    expect(res.body.likes).toBe(0);
  });

  test("fails with status code 400 if data is invalid", async () => {
    const header = await helper.authHeader();

    const blogWithoutTitle = {
      author: "Michael Chan",
      url: "https://expresspatterns.com/",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", header)
      .send(blogWithoutTitle)
      .expect(400);

    const blogWithoutUrl = {
      title: "Express patterns",
      author: "Michael Chan",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", header)
      .send(blogWithoutUrl)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with status code 401 if no token", async () => {
    const newBlog = {
      title: "Express patterns",
      author: "Michael Chan",
      url: "https://expresspatterns.com/",
      likes: 7,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe.only("deletion of a blog", () => {
  test("succeeds with status code 204 if blog exists", async () => {
    const header = await helper.authHeader();
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test("fails with status code 404 if id does not exist", async () => {
    const validNonExistingId = await helper.nonExistingId();
    await api.delete(`/api/notes/${validNonExistingId}`).expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    await api.delete(`/api/blogs/${helper.invalidId}`).expect(400);
  });
});

describe("updating no. of likes in a blog", () => {
  const newLike = { likes: 99 };

  test("succeeds if blog exists", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLike)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body.likes).toBe(newLike.likes);
  });

  test("fails with status code 404 if id does not exist", async () => {
    const validNonExistingId = await helper.nonExistingId();
    await api.put(`/api/notes/${validNonExistingId}`).send(newLike).expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    await api.put(`/api/blogs/${helper.invalidId}`).send(newLike).expect(400);
  });
});

describe("creation of a new user", () => {
  test("succeeds with valid data", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("fails with status code 400 if username exists", async () => {
    const usersAtStart = await helper.usersInDb();
    const invalidUser = {
      username: "root",
      password: "123456",
    };

    await api.post("/api/users").send(invalidUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("fails with status code 400 if username is not given", async () => {
    const usersAtStart = await helper.usersInDb();
    const invalidUser = {
      password: "123456",
    };

    await api.post("/api/users").send(invalidUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("fails with status code 400 if username is less than 3 chars long", async () => {
    const usersAtStart = await helper.usersInDb();
    const invalidUser = {
      username: "ne",
      password: "123456",
    };

    await api.post("/api/users").send(invalidUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("fails with status code 400 if password is not given", async () => {
    const usersAtStart = await helper.usersInDb();
    const invalidUser = {
      username: "newname",
    };

    await api.post("/api/users").send(invalidUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("fails with status code 400 if password is less than 3 chars long", async () => {
    const usersAtStart = await helper.usersInDb();
    const invalidUser = {
      username: "newname",
      password: "12",
    };

    await api.post("/api/users").send(invalidUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => mongoose.connection.close());
