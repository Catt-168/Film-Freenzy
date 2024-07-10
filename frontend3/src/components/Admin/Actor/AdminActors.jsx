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
import { Colors, STATUS_TYPE } from "../../../helpers/constants";
import restClient from "../../../helpers/restClient";
import DeleteModal from "../DeleteModal";
import Snack from "../Snack";
import ActorGenreLanguageCreateModal from "./ActorGenreLanguageCreateModal";
import useWindowDimensions from "../../hooks/useWindowsDimenstions";

const errorDefaultState = {
  status: false,
  message: "",
};

const defaultActorState = { name: "", image: null };

export default function AdminActors() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { height, width } = useWindowDimensions();

  const [modalOpen, setModalOpen] = useState(false); // confirm modal
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState(defaultActorState);
  const [errorMessage, setErrorMessage] = useState("");

  const [state, setState] = useState({
    openSnackBar: false,
    vertical: "bottom",
    horizontal: "right",
    message: "",
  });
  const [actorStatus, setActorStatus] = useState(STATUS_TYPE.idle);

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
  async function handleSubmitActor() {
    const { name } = selectedActor;

    const isActorNameValid = name.length >= 3;

    setActorError(
      isActorNameValid
        ? errorDefaultState
        : {
            status: true,
            message: "Actor Name must be at least 3 characters",
          }
    );

    if (!isActorNameValid) return;

    handleCreateActor();
  }
  async function handleCreateActor() {
    setActorStatus(STATUS_TYPE.loading);

    const { name, file } = selectedActor;
    const form = new FormData();

    form.append("name", name);
    form.append("file", file);

    try {
      await restClient.post(`${SERVER}/actors`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setTimeout(() => {
        setState({
          ...state,
          openSnackBar: true,
          message: "Actor Successfully Added!",
        });
        setSelectedActor({
          name: "",
          file: null,
        });
        setActorError(errorDefaultState);
        setOpenCreateModal(false);
        setActorStatus(STATUS_TYPE.success);
      }, 1000);
    } catch (e) {
      setActorError({ status: true, message: e.response.data.message });
      setActorStatus(STATUS_TYPE.error);
    }
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
    setSelectedActor(defaultActorState);
    setErrorMessage("");
  }

  function handleEdit(item) {
    setSelectedActor(item);
    setOpenModal(true);
  }

  const isActorStatusLoading = actorStatus === STATUS_TYPE.loading;

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Error!</p>;

  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 7 }}>
        <GenericButton
          onClick={() => setOpenCreateModal(true)}
          sx={{ mr: "89.5%" }}
          text={"Create"}
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
                      mr: 1.3,
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
                  style={{
                    objectFit: "cover",
                    border: "3px solid #126180",
                    borderRadius: 12,
                  }}
                />

                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: Colors.primary, fontWeight: "600" }}
                >
                  {item.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  height: 37,
                  ml: width === 1920 ? 10.4 : 1.3,
                  bottom: 77,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: width === 1920 ? "59%" : "91.5%",
                  borderRadius: 2,
                  overflow: "hidden",
                  background:
                    "linear-gradient(0deg,rgba(29,29,29,.7) 0,rgba(29,29,29,.7) 40%,rgba(29,29,29,0) 100%)",
                }}
              ></Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      {modalOpen ? (
        <DeleteModal
          open={modalOpen}
          handleClose={hanldeClose}
          onDelete={handleDeleteActor}
          item={selectedActor}
          errorMessage={errorMessage}
        />
      ) : null}
      <ActorGenreLanguageCreateModal
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          setSelectedActor(defaultActorState);
          setActorError(errorDefaultState);
        }}
        onChange={handleChangeActor}
        onCreate={handleSubmitActor}
        data={selectedActor}
        isLoading={isActorStatusLoading}
        openSnackBar={state.openSnackBar}
        error={actorError}
        type="actor"
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
