import { Chip } from "@mui/material";
import React from "react";
import { Colors } from "../../helpers/constants";

/**
 * Generic Multipurpose Chip
 *
 * @param {string} label Chip label
 * @param {string} size Chip size
 * @param {object} sx Chip Style
 * @returns {JSX.Element} A Chip element
 *
 */
export default function GenericChip(props) {
  const { label, size, sx } = props;
  return (
    <Chip
      label={label}
      size={size}
      sx={[sx, { background: Colors.primary, color: Colors.textWhite }]}
    />
  );
}
