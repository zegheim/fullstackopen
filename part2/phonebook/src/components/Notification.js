import React from "react";

const Notification = ({ message }) =>
  message === null ? null : <div className="success">{message}</div>;

export default Notification;
