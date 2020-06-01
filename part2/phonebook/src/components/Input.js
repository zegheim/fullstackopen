import React from "react";

const Input = (props) => (
  <div>
    {props.label}: <input onChange={props.onChange} value={props.value} />
  </div>
);

export default Input;
