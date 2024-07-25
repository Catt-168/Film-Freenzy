import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import GenericButton from "../Core/GenericButton";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import CustomTable from "./CustomTable";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isDrawerOpen] = useState(localStorage.getItem("navigation") || true);

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

  useEffect(() => {
    console.log("hehe");
  }, [isDrawerOpen]);
  const tableHeaders = movies.length !== 0 ? Object.keys(movies[0]) : [];
  // tableHeaders[9] = "Stock";
  tableHeaders[9] = "Fee";
  tableHeaders[10] = "Action";
  tableHeaders[11] = "";
  tableHeaders[12] = "";

  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}

      <Box sx={{ mt: 7, padding: "2rem" }}>
        <GenericButton
          onClick={() => navigate(`/admin/movies/create`)}
          sx={{ marginBottom: 3, mr: "100%" }}
          text={"Create"}
        />
        {movies.length !== 0 ? (
          <Box sx={{ maxWidth: "100%" }}>
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
