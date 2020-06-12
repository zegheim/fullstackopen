const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;

  if (!body.password || body.password.length < 3) {
    return res
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;
