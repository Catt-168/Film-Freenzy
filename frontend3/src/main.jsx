import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material";
import { Colors } from "./helpers/constants.js";

const theme = createTheme({
  palette: {
    BlueSapphire: {
      main: Colors.primary,
      contrastText: "#fff",
      yellow: Colors.yellow,
    },
    White: {
      main: Colors.textWhite,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
