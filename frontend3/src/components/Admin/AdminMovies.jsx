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

const PAGE_SIZE = 5;
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
  }, []);

  async function handlePaginate(e, value) {
    setPage(value);
    getMovies(value);
  }

  let tableHeaders = movies.length !== 0 ? Object.keys(movies[0]) : [];

  tableHeaders.splice(3, 3);
  // tableHeaders[9] = "Stock";
  tableHeaders[4] = "Price";
  tableHeaders[0] = "Action";

  // tableHeaders[11] = "";
  // tableHeaders[12] = "";
  tableHeaders.splice(5, 4);
  tableHeaders[4] = "Released Year";
  tableHeaders[5] = "Price";
  tableHeaders[6] = "Language";

  const isMoviesEmpty = movies.length === 0;

  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}

      <Box sx={{ mt: 6.5, padding: "1.3rem" }}>
        <GenericButton
          onClick={() => navigate(`/admin/movies/create`)}
          sx={{ marginBottom: 2, ml: "91.5%" }}
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
            justifyContent: "flex-end",
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
