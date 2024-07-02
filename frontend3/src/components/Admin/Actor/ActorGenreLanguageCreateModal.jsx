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
  p: 4,
  display: "flex",
  flexDirection: "column",
  boxShadow: 3,
  borderRadius: 2,
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

export default function ActorGenreLanguageCreateModal(props) {
  const {
    open,
    onClose,
    onChange,
    onCreate,
    data,
    isLoading,
    openSnackBar,
    error,
    type,
  } = props;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && data.name.length !== 0) {
      onCreate();
    }
  };

  const isActor = type === "actor";

  function genereateTitle(type) {
    switch (type) {
      case "genre":
        return "Genre Create Form";
      case "actor":
        return "Actor Create Form";
      case "language":
        return "Language Create Form";
      default:
        return "";
    }
  }

  function generateLabel(type) {
    switch (type) {
      case "genre":
        return "Genre";
      case "actor":
        return "Actor Name";
      case "language":
        return "Language";
      default:
        return "";
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={[
          style,
          {
            height: openSnackBar ? 330 : "auto",
          },
        ]}
        onKeyDown={handleKeyDown}
      >
        <Typography
          component="h1"
          variant="h5"
          color={Colors.primary}
          sx={{ textAlign: "center" }}
        >
          {genereateTitle(type)}
        </Typography>
        <TextInput
          id="name"
          label={generateLabel(type)}
          value={data.name}
          onChange={onChange}
          disabled={isLoading}
          error={error.status}
          helperText={error.message}
        />
        {isActor ? (
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
            {data.file ? data.file.name : "Upload Image (Optional)"}
            <VisuallyHiddenInput
              type="file"
              id="file"
              name="file"
              onChange={onChange}
            />
          </Button>
        ) : null}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <GenericButton
            disabled={data.name.length === 0}
            text={
              isLoading ? <LoadingSpinner color={"White"} size={25} /> : "Save"
            }
            onClick={onCreate}
          />
        </Box>
      </Box>
    </Modal>
  );
}
