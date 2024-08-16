import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Autocomplete,
  Chip,
  IconButton,
  MenuItem,
  Rating,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RedditIcon from "@mui/icons-material/Reddit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import TextInput from "../Input/TextInput";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import LanguageIcon from "@mui/icons-material/Language";
import { Colors, STATUS_TYPE } from "../../helpers/constants";
import ActorGenreLanguageCreateModal from "./Actor/ActorGenreLanguageCreateModal";
import { capitalizeFirstLetter } from "../../helpers/textHelper";
import GenericButton from "../Core/GenericButton";

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

const errorDefaultState = {
  status: false,
  message: "",
};

const modalDefaultState = {
  genre: false,
  language: false,
  actor: false,
};

export default function AdminMovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [fData, setFData] = useState({
    title: "",
    description: "",
    genres: [],
    rating: 0,
    length: 0,
    releasedYear: 0,
    price: 0,
    file: null,
    // numberInStock: 0,
    language: [],
    trailerLink: "",
    actors: [],
  });
  const [status, setStatus] = useState("idle");
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [modalOpen, setModalOpen] = useState(modalDefaultState);
  const [actorStatus, setActorStatus] = useState(STATUS_TYPE.idle);
  const [state, setState] = useState({
    openSnackBar: false,
    vertical: "bottom",
    horizontal: "right",
    message: "",
  });
  const { vertical, horizontal, openSnackBar } = state;
  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState({
    name: "",
    file: null,
  });
  const [genre, setGenre] = useState({ name: "" });
  const [language, setLanguage] = useState({ name: "" });

  const [genreError, setGenreError] = useState({ status: false, message: "" });
  const [actorError, setActorError] = useState({ status: false, message: "" });
  const [languageError, setLanguageError] = useState({
    status: false,
    message: "",
  });

  function handleChange(e) {
    const { name, value, files } = e.target;
    setFData({
      ...fData,
      [name]: files ? files[0] : value,
    });
  }

  // function handleChangeLanguage(e) {
  //   const {
  //     target: { value },
  //   } = e;

  //   setFData({
  //     ...fData,
  //     language: typeof value === "string" ? value.split(",") : value,
  //   });
  // }
  function handleChangeLanguage(e) {
    const { name, value } = e.target;
    setLanguage({ ...genre, [name]: value });
  }

  function handleChangeGenre(e) {
    const { name, value } = e.target;
    setGenre({ ...genre, [name]: value });
  }

  // function handleChangeGenre(event) {
  //   const {
  //     target: { value },
  //   } = event;

  //   setFData({
  //     ...fData,
  //     genres: typeof value === "string" ? value.split(",") : value,
  //   });
  // }

  async function fetchGenre() {
    try {
      const { data } = await restClient.get(`${SERVER}/genres`);
      setGenres(data);
    } catch (e) {
      console.log(e);
    } finally {
      setStatus("success");
    }
  }

  async function fetchLanguages() {
    try {
      const { data } = await restClient.get(`${SERVER}/languages`);
      setLanguages(data);
    } catch (e) {
      console.log(e);
    } finally {
      setStatus("success");
    }
  }

  async function fetchActors() {
    try {
      const { data } = await restClient.get(`${SERVER}/actors`);
      setActors(data);
    } catch (e) {
      console.log(e);
    } finally {
      setStatus("success");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const {
      title,
      description,
      file,
      genres,
      rating,
      releasedYear,
      price,
      length,
      // numberInStock,
      language,
      actors,
    } = fData;

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("file", file);
    genres?.forEach((g) => {
      form.append("genre[]", g);
    });
    form.append("rating", rating);
    form.append("releasedYear", releasedYear);
    form.append("price", price);
    form.append("length", length);
    // form.append("numberInStock", numberInStock);
    language?.forEach((g) => {
      form.append("language[]", g);
    });
    actors?.forEach((actor) => {
      form.append("actor[]", actor);
    });

    if (!price) return alert("Please Fill Daily Rental Rate");

    try {
      const response = await restClient.put(`${SERVER}/movies/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status !== 200) return;
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/admin/movies");
      }, 1500);
    } catch (e) {
      alert(e.response.data.message);
      console.log(e.response.data.message);
    }
  }
  async function fetchMovie(id) {
    try {
      const { data } = await restClient.get(`${SERVER}/movies/${id}`);
      const {
        title,
        description,
        // numberInStock,
        price,
        rating,
        genre,
        releasedYear,
        length,
        language,
        actor,
        trailerLink,
      } = data;

      setFData({
        ...fData,
        title,
        trailerLink,
        description,
        // numberInStock,
        price,
        length,
        rating,
        releasedYear,
        genres: genre.map((item) => item.name),
        language: language.map((item) => item.language),
        actors: actor.map((item) => item.name),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setStatus("success");
    }
  }

  function hanldeOpenModal(key) {
    setModalOpen((prev) => {
      return { ...prev, [key]: true };
    });
  }
  function handleClose() {
    setActor({
      name: "",
      file: null,
    });
    setGenre({ name: "" });
    setLanguage({ name: "" });
    setActorError(errorDefaultState);
    setGenreError(errorDefaultState);
    setLanguageError(errorDefaultState);
    setModalOpen(modalDefaultState);
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
      fetchGenre();
      setTimeout(() => {
        setState({
          ...state,
          openSnackBar: true,
          message: "Genre Successfully Added!",
        });
        setGenre({
          name: "",
        });
        setModalOpen(modalDefaultState);
        setActorStatus(STATUS_TYPE.success);
      }, 1000);
    } catch (e) {
      setGenreError({ status: true, message: e.response.data.message });
      setActorStatus(STATUS_TYPE.error);
    }
  }

  const handleCloseSnackBar = () => {
    setState({ ...state, openSnackBar: false });
  };

  function handleSubmitLangauge() {
    const { name } = language;

    const isLanguageValid = name.length >= 4;

    setLanguageError(
      isLanguageValid
        ? errorDefaultState
        : { status: true, message: "Language must be at least 4 characters" }
    );

    if (!isLanguageValid) return;
    handleCreateLanguage();
  }

  async function handleCreateLanguage() {
    setActorStatus(STATUS_TYPE.loading);
    try {
      await restClient.post(`${SERVER}/languages`, {
        language: language.name,
      });
      fetchLanguages();
      setTimeout(() => {
        setState({
          ...state,
          openSnackBar: true,
          message: "Language Successfully Added!",
        });
        setLanguage({
          name: "",
        });
        setModalOpen(modalDefaultState);
        setActorStatus(STATUS_TYPE.success);
      }, 1000);
    } catch (e) {
      setLanguageError({ status: true, message: e.response.data.message });
      console.log(e);
    }
  }

  function handleChangeActor(e) {
    const { name, value, files } = e.target;
    setActor({ ...actor, [name]: files ? files[0] : value });
  }

  async function handleSubmitActor() {
    const { name } = actor;

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

    const { name, file } = actor;
    const form = new FormData();

    form.append("name", name);
    form.append("file", file);

    try {
      await restClient.post(`${SERVER}/actors`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchActors();
      setTimeout(() => {
        setState({
          ...state,
          openSnackBar: true,
          message: "Actor Successfully Added!",
        });
        setActor({
          name: "",
          file: null,
        });
        setModalOpen(modalDefaultState);
        setActorStatus(STATUS_TYPE.success);
      }, 1000);
    } catch (e) {
      setActorError({ status: true, message: e.response.data.message });
      setActorStatus(STATUS_TYPE.error);
    }
  }

  useEffect(() => {
    setStatus((prev) => "loading");
    fetchMovie(id);
    fetchLanguages();
    fetchGenre();
    fetchActors();
  }, []);

  const isActorStatusLoading = actorStatus === STATUS_TYPE.loading;

  console.log(fData);
  return (
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 2,
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          ml: "19%",
        }}
      >
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={"Movie Successfully Updated!"}
        />
        <Typography
          component="h1"
          variant="h5"
          color="black"
          sx={{ color: Colors.primary , fontWeight: 'bold' }}
        >
          Movie Edit Form
        </Typography>
        <Box sx={{ display: "flex", gap: 3, width: "100%"}}>
          <TextInput
            id="title"
            label="Movie Title"
            value={fData.title}
            onChange={handleChange}
          />
          <TextInput
            id="description"
            label="Movie description"
            value={fData.description}
            onChange={handleChange}
          />
        </Box>

        <Button
          component="label"
          role={undefined}
          fullWidth
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2, mt: 2, background: Colors.primary }}
        >
          {fData.file ? fData.file.name : "Upload Image"}
          <VisuallyHiddenInput
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
          />
        </Button>
        {/* <TextInput
          id="numberInStock"
          label="Number InStock"
          value={fData.numberInStock}
          onChange={handleChange}
        /> */}
        <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
          <TextInput
            id="length"
            label="Movie Length"
            value={fData.length}
            onChange={handleChange}
          />
          <TextInput
            id="releasedYear"
            label="Movie Released Year"
            value={fData.releasedYear}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
          <TextInput
            id="trailerLink"
            label="Movie Trailer Link"
            value={fData.trailerLink}
            onChange={handleChange}
          />
          <TextInput
            id="price"
            label="Movie Price"
            value={fData.price}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 3,
            mt: 2.5,
            mb: 2,
          }}
        >
          <Autocomplete
            multiple
            fullWidth
            value={fData?.genres}
            onChange={(event, newValue) => {
              setFData({
                ...fData,
                genres: newValue.map((item) => (item?.name ? item.name : item)),
              });
            }}
            filterSelectedOptions
            id="category-filter"
            options={genres.filter((g) => !fData?.genres.includes(g.name))}
            getOptionLabel={(option) => option.name ?? option}
            isOptionEqualToValue={(option, value) => {
              if (option._id === value._id) {
                return option._id === value._id;
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Genres"
                placeholder="Select genre of the movie"
              />
            )}
          />
          <Tooltip title="Add Genre">
            <IconButton
              aria-label="Add"
              color={"White"}
              onClick={() => hanldeOpenModal("genre")}
              sx={{
                width: 40,
                height: 40,
                background: Colors.primary,
                "&:hover": {
                  background: Colors.darkPrimary,
                },
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 4,
            mt: 1,
            mb: 2,
          }}
        >
          <Autocomplete
            multiple
            fullWidth
            value={fData.language}
            onChange={(event, newValue) => {
              setFData({
                ...fData,
                language: newValue.map((item) => item.language ?? item),
              });
            }}
            filterSelectedOptions
            id="category-filter"
            options={languages.filter(
              (lang) => !fData.language.includes(lang.language)
            )}
            getOptionLabel={(option) =>
              option.language
                ? capitalizeFirstLetter(option?.language)
                : capitalizeFirstLetter(option)
            }
            isOptionEqualToValue={(option, value) => {
              if (option._id === value._id) return option._id === value._id;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Languages"
                placeholder="Select language(s) of the movie"
              />
            )}
          />

          <Tooltip title="Add Language">
            <IconButton
              aria-label="Add"
              color={"White"}
              onClick={() => hanldeOpenModal("language")}
              sx={{
                width: 40,
                height: 40,
                background: Colors.primary,
                "&:hover": {
                  background: Colors.darkPrimary,
                },
              }}
            >
              <RedditIcon />
            </IconButton>
          </Tooltip>
        </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 4,
            mt: 1,
            mb: 2,
          }}
        >
          <Autocomplete
            multiple
            fullWidth
            value={fData.actors}
            onChange={(event, newValue) => {
              setFData({
                ...fData,
                actors: newValue.map((item) => item.name ?? item),
              });
            }}
            filterSelectedOptions
            id="category-filter"
            options={actors.filter(
              (actor) => !fData.actors.includes(actor.name)
            )}
            getOptionLabel={(option) => option?.name ?? option}
            isOptionEqualToValue={(option, value) => {
              if (option._id === value._id) return option._id === value._id;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Actors"
                placeholder="Select actors of the movie"
              />
            )}
          />
          <Tooltip title="Add Actor">
            <IconButton
              aria-label="Add"
              color={"White"}
              onClick={() => hanldeOpenModal("actor")}
              sx={{
                width: 40,
                height: 40,
                background: Colors.primary,
                "&:hover": {
                  background: Colors.darkPrimary,
                },
              }}
            >
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", ml: 1, gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rating
            </Typography>
            <Rating
              value={fData.rating}
              defaultValue={1}
              id="rating"
              sx={{ mt: 0.5 }}
              onChange={(event, newValue) => {
                setFData((prev) => {
                  return { ...prev, rating: newValue };
                });
              }}
            />
          </Box>
          <GenericButton type="submit" text="Submit" />
        </Box>
        </Box>

      </Box>
      <ActorGenreLanguageCreateModal
        open={modalOpen.genre}
        onClose={handleClose}
        onChange={handleChangeGenre}
        onCreate={handleSubmitGenre}
        data={genre}
        isLoading={isActorStatusLoading}
        openSnackBar={openSnackBar}
        error={genreError}
        type="genre"
      />
      <ActorGenreLanguageCreateModal
        open={modalOpen.language}
        onClose={handleClose}
        onChange={handleChangeLanguage}
        onCreate={handleSubmitLangauge}
        data={language}
        isLoading={isActorStatusLoading}
        openSnackBar={openSnackBar}
        error={languageError}
        type="language"
      />
      <ActorGenreLanguageCreateModal
        open={modalOpen.actor}
        onClose={handleClose}
        onChange={handleChangeActor}
        onCreate={handleSubmitActor}
        data={actor}
        isLoading={isActorStatusLoading}
        openSnackBar={openSnackBar}
        error={actorError}
        type="actor"
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
