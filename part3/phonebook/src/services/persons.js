import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getAllEntries = () => axios.get(baseUrl).then((res) => res.data);

const createEntry = (newPerson) =>
  axios.post(baseUrl, newPerson).then((res) => res.data);

const updateEntry = (id, newPerson) =>
  axios.put(`${baseUrl}/${id}`, newPerson).then((res) => res.data);

const deleteEntry = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((res) => res.data);

export default { getAllEntries, createEntry, updateEntry, deleteEntry };
