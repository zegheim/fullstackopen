import React from "react";
import ReactDOM from "react-dom";

const Header = (props) => <h1>{props.title}</h1>;

const Content = (props) => (
  <p>
    {props.title} {props.amount}
  </p>
);

const Total = (props) => <p>Number of exercises {props.amount}</p>;

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <>
      <Header title={course} />
      <Content title={part1} amount={exercises1} />
      <Content title={part2} amount={exercises2} />
      <Content title={part3} amount={exercises3} />
      <Total amount={exercises1 + exercises2 + exercises3} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
