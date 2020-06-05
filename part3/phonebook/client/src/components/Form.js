import React from "react";
import Input from "./Input";

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
