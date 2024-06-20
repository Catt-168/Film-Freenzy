import { CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingSpinner({ size = 30 }) {
  return <CircularProgress color="BlueSapphire" size={size} />;
}
