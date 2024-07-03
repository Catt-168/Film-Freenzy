import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import {
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
import { Colors, STATUS_TYPE } from "../../helpers/constants";
import restClient from "../../helpers/restClient";
import { capitalizeFirstLetter } from "../../helpers/textHelper";
import GenericButton from "../Core/GenericButton";
import LoadingSpinner from "../Core/LoadingSpinner";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import useAuth from "../hooks/useAuth";
import MovieCard from "./MovieCard";

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
  const [status, setStatus] = useState(STATUS_TYPE.idle);
  const { isAuthenticated, user } = useAuth();
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
    setStatus(STATUS_TYPE.loading);
    try {
      const { data } = await restClient.get(
        `${SERVER}/movies?pageSize=${PAGE_SIZE}&page=${page}&genre=${genre}&language=${language}&rating=${rating}&yearStart=${yearStart}&yearEnd=${yearEnd}&title=${searchText}`
      );
      const allMovies = [...data.movies, ...data.moviesWithActors];
      setMovies(allMovies);
      setMetaData(data.metaData);
      setStatus(STATUS_TYPE.success);
    } catch (e) {
      console.warn(e);
      setStatus(STATUS_TYPE.error);
    }
  }

  useEffect(() => {
    const filteredValues = localStorage.getItem("filter");
    const currentPage = localStorage.getItem("page");
    const pagination = !currentPage ? page : parseInt(currentPage);
    const storageSearchText = localStorage.getItem("search");
    const currentSearchText = !storageSearchText ? "" : storageSearchText;
    setPage(pagination);
    setSearchText(currentSearchText);
    getFilterCategories();

    const isDisableFilterValues = !filteredValues;

    if (!!filteredValues) {
      setFilter(JSON.parse(filteredValues));
      getMovies(
        isDisableFilterValues ? pagination : 1,
        currentSearchText,
        JSON.parse(filteredValues).genre,
        JSON.parse(filteredValues).rating,
        JSON.parse(filteredValues).year.value,
        JSON.parse(filteredValues).year.till,
        JSON.parse(filteredValues).language
      );
    } else getMovies(pagination, currentSearchText, "", "", "", "", "");
  }, []);

  async function handleClick(id) {
    localStorage.setItem("page", page);
    navigate(`/movies/${id}`, { state: { id } });
  }

  async function handlePaginate(e, value) {
    const { genre, rating, year, language } = filter;
    setPage(value);
    localStorage.setItem("page", value);
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

  function filterSaveStorage(isDisabledSearch) {
    const oldPagination = localStorage.getItem("oldPage");
    if (!isDisabledSearch) {
      localStorage.setItem("search", searchText);
      localStorage.setItem("page", page);
      !oldPagination && localStorage.setItem("oldPage", page); // if old pagination exist, don't update
      localStorage.setItem("filter", JSON.stringify(filter));
    }
  }

  function handleFilter() {
    const { genre, rating, year, language } = filter;
    const isDisabledSearch =
      searchText.length === 0 &&
      filter.genre.length === 0 &&
      filter.language.length === 0 &&
      filter.rating.length === 0 &&
      filter.year.value.length === 0;

    filterSaveStorage(isDisabledSearch);

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
    resetValues();
    // setPage(1);
  }

  function removeFromStorage() {
    localStorage.removeItem("oldPage");
    localStorage.removeItem("search");
    localStorage.removeItem("filter");
  }

  function fetchFromCurrentPagination() {
    const currentPage = localStorage.getItem("page");
    const oldPage = localStorage.getItem("oldPage");
    !!oldPage && localStorage.setItem("page", parseInt(oldPage));
    return !!oldPage
      ? parseInt(oldPage)
      : !currentPage
      ? page
      : parseInt(currentPage);
  }
  function resetValues() {
    const pagination = fetchFromCurrentPagination();
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
    setPage(pagination);
    getMovies(pagination, "", "", "", "", "", "");
    removeFromStorage();
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

  const handleKeyDown = (event) => {
    const isDisabledSearch =
      searchText.length === 0 &&
      filter.genre.length === 0 &&
      filter.language.length === 0 &&
      filter.rating.length === 0 &&
      filter.year.value.length === 0;

    if (event.key === "Enter") {
      if (isDisabledSearch) return resetValues();
      handleFilter();
    }
  };

  const isLoading = status === STATUS_TYPE.loading;
  const isSuccess = status === STATUS_TYPE.success;
  const isMoviesEmpty = movies.length === 0;

  return (
    <Box onKeyDown={handleKeyDown}>
      {user?.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      {/* <Box sx={{ marginTop: 5 }}>
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
      </Box> */}
      <Box sx={{ display: "flex", ml: "8%", marginTop: 6, gap: 4.7 }}>
        <TextField
          id="outlined-basic"
          label="Search Movies..."
          variant="outlined"
          sx={{ width: 208 }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />

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
              sx={{ width: 130, height: 55 }}
            >
              {generateMenuItems(category)}
            </Select>
          </FormControl>
        ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
            ml: 3.2,
          }}
        >
          <GenericButton
            onClick={handleFilter}
            sx={{ width: 10, height: 50 }}
            text={<SearchIcon size={60} />}
            tooltipTitle="Filter"
          />

          <GenericButton
            hoverColor={Colors.yellow}
            sx={{
              width: 10,
              height: 50,
              background: Colors.yellow,
            }}
            onClick={handleReset}
            text={
              <ReplayIcon
                size={60}
                color={"BlueSapphire"}
                sx={{
                  padding: "10",
                }}
              />
            }
            isError={true}
            tooltipTitle="Reset"
          />
        </Box>
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
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <LoadingSpinner />
          </Box>
        ) : isMoviesEmpty ? (
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
          display: isMoviesEmpty || isLoading ? "none" : "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          page={page}
          count={metaData.totalPages}
          onChange={handlePaginate}
          shape="rounded"
          color={"BlueSapphire"}
        />
      </Box>
    </Box>
  );
}
