import { Button } from "@mui/material";
import React from "react";
import { Colors } from "../../helpers/constants";

/**
 * Generic Multipurpose Button
 *
 * @param {object} sx The Style
 * @param {string} text Button Text
 * @param {@componemt} startIcon Icon component for button
 * @param {boolean} fullWidth Button width
 * @param {boolean} isError isError Is Button color red?
 * @param {function} onClick Button onClick funtion
 * @param {string} size Button size
 * @param {boolean} disabled Disabled Button
 * @param {string} type Form button type="submit"
 * @returns {JSX.Element} A button element
 *
 */

export default function GenericButton(props) {
  const {
    sx,
    text,
    startIcon = null,
    fullWidth = false,
    isError = false,
    onClick = () => {},
    size = "medium",
    disabled = false,
    type = "",
  } = props;
  return (
    <Button
      startIcon={startIcon}
      type={type}
      fullWidth={fullWidth}
      disabled={disabled}
      variant="contained"
      onClick={onClick}
      sx={[
        sx,
        {
          background: isError ? Colors.red : Colors.primary,
          "&:hover": {
            background: Colors.darkPrimary,
          },
        },
      ]}
      size={size}
    >
      {text}
    </Button>
  );
}
