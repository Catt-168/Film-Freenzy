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
import PasswordInput from "./Input/PassowrdInput";
import Footer from "./Footer/Footer";
import { Colors, PASSWORD_REGEX } from "../helpers/constants";
import TextInput from "./Input/TextInput";

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
    password: "",
    confirmPassword: "",
    file: null,
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setErrors] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    const { name, email, password, file } = user;
    const form = new FormData();

    form.append("name", name);
    form.append("email", email);
    form.append(
      "password",
      password.length !== 0 ? password : localUser.password
    );
    form.append("file", file);
    form.append("payment", localUser?.payment);

    try {
      const { data } = await restClient.put(
        `${SERVER}/users/${localUser._id}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localStorage.setItem("user", JSON.stringify(data));
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  function validate() {
    const { name, password, confirmPassword } = user;
    let erorrs = {};

    erorrs.name =
      name.length > 5
        ? name.length > 50
          ? "Username must be not more than 50 characters long"
          : ""
        : "Username must be at least 5 characters long";

    const isPasswordEmpty = password.length === 0;
    const isConfirmPassEmpty = confirmPassword.length === 0;

    const isPasswordValid = PASSWORD_REGEX.test(password);
    const isConfirmPassValid = PASSWORD_REGEX.test(confirmPassword);

    erorrs.password = isPasswordEmpty
      ? isConfirmPassEmpty
        ? ""
        : "Enter Password"
      : !isPasswordValid
      ? password.length < 8
        ? "Password must be 8 characters at least"
        : "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
      : password !== confirmPassword
      ? "Passwords must be same"
      : "";
    erorrs.confirmPassword = isConfirmPassEmpty
      ? isPasswordEmpty
        ? ""
        : "Enter Confirm Password"
      : !isConfirmPassValid
      ? confirmPassword.length < 8
        ? "Password must be 8 characters at least"
        : "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
      : password !== confirmPassword
      ? "Passwords must be same"
      : "";
    const errorValues = Object.values(erorrs);
    const result = errorValues.every((item) => item.length === 0);

    setErrors(erorrs);
    return result;
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    setUser({ ...user, [name]: files ? files[0] : value });
  }

  // console.log(user.file);
  return (
    <Box>
      {localUser.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Container
        component="main"
        maxWidth="sm"
        sx={{ padding: "1.3rem 2rem 0 2rem" }}
      >
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: !user?.file?.name ? 1.6 : 0.4,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            alt={localUser.name}
            src={`/${localUser?.image?.name}`}
            sx={{
              width: 65,
              height: 65,
              mb: 1,
              border: 2,
              borderColor: Colors.primary,
            }}
          ></Avatar>
          {user?.file?.name}
          <VisuallyHiddenInput
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
          />
          <Typography
            component="h1"
            variant="h5"
            color="black"
            sx={{ mt: 1, color: Colors.primary }}
          >
            {"Hello " + localUser.name}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Box sx={{ display: "flex", gap: 3 }}>
              <TextInput
                id="name"
                label="Username"
                value={user.name}
                onChange={handleChange}
                error={error?.name?.length !== 0}
                helperText={error?.name}
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
                disabled
              />
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <PasswordInput
                type="password"
                id="password"
                label="Password"
                value={user.password}
                onChange={handleChange}
                error={error?.password?.length !== 0}
                helperText={error?.password}
                showPassword={showPassword1}
                onShow={() => setShowPassword1((prev) => !prev)}
                // onMouseDown={handleMouseDownPassword}
              />
              <PasswordInput
                type="confirmPassword"
                id="confirmPassword"
                label="Confirm Password"
                value={user.confirmPassword}
                onChange={handleChange}
                error={error?.confirmPassword?.length !== 0}
                helperText={error?.confirmPassword}
                showPassword={showPassword2}
                onShow={() => setShowPassword2((prev) => !prev)}
                // onMouseDown={handleMouseDownPassword}
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
                  ml: 20,
                  background: Colors.primary,
                  position: "absolute",
                  top: 100,
                  opacity: 1,
                  width: "10%",
                  height: 50,
                  opacity: 0,
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
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                text="Edit"
              />
            </Box>
          </Box>
        </Box>
      </Container>
      <Box sx={{ bottom: -88, position: "relative" }}>
        <Footer />
      </Box>
    </Box>
  );
}
