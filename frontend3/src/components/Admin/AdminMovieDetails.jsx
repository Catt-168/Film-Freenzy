import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Chip,
  MenuItem,
  Rating,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
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
    dailyRentalRate: 0,
    file: null,
    numberInStock: 0,
    language: [],
  });
  const [status, setStatus] = useState("idle");
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setFData({
      ...fData,
      [name]: files ? files[0] : value,
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

  function handleChangeGenre(event) {
    const {
      target: { value },
    } = event;

    setFData({
      ...fData,
      genres: typeof value === "string" ? value.split(",") : value,
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

    if (!dailyRentalRate) return alert("Please Fill Daily Rental Rate");

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
      alert("Please Fill all the values");
      console.log(e);
    }
  }
  async function fetchMovie(id) {
    try {
      const { data } = await restClient.get(`${SERVER}/movies/${id}`);
      const {
        title,
        description,
        numberInStock,
        dailyRentalRate,
        rating,
        genre,
        releasedYear,
        length,
        language,
      } = data;

      setFData({
        ...fData,
        title,
        description,
        numberInStock,
        dailyRentalRate,
        length,
        rating,
        releasedYear,
        genres: genre.map((item) => item.name),
        language: language.map((item) => item.language),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setStatus("success");
    }
  }
  useEffect(() => {
    setStatus((prev) => "loading");
    fetchMovie(id);
    fetchLanguages();
    fetchGenre();
  }, []);

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
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={"Movie Successfully Updated!"}
        />
        <Typography component="h1" variant="h5" color="black">
          Movie Edit Form
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
          sx={{ mb: 2, mt: 2 }}
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
            name="half-rating"
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
        <Button variant="contained" size="medium" type="submit">
          Update
        </Button>
      </Box>
    </Box>
  );
}
