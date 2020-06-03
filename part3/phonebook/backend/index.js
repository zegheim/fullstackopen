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

const generateId = (min, max) => {
  let id;

  do {
    id = Math.floor(Math.random() * (max - min + 1) + min);
  } while (persons.map((p) => p.id).includes(id));

  return id;
};

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

  console.log(body.name);

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  const isExist = persons.map((p) => p.name).includes(body.name);
  if (isExist) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(0, 10000),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
