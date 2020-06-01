import React from "react";

const Phonebook = (props) =>
  props.persons.map((person) => (
    <p key={person.number}>
      {person.name} {person.number}
    </p>
  ));

export default Phonebook;
