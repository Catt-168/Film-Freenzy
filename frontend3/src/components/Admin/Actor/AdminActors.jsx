import { Box, Grid, Paper, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import GenericButton from "../../Core/GenericButton";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { SERVER } from "../../../constants";
import LoadingSpinner from "../../Core/LoadingSpinner";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Colors } from "../../../helpers/constants";
import restClient from "../../../helpers/restClient";
import DeleteModal from "../DeleteModal";
import Snack from "../Snack";
import ActorGenreLanguageCreateModal from "./ActorGenreLanguageCreateModal";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function AdminActors() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [modalOpen, setModalOpen] = useState(false); // confirm modal
  const [selectedActor, setSelectedActor] = useState({ name: "", image: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [state, setState] = useState({
    openSnackBar: false,
    vertical: "bottom",
    horizontal: "right",
    message: "",
  });
  const [openModal, setOpenModal] = useState(false); // edit modal
  const [actorError, setActorError] = useState({
    status: false,
    message: "",
  });
  let { data, isLoading, isError } = useFetch(`${SERVER}/actors`);

  function handleChangeActor(e) {
    const { name, value, files } = e.target;
    setSelectedActor({
      ...selectedActor,
      [name]: files ? files[0] : value,
    });
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  async function handleDeleteActor(id) {
    try {
      await restClient.delete(`${SERVER}/actors/${id}`);
      setState({
        ...state,
        openSnackBar: true,
        message: "Actor Successfully deleted",
      });
      hanldeClose();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      setErrorMessage(e.response.data.message);
    }
  }

  async function handleUpdateActor() {
    const { name, image, _id } = selectedActor;

    const form = new FormData();
    form.append("name", name);
    form.append("file", image);

    try {
      const response = await restClient.put(`${SERVER}/actors/${_id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setState({
          ...state,
          openSnackBar: true,
          message: "Actor Successfully Updated",
        });
        handleExistEditModal();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleExistEditModal() {
    setOpenModal(false);
  }

  function hanldeClose() {
    setModalOpen(false);
    setSelectedActor({});
    setErrorMessage("");
  }

  function handleEdit(item) {
    setSelectedActor(item);
    setOpenModal(true);
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Error!</p>;

  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 7 }}>
        <GenericButton
          //   onClick={() => navigate(`/admin/actors/create`)}
          sx={{ mr: "90%" }}
          text={"Create"}
          disabled
        />

        {/* CHANGE MD:18  */}
        <Grid container spacing={0} columns={{ md: 12 }}>
          {data?.map((item) => (
            <Grid item md={3} key={item._id} sx={{ position: "relative" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: "95%",
                  gap: 2,
                  position: "relative",
                  top: 235,
                  zIndex: 10,
                }}
              >
                <Tooltip title="Edit">
                  <Box
                    sx={{
                      width: 25,
                      height: 25,
                      background: Colors.yellow,
                      borderRadius: 12,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <EditIcon
                      fontSize="small"
                      onClick={() => handleEdit(item)}
                    />
                  </Box>
                </Tooltip>
                <Tooltip title="Delete">
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      background: Colors.red,
                      borderRadius: 12,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DeleteForeverIcon
                      color="White"
                      fontSize="small"
                      onClick={() => {
                        setModalOpen(true);
                        setSelectedActor(item);
                      }}
                    />
                  </Box>
                </Tooltip>
              </Box>

              <Box>
                <img
                  src={
                    item?.image
                      ? `/${item?.image?.name}`
                      : "/default-profile.jpg"
                  }
                  width={240}
                  height={240}
                  style={{ objectFit: "cover" }}
                />

                <Typography variant="subtitle1" gutterBottom>
                  {item.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  height: 40,
                  ml: 1.5,
                  bottom: 77,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "92%",
                  background:
                    "linear-gradient(0deg,rgba(29,29,29,.7) 0,rgba(29,29,29,.7) 40%,rgba(29,29,29,0) 100%)",
                }}
              ></Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <DeleteModal
        open={modalOpen}
        handleClose={hanldeClose}
        onDelete={handleDeleteActor}
        item={selectedActor}
        errorMessage={errorMessage}
      />
      {selectedActor?.name?.length !== 0 ? (
        <ActorGenreLanguageCreateModal
          open={openModal}
          onClose={handleCloseModal}
          onChange={handleChangeActor}
          onCreate={handleUpdateActor}
          data={selectedActor}
          isLoading={false}
          openSnackBar={state.openSnackBar}
          error={actorError}
          type="actor"
          isEditMode
        />
      ) : null}
      {state?.openSnackBar ? (
        <Snack
          vertical={state?.vertical}
          horizontal={state?.horizontal}
          openSnackBar={state?.openSnackBar}
          onCloseSnackBar={() => setState({ ...state, openSnackBar: false })}
          message={state?.message}
        />
      ) : null}
    </Box>
  );
}
