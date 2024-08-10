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
    getMovies();
  }, []);

  useEffect(() => {
    console.log("hehe");
  }, [isDrawerOpen]);

  async function handlePaginate(e, value) {
    setPage(value);
    getMovies(value);
  }

  let tableHeaders = movies.length !== 0 ? Object.keys(movies[0]) : [];

  tableHeaders.splice(2, 4);
  // tableHeaders[9] = "Stock";
  tableHeaders[9] = "Price";
  tableHeaders[0] = "Action";
  // tableHeaders[11] = "";
  // tableHeaders[12] = "";

  console.log(tableHeaders);

  tableHeaders.splice(5, 4);

  const isMoviesEmpty = movies.length === 0;
  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}

      <Box sx={{ mt: 7, padding: "2rem" }}>
        <GenericButton
          onClick={() => navigate(`/admin/movies/create`)}
          sx={{ marginBottom: 3, mr: "100%" }}
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
          <Box sx={{ mt: 4 }}>
            <h1>No Movies Right Now!</h1>
          </Box>
        )}
        <Box
          sx={{
            mt: 4,
            display: isMoviesEmpty ? "none" : "flex",
            justifyContent: "flex-start",
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
    </Box>
  );
}
