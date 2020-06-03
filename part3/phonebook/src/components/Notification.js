import React from "react";

const Notification = ({ message }) =>
  message.content === null ? null : (
    <div className={`notification ${message.type}`}>{message.content}</div>
  );

export default Notification;
