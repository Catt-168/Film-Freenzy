import { Box, Pagination } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import GenericButton from "../Core/GenericButton";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import CustomTable from "./CustomTable";

const PAGE_SIZE = 10;

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isDrawerOpen] = useState(localStorage.getItem("navigation") || true);

  async function getMovies(page) {
    try {
      const { data } = await restClient.get(
        `${SERVER}/movies?pageSize=${PAGE_SIZE}&page=${page}`
      );
      setMovies(data.movies);
      setMetaData(data.metaData);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  useEffect(() => {
    getMovies(page);
  }, [page]);

  async function handlePaginate(e, value) {
    setPage(value);
    getMovies(value);
  }

  let tableHeaders = movies.length !== 0 ? Object.keys(movies[0]) : [];

  tableHeaders.splice(3, 3); // Adjust headers as needed
  tableHeaders[4] = "Price";
  tableHeaders[0] = "Action";
  tableHeaders.splice(5, 4);
  tableHeaders[4] = "Released Year";
  tableHeaders[5] = "Price";
  tableHeaders[6] = "Language";

  const isMoviesEmpty = movies.length === 0;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}

      <Box sx={{ mt: 7, padding: "1rem", flexGrow: 1 }}>
        <GenericButton
          onClick={() => navigate(`/admin/movies/create`)}
          sx={{
            marginBottom: 1,
            ml: "auto",
            display: "block",
            width: "fit-content",
            fontSize: "0.8rem",
            padding: "0.5rem 1rem",
          }}
          text={"Create"}
        />
        {!isMoviesEmpty ? (
          <Box sx={{ maxWidth: "100%" }}>
            <CustomTable
              tableHeaders={tableHeaders}
              items={movies}
              type="movies"
            />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <h1 style={{ fontSize: "1rem" }}>No Movies Right Now!</h1>
          </Box>
        )}
        <Box
          sx={{
            mt: 2,
            display: isMoviesEmpty ? "none" : "flex",
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            page={page}
            count={Math.ceil(metaData.totalItems / PAGE_SIZE)}
            onChange={handlePaginate}
            shape="rounded"
            color={"BlueSapphire"}
            size="small" // Smaller pagination
          />
        </Box>
      </Box>
    </Box>
  );
}
