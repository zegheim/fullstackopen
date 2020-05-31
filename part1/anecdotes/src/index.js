import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const Anecdote = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <p>has {props.count} votes</p>
    </div>
  );
};

const App = (props) => {
  const anecdotes = props.anecdotes;
  const initialVotes = new Array(anecdotes.length).fill(0);

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(initialVotes);

  const handleVoteClick = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const handleNextClick = () => {
    const newIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(newIndex);
  };

  const mostVotes = votes.reduce(
    (maxIdx, vote, idx, arr) => (vote > arr[maxIdx] ? idx : maxIdx),
    0
  );

  return (
    <>
      <Anecdote
        title="Anecdote of the day"
        content={anecdotes[selected]}
        count={votes[selected]}
      />
      <Button onClick={handleVoteClick} text="vote" />
      <Button onClick={handleNextClick} text="next" />
      <Anecdote
        title="Anecdote with most votes"
        content={anecdotes[mostVotes]}
        count={votes[mostVotes]}
      />
    </>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
