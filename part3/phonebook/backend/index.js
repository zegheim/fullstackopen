require("dotenv").config();

const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("data", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/info", (req, res) => {
  const reqDate = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${reqDate}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((notes) => res.json(notes));
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => res.json(savedPerson));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => res.status(204).end())
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(err);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
