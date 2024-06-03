import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import MovieCard from "./MovieCard";

const PAGE_SIZE = 10;

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [metaData, setMetaData] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  async function getMovies(page) {
    try {
      const { data } = await restClient.get(
        `${SERVER}/movies?pageSize=${PAGE_SIZE}&page=${page}`
      );
      setMovies(data.movies);
      setMetaData(data.metaData);
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    getMovies(page);
  }, []);

  async function handleClick(id) {
    navigate(`/movies/${id}`, { state: { id } });
  }

  async function handlePaginate(e, value) {
    setPage(value);
    getMovies(value);
  }

  return (
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}

      <Box
        sx={{
          display: "flex",
          gap: 5,
          marginTop: 20,
          flexWrap: "wrap",
          flexGrow: 5,
          justifyContent: "flex-start",
          alignItems: "center",
          width: "90%",
          ml: "8%",
        }}
      >
        {movies.map((item) => (
          <MovieCard item={item} handleClick={handleClick} key={item._id} />
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
