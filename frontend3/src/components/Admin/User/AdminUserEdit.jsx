import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";

export default function AdminUserEdit() {
  const { id } = useParams();
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const localUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      await restClient.put(`${SERVER}/users/${id}`, user);
      navigate("/admin/users");
    } catch (e) {
      console.log(e);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  async function fetchUser() {
    try {
      const { data } = await restClient.get(`${SERVER}/users/${id}`);
      setUser({
        username: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchUser();
  }, [id]);
  return (
    <Box sx={{ padding: "2rem" }}>
      {localUser.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box
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
          User Edit Form
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={user.username}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={user.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="text"
          id="password"
          value={user.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
}
