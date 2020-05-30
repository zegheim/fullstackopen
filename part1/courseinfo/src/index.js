import React from "react";
import ReactDOM from "react-dom";

const Header = (props) => {
  console.log(props);
  return <h1>{props.title}</h1>;
};

const Part = (props) => (
  <p>
    {props.title} {props.amount}
  </p>
);

const Content = (props) => (
  <>
    <Part title={props.part1.name} amount={props.part1.exercises} />
    <Part title={props.part2.name} amount={props.part2.exercises} />
    <Part title={props.part3.name} amount={props.part3.exercises} />
  </>
);

const Total = (props) => <p>Number of exercises {props.amount}</p>;

const App = () => {
  const course = "Half Stack application development";
  const part1 = { name: "Fundamentals of React", exercises: 10 };
  const part2 = { name: "Using props to pass data", exercises: 7 };
  const part3 = { name: "State of a component", exercises: 14 };

  return (
    <>
      <Header title={course} />
      <Content part1={part1} part2={part2} part3={part3} />
      <Total amount={part1.exercises + part2.exercises + part3.exercises} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
