import React from "react";
import ReactDOM from "react-dom";

const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

const Part = (props) => (
  <p>
    {props.title} {props.amount}
  </p>
);

const Content = (props) =>
  props.course.parts.map((part) => (
    <Part key={part.id} title={part.name} amount={part.exercises} />
  ));

const Course = ({ course }) => (
  <>
    <Header course={course} />
    <Content course={course} />
  </>
);

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
    ],
  };

  return <Course course={course} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
