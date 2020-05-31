import React, { useState } from "react";
import ReactDOM from "react-dom";

const Header = (props) => <h1>{props.title}</h1>;

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const Statistic = (props) => (
  <p>
    {props.text} {props.value}
  </p>
);

const Statistics = (props) => {
  const { good, neutral, bad } = props;
  const all = good + neutral + bad;

  if (!all) {
    return <p>No feedback given</p>;
  }

  const avg = (good - bad) / all;
  const pct = (100 * good) / all;

  return (
    <div>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={all} />
      <Statistic text="average" value={avg} />
      <Statistic text="positive" value={pct + "%"} />
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClick = (state, setState) => () => setState(state + 1);

  return (
    <>
      <Header title="give feedback" />
      <Button onClick={handleClick(good, setGood)} text="good" />
      <Button onClick={handleClick(neutral, setNeutral)} text="neutral" />
      <Button onClick={handleClick(bad, setBad)} text="bad" />
      <Header title="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
