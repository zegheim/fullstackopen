import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./components/Form";
import Input from "./components/Input";
import Phonebook from "./components/Phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [search, setSearch] = useState("");

  const hook = () => {
    axios
      .get("http://localhost:3001/persons")
      .then((response) => setPersons(response.data));
  };
  useEffect(hook, []);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();

    const isDifferentFrom = (target) => (ref) => ref.name !== target;
    const isUnique = persons.every(isDifferentFrom(newName));
    if (isUnique) {
      const person = { name: newName, number: newNum };
      setPersons(persons.concat(person));
      setNewName("");
      setNewNum("");
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
