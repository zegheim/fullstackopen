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
    personService
      .getAllEntries()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addPerson = (newPerson) => {
    personService.createEntry(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
    });
  };

  const updatePerson = (id, person) => {
    personService.updateEntry(id, person).then((returnedPerson) => {
      setPersons(persons.map((p) => (p.id !== id ? p : returnedPerson)));
    });
  };

  const deletePerson = (person) => () => {
    const isDeleteOk = window.confirm(`Delete ${person.name}?`);
    if (isDeleteOk) {
      personService.deleteEntry(person.id).then((res) => {
        const remainingPersons = persons.filter((p) => p.id !== person.id);
        setPersons(remainingPersons);
      });
    }
  };

  const addOrUpdatePerson = (event) => {
    event.preventDefault();

    const person = { name: newName, number: newNum };
    const existingPerson = persons.find((p) => p.name === newName);

    if (!existingPerson) {
      addPerson(person);
    } else {
      const isUpdateOk = window.confirm(
        `${newName} is already added to Phonebook, replace the old number with a new one?`
      );
      if (isUpdateOk) {
        updatePerson(existingPerson.id, person);
      }
    }

    setNewName("");
    setNewNum("");
  };

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
        onSubmit={addOrUpdatePerson}
        onNameChange={handleInputChange(setNewName)}
        onNumChange={handleInputChange(setNewNum)}
        newName={newName}
        newNum={newNum}
      />
      <h2>Numbers</h2>
      <Phonebook persons={filteredPersons} handleClick={deletePerson} />
    </div>
  );
};

export default App;
