import React from "react";

const Input = ({ type = "text", value, onChange, className, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded px-3 py-2 w-full ${className}`}
      {...props}
    />
  );
};

export default Input;
