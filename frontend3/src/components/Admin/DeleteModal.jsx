import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import GenericButton from "../Core/GenericButton";
import { Colors } from "../../helpers/constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid",
  borderColor: "transparent",
  boxShadow: 24,
  p: 4,
  pb: 2,
};

export default function DeleteModal(props) {
  const { open, handleClose, onDelete, item, errorMessage } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete this Actor:{" "}
          <span style={{ color: Colors.primary }}>{item.name}</span>
        </Typography>
        <Box
          sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}
        >
          <GenericButton text="Cancel" onClick={() => handleClose()} isError />
          <GenericButton text="Confirm" onClick={() => onDelete(item._id)} />
        </Box>
        {errorMessage.length !== 0 ? (
          <Typography
            id="modal-modal-description"
            sx={{ color: Colors.red, mt: 2 }}
          >
            {errorMessage}
          </Typography>
        ) : null}
      </Box>
    </Modal>
  );
}
