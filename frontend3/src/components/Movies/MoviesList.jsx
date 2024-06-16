import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import MovieCard from "./MovieCard";
import { capitalizeFirstLetter } from "../../helpers/textHelper";

const PAGE_SIZE = 10;
const FILTER_CATEGORIES = ["genre", "rating", "year", "language"];
const FILTER_YEAR = [
  { id: 0, title: "All", value: "All", till: "" },
  { id: 1, title: "2024", value: "2024", till: "" },
  { id: 2, title: "2023", value: "2023", till: "" },
  { id: 3, title: "2022", value: "2022", till: "" },
  { id: 4, title: "2021", value: "2021", till: "" },
  { id: 5, title: "2020", value: "2020", till: "" },
  { id: 6, title: "2010-2019", value: "2010", till: "2019" },
  { id: 7, title: "2000-2009", value: "2000", till: "2009" },
  { id: 8, title: "1990-1999", value: "1990", till: "1999" },
  { id: 9, title: "1980-1989", value: "1980", till: "1989" },
];
const FILTER_RATING = ["All", 0, 1, 2, 3, 4, 5];
const FILTER_GENRE = { _id: "1", name: "All" };
const FILTER_LANGUAGE = { _id: "1", language: "All" };

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [metaData, setMetaData] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState({
    genre: [],
    language: [],
  });
  const [filter, setFilter] = useState({
    genre: "",
    rating: "",
    year: {
      value: "",
      till: "",
    },
    language: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name !== "year") return setFilter({ ...filter, [name]: value });

    if (name === "year") {
      const filter_year = FILTER_YEAR.find((item) => item.value === value);
      setFilter({
        ...filter,
        year: { value: filter_year.value, till: filter_year.till },
      });
    }
  };

  async function getFilterCategories() {
    const { data } = await restClient.get(`${SERVER}/genres`);
    const response = await restClient.get(`${SERVER}/languages`);

    setCategories({
      ...categories,
      genre: [FILTER_GENRE, ...data],
      language: [FILTER_LANGUAGE, ...response.data],
    });
  }

  async function getMovies(
    page,
    searchText,
    genre,
    rating,
    yearStart,
    yearEnd,
    language
  ) {
    try {
      const { data } = await restClient.get(
        `${SERVER}/movies?pageSize=${PAGE_SIZE}&page=${page}&genre=${genre}&language=${language}&rating=${rating}&yearStart=${yearStart}&yearEnd=${yearEnd}&title=${searchText}`
      );
      setMovies(data.movies);
      setMetaData(data.metaData);
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    getMovies(page, searchText, "", "", "", "", "");
    getFilterCategories();
  }, []);

  async function handleClick(id) {
    navigate(`/movies/${id}`, { state: { id } });
  }

  async function handlePaginate(e, value) {
    const { genre, rating, year, language } = filter;
    setPage(value);
    getMovies(
      value,
      searchText,
      genre,
      rating,
      year.value,
      year.till,
      language
    );
  }

  function handleFilter() {
    const { genre, rating, year, language } = filter;
    const isDisabledSearch =
      searchText.length === 0 &&
      filter.genre.length === 0 &&
      filter.language.length === 0 &&
      filter.rating.length === 0 &&
      filter.year.value.length === 0;

    getMovies(
      isDisabledSearch ? page : 1,
      searchText,
      genre,
      rating,
      year.value,
      year.till,
      language
    );
    if (!isDisabledSearch) setPage(1);
  }

  function handleReset() {
    const isDisabledSearch =
      searchText.length === 0 &&
      filter.genre.length === 0 &&
      filter.language.length === 0 &&
      filter.rating.length === 0 &&
      filter.year.value.length === 0;

    if (isDisabledSearch) return;
    setSearchText("");
    setFilter({
      genre: "",
      rating: "",
      year: {
        value: "",
        till: "",
      },
      language: "",
    });
    getMovies(page, "", "", "", "", "", "");
    // setPage(1);
  }

  function generateMenuItems(category) {
    if (category === "genre")
      return categories?.genre?.map((genre) => (
        <MenuItem value={genre.name} key={genre._id}>
          {genre.name}
        </MenuItem>
      ));

    if (category === "rating")
      return FILTER_RATING?.map((rating) => (
        <MenuItem value={rating} key={rating}>
          {rating}
        </MenuItem>
      ));

    if (category === "year")
      return FILTER_YEAR.map((year) => (
        <MenuItem value={year.value} key={year.id}>
          {year.title}
        </MenuItem>
      ));

    if (category === "language")
      return categories?.language?.map((language) => (
        <MenuItem value={language.language} key={language._id}>
          {language.language}
        </MenuItem>
      ));
  }

  const isMoviesEmpty = movies.length === 0;

  return (
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ marginTop: 5 }}>
        <TextField
          id="outlined-basic"
          label="Search Movies"
          variant="outlined"
          sx={{ width: "84%" }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </Box>
      <Box sx={{ display: "flex", ml: "8%", mt: 3, gap: 5 }}>
        {FILTER_CATEGORIES.map((category) => (
          <FormControl key={category}>
            <InputLabel id="demo-simple-select-label">
              {capitalizeFirstLetter(category)}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={
                category === "year" ? filter[category].value : filter[category]
              }
              label={category}
              onChange={handleChange}
              name={category}
              sx={{ width: 180 }}
            >
              {generateMenuItems(category)}
            </Select>
          </FormControl>
        ))}
        <Button
          variant="contained"
          size="large"
          sx={{ width: 140 }}
          onClick={handleFilter}
        >
          Search
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{ width: 140 }}
          onClick={handleReset}
          color="error"
        >
          Reset
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 5,
          flexWrap: "wrap",
          marginTop: 13,
          flexGrow: 5,
          justifyContent: "flex-start",
          alignItems: "center",
          width: "90%",
          ml: "8%",
        }}
      >
        {isMoviesEmpty ? (
          <Typography variant="h3" sx={{ textAlign: "center", width: "100%" }}>
            Sorry, No Movies!
          </Typography>
        ) : (
          movies.map((item) => (
            <MovieCard item={item} handleClick={handleClick} key={item._id} />
          ))
        )}
      </Box>
      <Box
        sx={{
          display: isMoviesEmpty ? "none" : "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          page={page}
          count={metaData.totalPages}
          onChange={handlePaginate}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
}
