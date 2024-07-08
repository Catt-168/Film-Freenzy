import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { Colors } from "../../helpers/constants";

export default function Snack(props) {
  const { vertical, horizontal, openSnackBar, onCloseSnackBar, message } =
    props;
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={openSnackBar}
      onClose={onCloseSnackBar}
      autoHideDuration={3000}
      key={vertical + horizontal}
    >
      <Alert
        onClose={onCloseSnackBar}
        variant="filled"
        sx={{ width: "100%", background: Colors.primary }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
