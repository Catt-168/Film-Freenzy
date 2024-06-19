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

export default function AdminLanguageCreateForm() {
  const [language, setLanguage] = useState("");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  async function createLanguage() {
    if (language.length === 0) return alert("Empty String");
    try {
      await restClient.post(`${SERVER}/languages`, {
        language: language,
      });
      navigate("/admin/languages");
    } catch (e) {
      console.log(e);
    }
  }

  async function updateLanguage(id) {
    if (language.length === 0) return alert("Empty String");
    try {
      await restClient.put(`${SERVER}/languages/${id}`, {
        language: language,
      });
      navigate("/admin/languages");
    } catch (e) {
      alert("Action cannot be performed due to dependencies errors");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    id ? updateLanguage(id) : createLanguage();
  }

  async function fetchLanguage(id) {
    try {
      const { data } = await restClient.get(`${SERVER}/languages/${id}`);
      setLanguage(data.language);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    id && fetchLanguage(id);
  }, [id]);

  return (
    <Box>
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
          Language Create Form
        </Typography>
        <TextInput
          id="title"
          label="Language"
          value={language}
          onChange={(e) => setLanguage((prev) => e.target.value)}
        />

        <GenericButton type="submit" text={id ? "Update" : "Create"} />
      </Box>
    </Box>
  );
}
