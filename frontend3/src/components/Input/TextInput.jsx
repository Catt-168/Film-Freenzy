import { TextField } from "@mui/material";
import React from "react";

export default function TextInput(props) {
  const {
    id,
    label,
    value,
    onChange,
    type = "text",
    error,
    helperText,
  } = props;
  return (
    <TextField
      type={type}
      margin="normal"
      required
      fullWidth
      id={id}
      label={label}
      name={id}
      autoComplete={id}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
    />
  );
}
