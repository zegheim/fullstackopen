import React from "react";

const Input = (props) => (
  <div>
    {props.label}: <input onChange={props.onChange} value={props.value} />
  </div>
);

const Form = (props) => (
  <form onSubmit={props.onSubmit}>
    <Input label="name" onChange={props.onNameChange} value={props.newName} />
    <Input label="number" onChange={props.onNumChange} value={props.newNum} />
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export default Form;
