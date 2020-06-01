import React from "react";

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

const Total = (props) => {
  const total = props.course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );
  return <strong>total of {total} exercises</strong>;
};

const Course = ({ course }) => (
  <>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </>
);

export default Course;
