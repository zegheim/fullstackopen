import React, { useState, useEffect } from "react";

import Form from "./components/Form";
import Input from "./components/Input";
import Notification from "./components/Notification";
import Phonebook from "./components/Phonebook";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState({
    content: null,
    type: "success",
  });

  useEffect(() => {
    personService
      .getAllEntries()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const clearNotification = (delay) =>
    setTimeout(() => {
      setNotification({ ...notification, content: null });
    }, delay);

  const addPerson = (newPerson) => {
    personService
      .createEntry(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNotification({
          content: `Added ${returnedPerson.name}`,
          type: "success",
        });
        clearNotification(1500);
      })
      .catch((err) => {
        setNotification({
          content: err.response.data.error,
          type: "error",
        });
        clearNotification(1500);
      });
  };

  const updatePerson = (id, person) => {
    personService
      .updateEntry(id, person)
      .then((returnedPerson) => {
        setPersons(persons.map((p) => (p.id !== id ? p : returnedPerson)));
        setNotification({
          content: `Updated ${returnedPerson.name}'s number`,
          type: "success",
        });
        clearNotification(1500);
      })
      .catch((error) => {
        setNotification({
          content: error.response.data.error,
          type: "error",
        });
        clearNotification(1500);
        if (error.response.status === 404) {
          setPersons(persons.filter((p) => p.id !== id));
        }
      });
  };

  const deletePerson = (person) => () => {
    const isDeleteOk = window.confirm(`Delete ${person.name}?`);
    if (isDeleteOk) {
      personService
        .deleteEntry(person.id)
        .then((res) => {
          const remainingPersons = persons.filter((p) => p.id !== person.id);
          setPersons(remainingPersons);
          setNotification({
            content: `Deleted ${person.name} from server`,
            type: "success",
          });
          clearNotification(1500);
        })
        .catch((e) => {
          setNotification({
            content: `Information of ${person.name} has already been removed from server`,
            type: "error",
          });
          clearNotification(1500);
          setPersons(persons.filter((p) => p.id !== person.id));
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
      <Notification message={notification} />
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
