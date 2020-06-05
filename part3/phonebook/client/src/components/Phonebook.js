import React from "react";

const DeleteButton = (props) => <button onClick={props.onClick}>delete</button>;

const Entry = (props) => (
  <p>
    {props.person.name} {props.person.number}{" "}
    <DeleteButton onClick={props.handleClick} />
  </p>
);

const Phonebook = (props) => {
  return props.persons.map((person) => (
    <Entry
      key={person.id}
      person={person}
      handleClick={props.handleClick(person)}
    />
  ));
};

export default Phonebook;
