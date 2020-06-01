import React, { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const isDifferentFrom = (target) => (ref) => ref.name !== target;

  const addPerson = (event) => {
    event.preventDefault();

    const isUnique = persons.every(isDifferentFrom(newName));
    if (isUnique) {
      const person = { name: newName };
      setPersons(persons.concat(person));
      setNewName("");
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  };

  const handleFormChange = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input onChange={handleFormChange} value={newName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <p key={person.name}>{person.name}</p>
      ))}
    </div>
  );
};

export default App;
