const mongoose = require("mongoose");

const args = process.argv.slice(2);

if (![1, 3].includes(args.length)) {
  console.log("Please provide either:");
  console.log("  1. Password ONLY to display all entries in the phonebook, or");
  console.log(
    "  2. Password, name, and number to save a new entry to the phonebook."
  );
  process.exit(1);
}

const [password, newName, newNumber] = args;

const url = `mongodb+srv://fullstack:${password}@fullstackopen-a7hji.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (newName && newNumber) {
  const person = new Person({
    name: newName,
    number: newNumber,
  });
  person.save().then((res) => {
    console.log(`added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
}
