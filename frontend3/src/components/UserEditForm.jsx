import { Box, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../constants";
import restClient from "../helpers/restClient";
import GenericButton from "./Core/GenericButton";
import AdminNavigation from "./Navigation/AdminNavigation";
import UserNavigation from "./Navigation/UserNavigation";
import Footer from "./Footer/Footer";

export default function UserEditForm() {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: localUser.name,
    email: localUser.email,
    password: localUser.password,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await restClient.put(
        `${SERVER}/users/${localUser._id}`,
        user
      );

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/movies");
    } catch (e) {
      console.log(e);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }
  return (
    <Box>
      {localUser.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Container
        component="main"
        maxWidth="sm"
        sx={{ padding: "2rem 2rem 0 2rem" }}
      >
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" color="black">
            {"Hello " + localUser.name}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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

            <GenericButton
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              text="Edit"
            />
          </Box>
        </Box>
      </Container>
      <Box sx={{ bottom: -88, position: "relative" }}>
        <Footer />
      </Box>
    </Box>
  );
}
