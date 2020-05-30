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

const Content = (props) => (
  <>
    <Part
      title={props.course.parts[0].name}
      amount={props.course.parts[0].exercises}
    />
    <Part
      title={props.course.parts[1].name}
      amount={props.course.parts[1].exercises}
    />
    <Part
      title={props.course.parts[2].name}
      amount={props.course.parts[2].exercises}
    />
  </>
);

const Total = (props) => (
  <p>
    Number of exercises{" "}
    {props.course.parts[0].exercises +
      props.course.parts[1].exercises +
      props.course.parts[2].exercises}
  </p>
);

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      { name: "Fundamentals of React", exercises: 10 },
      { name: "Using props to pass data", exercises: 7 },
      { name: "State of a component", exercises: 14 },
    ],
  };

  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
