import React, { useState, useEffect } from "react";

import Form from "./components/Form";
import Input from "./components/Input";
import Phonebook from "./components/Phonebook";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();

    const isUnique = persons.every((p) => p.name !== newName);
    if (isUnique) {
      const person = { name: newName, number: newNum };
      personService.create(person).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNum("");
      });
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  };

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Input
        label="filter shown with"
        onChange={handleInputChange(setSearch)}
        value={search}
      />
      <h2>Add new</h2>
      <Form
        onSubmit={addPerson}
        onNameChange={handleInputChange(setNewName)}
        onNumChange={handleInputChange(setNewNum)}
        newName={newName}
        newNum={newNum}
      />
      <h2>Numbers</h2>
      <Phonebook persons={filteredPersons} />
    </div>
  );
};

export default App;
