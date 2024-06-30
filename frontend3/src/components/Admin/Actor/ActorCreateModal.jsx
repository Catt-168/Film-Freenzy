import React, { useState } from "react";
import { Colors } from "../../../helpers/constants";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GenericButton from "../../Core/GenericButton";
import { Alert, Box, Button, Modal, Snackbar, Typography } from "@mui/material";
import TextInput from "../../Input/TextInput";
import LoadingSpinner from "../../Core/LoadingSpinner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  border: "2px solid",
  borderColor: Colors.primary,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ActorCreateModal(props) {
  const {
    open,
    onClose,
    onChangeActor,
    onCreateActor,
    actor,
    isLoading,
    openSnackBar,
    closeSnackBar,
    vertical,
    horizontal,
  } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={[style, { height: openSnackBar ? 330 : "auto" }]}>
        <Typography
          component="h1"
          variant="h5"
          color={Colors.primary}
          sx={{ textAlign: "center" }}
        >
          Actor Create Form
        </Typography>
        <TextInput
          id="name"
          label="Actor Name"
          value={actor.name}
          onChange={onChangeActor}
          disabled={isLoading}
        />
        <Button
          component="label"
          role={undefined}
          fullWidth
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{
            mb: 2,
            mt: 2,
            background: Colors.primary,
            "&:hover": { background: Colors.darkPrimary },
          }}
        >
          {actor.file ? actor.file.name : "Upload Image (Optional)"}
          <VisuallyHiddenInput
            type="file"
            id="file"
            name="file"
            onChange={onChangeActor}
          />
        </Button>
        <GenericButton
          text={
            isLoading ? <LoadingSpinner color={"White"} size={25} /> : "Save"
          }
          sx={{ width: "30%", ml: 13 }}
          onClick={onCreateActor}
        />

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openSnackBar}
          onClose={closeSnackBar}
          autoHideDuration={3000}
          key={vertical + horizontal}
        >
          <Alert
            onClose={closeSnackBar}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Actor Successfully Added!
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
}
