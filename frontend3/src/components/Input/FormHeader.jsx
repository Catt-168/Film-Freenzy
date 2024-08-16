import { Typography } from "@mui/material";
import React from "react";
import { Colors } from "../../helpers/constants";

export default function FormHeader({ title }) {
  return (
    <Typography
      component="h1"
      variant="h5"
      color={Colors.primary}
      sx={{ textAlign: "center" }}
    >
      {title}
    </Typography>
  );
}
