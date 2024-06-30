import { CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingSpinner({ size = 30, color = "BlueSapphire" }) {
  return <CircularProgress color={color} size={size} />;
}
