import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import MovieCard from "./MovieCard";
import UserNavigation from "../Navigation/UserNavigation";
import AdminNavigation from "../Navigation/AdminNavigation";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  async function getMovies() {
    try {
      const { data } = await restClient.get(`${SERVER}/movies`);
      setMovies(data);
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  async function handleClick(id) {
    navigate(`/movies/${id}`, { state: { id } });
  }
  console.log(movies);
  return (
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}

      <Box
        sx={{
          display: "flex",
          gap: 3,
          marginTop: 10,
        }}
      >
        {movies.map((item) => (
          <MovieCard item={item} handleClick={handleClick} key={item._id} />
        ))}
      </Box>
    </Box>
  );
}
