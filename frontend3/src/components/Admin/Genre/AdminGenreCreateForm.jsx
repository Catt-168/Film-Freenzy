import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import TextInput from "../../Input/TextInput";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import GenericButton from "../../Core/GenericButton";

export default function AdminGenreCreateForm() {
  const [genre, setGenre] = useState("");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  async function createGenre() {
    if (genre.length === 0) return alert("Empty String");
    try {
      await restClient.post(`${SERVER}/genres`, {
        name: genre,
      });
      navigate("/admin/genres");
    } catch (e) {
      console.log(e);
    }
  }

  async function updateGenre(id) {
    if (genre.length === 0) return alert("Empty String");
    try {
      await restClient.put(`${SERVER}/genres/${id}`, {
        name: genre,
      });
      navigate("/admin/genres");
    } catch (e) {
      alert("Action cannot be performed due to dependencies errors");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    id ? updateGenre(id) : createGenre();
  }

  async function fetchGenre(id) {
    try {
      const { data } = await restClient.get(`${SERVER}/genres/${id}`);
      setGenre(data.name);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchGenre(id);
  }, [id]);

  return (
    <Box sx={{ padding: "2rem" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 2,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
          ml: "25%",
        }}
      >
        <Typography component="h1" variant="h5" color="black">
          Genre Create Form
        </Typography>
        <TextInput
          id="title"
          label="Genre Title"
          value={genre}
          onChange={(e) => setGenre((prev) => e.target.value)}
        />

        <GenericButton type="submit" text={id ? "Update" : "Create"} />
      </Box>
    </Box>
  );
}
