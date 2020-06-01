import React from "react";

const Entry = (props) => (
  <p>
    {props.person.name} {props.person.number}
  </p>
);
const Phonebook = (props) =>
  props.persons.map((person) => <Entry key={person.number} person={person} />);

export default Phonebook;
