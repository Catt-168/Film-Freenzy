import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import * as React from "react";

export default function PasswordInput(props) {
  const {
    id,
    label,
    value,
    onChange,
    error,
    helperText,
    onShow,
    showPassword,
    onMouseDown,
  } = props;
  return (
    <TextField
      type={showPassword ? "text" : "password"}
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
      InputProps={{
        startAdornment: (
          <InputAdornment sx={{ position: "absolute", right: 15 }}>
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => onShow()}
              onMouseDown={onMouseDown}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
