import React, { useEffect, useState } from "react";
import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import CustomTable from "../CustomTable";
import { Box, Button, Grid } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import { useNavigate } from "react-router-dom";
import GenericButton from "../../Core/GenericButton";
import { Colors } from "../../../helpers/constants";

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

  console.log(genres);

  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 6.5, flexGrow: 1, padding: "1.3rem" }}>
        <GenericButton
          onClick={() => navigate(`/admin/genres/create`)}
          sx={{ marginBottom: 1.5, ml: "88%" }}
          text={"Create"}
        />
        <Grid container>
          {genres.map((item) => (
            <Grid
              item
              key={item._id}
              xl={6}
              sm={12}
              md={3.82}
              sx={{
                background: Colors.primary,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                color: Colors.textWhite,
                fontWeight: "bold",
                fontSize: 17,
                mr: 2,
                mb: 2,
              }}
            >
              {item.name}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
