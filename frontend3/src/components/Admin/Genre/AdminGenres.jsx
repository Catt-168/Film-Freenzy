import React, { useEffect, useState } from "react";
import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import CustomTable from "../CustomTable";
import { Box, Button } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import { useNavigate } from "react-router-dom";
import GenericButton from "../../Core/GenericButton";

export default function AdminGeners() {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  async function getUsers() {
    const { data } = await restClient.get(`${SERVER}/genres`);
    setGenres(data);
  }

  useEffect(() => {
    getUsers();
  }, []);
  const tableHeaders = genres.length !== 0 ? Object.keys(genres[0]) : [];
  tableHeaders[2] = "Action";
  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 7, flexGrow: 1, padding: "2rem" }}>
        <GenericButton
          onClick={() => navigate(`/admin/genres/create`)}
          sx={{ marginBottom: 3, mr: "100%" }}
          text={"Create"}
        />
        <CustomTable tableHeaders={tableHeaders} items={genres} type="genres" />
      </Box>
    </Box>
  );
}
