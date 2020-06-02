import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "./components/Input";
import Result from "./components/Result";

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  const getAllCountries = () => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  };
  useEffect(getAllCountries, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const doesNameInclude = (ref) => (target) =>
    target.name.toLowerCase().includes(ref.toLowerCase());

  return (
    <>
      <Input
        text="find countries"
        value={search}
        onChange={handleSearchChange}
      />
      <Result countries={countries.filter(doesNameInclude(search))} />
    </>
  );
}

export default App;
