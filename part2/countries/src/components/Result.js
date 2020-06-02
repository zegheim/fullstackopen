import React, { useState } from "react";

const Result = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return countries.map((c) => (
      <ToggledResult key={c.alpha2Code} country={c} />
    ));
  } else if (countries.length === 1) {
    return <DetailedResult country={countries[0]} />;
  } else {
    return <p>No matches found, try relaxing your filter</p>;
  }
};

const ToggledResult = ({ country }) => {
  const [isVisible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!isVisible);
  };

  return (
    <>
      <div>
        {country.name}{" "}
        <button onClick={toggleVisibility}>
          {isVisible ? "hide" : "show"}
        </button>
      </div>
      {isVisible ? <DetailedResult country={country} /> : null}
    </>
  );
};

const DetailedResult = ({ country }) => {
  const languages = country.languages.map((l) => (
    <li key={l.iso639_1}>{l.name}</li>
  ));

  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>{languages}</ul>
      <img src={country.flag} width="100" />
    </div>
  );
};

export default Result;
