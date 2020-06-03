const Person = require("./models/person");

const args = process.argv.slice(2);

if (![0, 2].includes(args.length)) {
  console.log("Please provide either:");
  console.log("  1. no arguments display all entries in the phonebook, or");
  console.log("  2. name, and number to save a new entry to the phonebook.");
  process.exit(1);
}

const [newName, newNumber] = args;

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
