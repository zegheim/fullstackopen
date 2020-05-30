import React from "react";
import ReactDOM from "react-dom";

const Header = (props) => <h1>{props.title}</h1>;

const Part = (props) => (
  <p>
    {props.title} {props.amount}
  </p>
);

const Content = (props) => (
  <>
    <Part title={props.title1} amount={props.amount1} />
    <Part title={props.title2} amount={props.amount2} />
    <Part title={props.title3} amount={props.amount3} />
  </>
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
      <Content
        title1={part1}
        amount1={exercises1}
        title2={part2}
        amount2={exercises2}
        title3={part3}
        amount3={exercises3}
      />
      <Total amount={exercises1 + exercises2 + exercises3} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
