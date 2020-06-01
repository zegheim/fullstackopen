import React, { useState } from "react";
import Form from "./components/Form";
import Phonebook from "./components/Phonebook";

const App = (props) => {
  const [persons, setPersons] = useState(props.persons);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");

  const isDifferentFrom = (target) => (ref) => ref.name !== target;

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
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

  return (
    <div>
      <h2>Phonebook</h2>
      <Form
        onSubmit={addPerson}
        onNameChange={handleInputChange(setNewName)}
        onNumChange={handleInputChange(setNewNum)}
        newName={newName}
        newNum={newNum}
      />
      <h2>Numbers</h2>
      <Phonebook persons={persons} />
    </div>
  );
};

export default App;
