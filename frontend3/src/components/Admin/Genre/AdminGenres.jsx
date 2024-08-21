import React, { useEffect, useState } from "react";
import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import CustomTable from "../CustomTable";
import { Alert, Box, Button, Grid, Snackbar } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import { useNavigate } from "react-router-dom";
import GenericButton from "../../Core/GenericButton";
import { Colors, STATUS_TYPE } from "../../../helpers/constants";
import ActorGenreLanguageCreateModal from "../Actor/ActorGenreLanguageCreateModal";

const errorDefaultState = {
  status: false,
  message: "",
};

export default function AdminGeners() {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [state, setState] = useState({
    openSnackBar: false,
    vertical: "bottom",
    horizontal: "right",
    message: "",
  });
  const { vertical, horizontal, openSnackBar } = state;
  const [genre, setGenre] = useState({ name: "" });
  const [actorStatus, setActorStatus] = useState(STATUS_TYPE.idle);
  const [genreError, setGenreError] = useState({ status: false, message: "" });

  async function getGenres() {
    const { data } = await restClient.get(`${SERVER}/genres`);
    setGenres(data);
  }

  useEffect(() => {
    getGenres();
  }, []);

  function handleChangeGenre(e) {
    const { name, value } = e.target;
    setGenre({ ...genre, [name]: value });
  }

  function handleSubmitGenre() {
    const { name } = genre;

    const isGenreNameValid = name.length >= 3;

    setGenreError(
      isGenreNameValid
        ? errorDefaultState
        : { status: true, message: "Genre must be at least 3 characters" }
    );

    if (!isGenreNameValid) return;
    handleCreateGenre();
  }

  async function handleCreateGenre() {
    setActorStatus(STATUS_TYPE.loading);
    try {
      await restClient.post(`${SERVER}/genres`, {
        name: genre.name,
      });
      getGenres();
      setTimeout(() => {
        setState({
          ...state,
          openSnackBar: true,
          message: "Genre Successfully Added!",
        });
        setGenre({
          name: "",
        });
        setOpenCreateModal(false);
        setActorStatus(STATUS_TYPE.success);
      }, 1000);
    } catch (e) {
      setGenreError({ status: true, message: e.response.data.message });
      setActorStatus(STATUS_TYPE.error);
    }
  }

  function handleClose() {
    setGenre({ name: "" });

    setGenreError(errorDefaultState);

    setOpenCreateModal(false);
  }

  const handleCloseSnackBar = () => {
    setState({ ...state, openSnackBar: false });
  };

  const isActorStatusLoading = actorStatus === STATUS_TYPE.loading;

  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 6.5, flexGrow: 1, padding: "1.3rem" }}>
        <GenericButton
          onClick={() => setOpenCreateModal(true)}
          sx={{ marginBottom: 1.5, ml: "88%" }}
          text={"Create"}
        />
        <Grid container>
          {genres.map((item) => (
            <Grid
              item
              key={item._id}
              xl={6}
              sm={12}
              md={3.82}
              sx={{
                background: Colors.primary,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                color: Colors.textWhite,
                fontWeight: "bold",
                fontSize: 17,
                mr: 2,
                mb: 2,
              }}
            >
              {item.name}
            </Grid>
          ))}
        </Grid>
      </Box>
      <ActorGenreLanguageCreateModal
        open={openCreateModal}
        onClose={handleClose}
        onChange={handleChangeGenre}
        onCreate={handleSubmitGenre}
        data={genre}
        isLoading={isActorStatusLoading}
        openSnackBar={openSnackBar}
        error={genreError}
        type="genre"
      />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={state.openSnackBar}
        onClose={handleCloseSnackBar}
        autoHideDuration={3000}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleCloseSnackBar}
          variant="filled"
          sx={{ width: "100%", background: Colors.primary }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
