const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const helper = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  const passwordHash = await bcrypt.hash("sekret", saltRounds);
  const user = new User({ username: "root", passwordHash });
  await user.save();
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
