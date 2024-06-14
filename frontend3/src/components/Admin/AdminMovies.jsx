import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import CustomTable from "./CustomTable";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import { useNavigate } from "react-router-dom";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  async function getMovies() {
    try {
      const { data } = await restClient.get(`${SERVER}/movies`);
      setMovies(data.movies);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);
  const tableHeaders = movies.length !== 0 ? Object.keys(movies[0]) : [];
  tableHeaders[9] = "Stock";
  tableHeaders[10] = "Fee";
  tableHeaders[11] = "Action";

  return (
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate(`/admin/movies/create`)}
          sx={{ marginBottom: 3, position: "relative", marginLeft: "92%" }}
        >
          Create
        </Button>
        {movies.length !== 0 ? (
          <Box>
            <CustomTable
              tableHeaders={tableHeaders}
              items={movies}
              type="movies"
            />
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <h1>No Movies Right Now!</h1>
          </Box>
        )}
      </Box>
    </Box>
  );
}
