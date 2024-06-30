import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Rating,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import TextInput from "../Input/TextInput";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import GenericButton from "../Core/GenericButton";
import { Colors, STATUS_TYPE } from "../../helpers/constants";
import LoadingSpinner from "../Core/LoadingSpinner";
import ActorCreateModal from "../Admin/Actor/ActorCreateModal";

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

export default function MovieCreateForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const categories = [
    { id: 1, name: "blog" },
    { id: 2, name: "music" },
    { id: 3, name: "video" },
  ];
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const [fData, setFData] = useState({
    title: "",
    description: "",
    genres: [],
    rating: 0,
    length: 0,
    releasedYear: 0,
    dailyRentalRate: 0,
    file: null,
    numberInStock: 0,
    language: [],
    actors: [],
  });
  const [status, setStatus] = useState("idle");
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [actors, setActors] = useState([]);
  const [open, setOpen] = useState(false); // actor modal
  const [actor, setActor] = useState({
    name: "",
    file: null,
  });
  const [actorStatus, setActorStatus] = useState(STATUS_TYPE.idle);
  const [state, setState] = useState({
    openSnackBar: false,
    vertical: "bottom",
    horizontal: "right",
  });
  const { vertical, horizontal, openSnackBar } = state;

  const handleOpenSnackBar = () => () => {
    setState({ ...state, openSnackBar: true });
  };

  const handleCloseSnackBar = () => {
    setState({ ...state, openSnackBar: false });
  };

  function handleChange(e) {
    const { name, value, files } = e.target;
    setFData({
      ...fData,
      [name]: files ? files[0] : value,
    });
  }

  function handleChangeGenre(event) {
    const {
      target: { value },
    } = event;
    console.log(value);
    setFData({
      ...fData,
      genres: typeof value === "string" ? value.split(",") : value,
    });
  }

  function handleChangeLanguage(e) {
    const {
      target: { value },
    } = e;

    setFData({
      ...fData,
      language: typeof value === "string" ? value.split(",") : value,
    });
  }

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
      dailyRentalRate,
      length,
      numberInStock,
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
    form.append("dailyRentalRate", dailyRentalRate);
    form.append("length", length);
    form.append("numberInStock", numberInStock);
    language?.forEach((g) => {
      form.append("language[]", g);
    });
    actors?.forEach((actor) => {
      form.append("actor[]", actor.name);
    });
    try {
      await restClient.post(`${SERVER}/movies`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/movies");
    } catch (e) {
      console.log(e);
      alert("Please Fill all the values");
    }
  }

  function handleClose() {
    setActor({
      name: "",
      file: null,
    });
    setOpen((prev) => !prev);
  }

  function handleChangeActor(e) {
    const { name, value, files } = e.target;
    setActor({ ...actor, [name]: files ? files[0] : value });
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
        setState({ ...state, openSnackBar: true });
        setActor({
          name: "",
          file: null,
        });
        setActorStatus(STATUS_TYPE.success);
      }, 1000);
    } catch (e) {
      console.log(e.response.data.message);
      setActorStatus(STATUS_TYPE.error);
    }
  }

  useEffect(() => {
    setStatus("loading");
    fetchGenre();
    fetchLanguages();
    fetchActors();
  }, []);

  const isActorStatusLoading = actorStatus === STATUS_TYPE.loading;
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
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
          ml: "25%",
        }}
      >
        <Typography component="h1" variant="h5" color="black">
          Movie Create Form
        </Typography>
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
          {fData.file ? fData.file.name : "Upload Image"}
          <VisuallyHiddenInput
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
          />
        </Button>
        <TextInput
          id="numberInStock"
          label="Number InStock"
          value={fData.numberInStock}
          onChange={handleChange}
        />
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
        <TextInput
          id="dailyRentalRate"
          label="Daily Rental Rate"
          value={fData.dailyRentalRate}
          onChange={handleChange}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: 6,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Rating
          </Typography>
          <Rating
            value={fData.rating}
            defaultValue={1}
            precision={0.5}
            id="rating"
            sx={{ mb: 1 }}
            onChange={(event, newValue) => {
              setFData((prev) => {
                return { ...prev, rating: newValue };
              });
            }}
          />
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
          <Typography variant="h6" gutterBottom mr={4}>
            Genre[s]
          </Typography>

          <Select
            fullWidth
            multiple
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            value={fData.genres}
            onChange={handleChangeGenre}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {genres.map((genre) => (
              <MenuItem key={genre._id} value={genre.name}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
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
          <Typography variant="h6" gutterBottom>
            Language[s]
          </Typography>
          <Select
            fullWidth
            multiple
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            value={fData.language}
            onChange={handleChangeLanguage}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {languages.map((item) => (
              <MenuItem key={item._id} value={item.language}>
                {item.language}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* <Button variant="contained" size="medium" type="submit">
          Submit
        </Button> */}
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
          <Typography variant="h6" gutterBottom>
            Actor[s]
          </Typography>
          <Autocomplete
            multiple
            value={fData.actors}
            sx={{ ml: 5.3, width: "80%" }}
            onChange={(event, newValue) => {
              setFData({ ...fData, actors: newValue });
            }}
            filterSelectedOptions
            id="category-filter"
            options={actors}
            getOptionLabel={(option) => option?.name}
            isOptionEqualToValue={(option, value) => {
              if (option._id === value._id) return option._id === value._id;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Actors" placeholder="" />
            )}
          />
          <Tooltip title="Add a Actor">
            <IconButton
              aria-label="Add"
              color={"White"}
              onClick={() => setOpen(true)}
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

          {/* <GenericButton
            type={null}
            startIcon={<PersonAddIcon />}
            text="Actor"
            size="lg"
            sx={{ height: 53 }}
          /> */}
        </Box>
        <GenericButton type="submit" text="Submit" />
      </Box>
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
            onChange={handleChangeActor}
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
              onChange={handleChange}
            />
          </Button>
          <GenericButton
            text={
              isActorStatusLoading ? (
                <LoadingSpinner color={"White"} size={25} />
              ) : (
                "Save"
              )
            }
            sx={{ width: "30%", ml: 13 }}
            onClick={handleCreateActor}
          />
        </Box>
      </Modal> */}
      <ActorCreateModal
        open={open}
        onClose={handleClose}
        onChangeActor={handleChangeActor}
        onCreateActor={handleCreateActor}
        actor={actor}
        isLoading={isActorStatusLoading}
        openSnackBar={openSnackBar}
        closeSnackBar={handleCloseSnackBar}
        vertical={vertical}
        horizontal={horizontal}
      />
    </Box>
  );
}
