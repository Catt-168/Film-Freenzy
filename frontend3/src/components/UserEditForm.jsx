import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../constants";
import restClient from "../helpers/restClient";
import GenericButton from "./Core/GenericButton";
import AdminNavigation from "./Navigation/AdminNavigation";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UserNavigation from "./Navigation/UserNavigation";

import Footer from "./Footer/Footer";
import { Colors } from "../helpers/constants";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UserEditForm() {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: localUser.name,
    email: localUser.email,
    password: localUser.password,
    file: localUser.image,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, file } = user;
    const form = new FormData();

    form.append("name", name);
    form.append("email", email);
    form.append("password", password);
    form.append("file", file);

    try {
      const { data } = await restClient.put(
        `${SERVER}/users/${localUser._id}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/movies");
    } catch (e) {
      console.log(e);
    }
  };

  function handleChange(e) {
    const { name, value, files } = e.target;

    setUser({ ...user, [name]: files ? files[0] : value });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {localUser.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Container
        component="main"
        maxWidth="sm"
        sx={{ padding: "2rem 2rem 0 2rem", flexGrow: 1 }}
      >
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 2,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            alt={localUser.name}
            src={`/${localUser?.image?.name}`}
            sx={{ width: 65, height: 65 }}
          />
          <Typography component="h1" variant="h5" color="black">
            {"Hello " + localUser.name}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Box sx={{ display: "flex", gap: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Username"
                name="name"
                autoComplete="name"
                value={user.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email"
                type="email"
                id="email"
                value={user.email}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Button
                component="label"
                role={undefined}
                fullWidth
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  mb: 2,
                  mt: 2,
                  background: Colors.primary,
                  "&:hover": { background: Colors.darkPrimary },
                }}
              >
                {user.file ? user.file.name : "Upload Image"}
                <VisuallyHiddenInput
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleChange}
                />
              </Button>
              <GenericButton
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                text="Edit"
              />
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer sx={{ mt: "auto" }} />
    </Box>
  );
}
