import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { SERVER } from "../constants";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Colors, EMAIL_REGEX, PASSWORD_REGEX } from "../helpers/constants";
import { localStorageSetter } from "../helpers/localstorage";
import restClient from "../helpers/restClient";
import GenericButton from "./Core/GenericButton";
import DateInput from "./Input/DateInput";
import PasswordInput from "./Input/PassowrdInput";
import TextInput from "./Input/TextInput";
import Modal from "@mui/material/Modal";
import { Alert, Button, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid",
  borderColor: "transparent",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  pb: 2,
};

function SingUp({ onChangeSignup }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    dob: dayjs("2022-04-17"),
    confirmPassword: "",
  });
  const [snackState, setSnackState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { vertical, horizontal, open } = snackState;

  const handleSubmit = async () => {
    try {
      const { data } = await restClient.post(`${SERVER}/users`, user);
      localStorageSetter(data.token, data.user);
      setSnackState({ ...snackState, open: true });
      setUser({
        name: "",
        email: "",
        password: "",
      });
      const prevUrl = localStorage.getItem("prevUrl") || "";
      setTimeout(() => {
        if (prevUrl.length !== 0) {
          navigate(`../${prevUrl}`);
          return localStorage.removeItem("prevUrl");
        }
        navigate(prevUrl.length !== 0 ? prevUrl : "/movies");
      }, 1000);
    } catch (e) {
      setError({
        name: "",
        password: "",
        email: e.response.data.message,
        confirmPassword: "",
      });
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  function handleInputEmpty() {
    const { email, password, name, confirmPassword } = user;
    let error = { email: "", password: "", name: "", confirmPassword: "" };
    if (name.length === 0) {
      error.name = "Enter Username";
    }
    if (email.length === 0) {
      error.email = "Enter Email Address";
    }
    if (password.length === 0) error.password = "Enter Password";
    if (confirmPassword.length === 0)
      error.confirmPassword = "Enter Password Again";
    // if (password !== confirmPassword) error.password = "Password must be same";
    return {
      emailError: error.email,
      passwordError: error.password,
      usernameError: error.name,
      confirmPasswordError: error.confirmPassword,
    };
  }

  function validateForm(event) {
    event.preventDefault();
    const { emailError, passwordError, usernameError, confirmPasswordError } =
      handleInputEmpty();

    const isUserNameErrorEmpty = usernameError.length === 0;
    const isPasswordErrorEmpty = passwordError.length === 0;
    const isEmailErrorEmpty = emailError.length === 0;
    const isConfirmPasswordErrorEmpty = confirmPasswordError.length === 0;
    const isValidConfirmPassword =
      isConfirmPasswordErrorEmpty && user.password === user.confirmPassword;
    const isValidEmail = EMAIL_REGEX.test(user.email) && isEmailErrorEmpty;
    const isValidPassword =
      PASSWORD_REGEX.test(user.password) && isPasswordErrorEmpty;
    const isValidUsername = user.name.length >= 5 && isUserNameErrorEmpty;

    const isErrorClear =
      isValidEmail &&
      isValidPassword &&
      isValidUsername &&
      isValidConfirmPassword;

    if (isErrorClear) setError({});
    let inputError = {};

    if (isValidUsername) inputError.name = "";
    else {
      inputError.name = isUserNameErrorEmpty
        ? "Username must be at least 5 characters"
        : usernameError;
    }

    if (isValidEmail) inputError.email = "";
    else {
      inputError.email = isEmailErrorEmpty
        ? "Please Enter Valid Email Address"
        : emailError;
    }

    if (isValidPassword) inputError.password = "";
    else {
      inputError.password = isPasswordErrorEmpty
        ? user.password.length < 8
          ? "Password must be 8 characters at least"
          : "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
        : user.password !== user.confirmPassword
        ? "Passwords do not match"
        : passwordError;
    }

    if (isValidConfirmPassword) inputError.confirmPassword = "";
    else {
      inputError.confirmPassword =
        user.password !== user.confirmPassword
          ? "Passwords do not match"
          : passwordError;
    }
    if (!isErrorClear) return setError(inputError);
    handleSubmit();
    setError({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }

  function handleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  function handleMouseDownPassword(event) {
    event.preventDefault();
  }
  return (
    <Box component="form" onSubmit={validateForm} noValidate sx={{ mt: 1 }}>
      <TextInput
        id="name"
        label="Username"
        value={user.name}
        onChange={handleChange}
        error={error?.name?.length !== 0}
        helperText={error?.name}
      />
      <DateInput
        value={user.dob}
        onChange={handleChange}
        label="BirthDate"
        name="dob"
        fullHeight
      />

      <TextInput
        type="email"
        id="email"
        label="Email Address"
        value={user.email}
        onChange={handleChange}
        error={error?.email?.length !== 0}
        helperText={error?.email}
      />
      <PasswordInput
        type="password"
        id="password"
        label="Password"
        value={user.password}
        onChange={handleChange}
        error={error?.password?.length !== 0}
        helperText={error?.password}
        showPassword={showPassword}
        onShow={handleShowPassword}
        onMouseDown={handleMouseDownPassword}
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
        onMouseDown={handleMouseDownPassword}
      />
      <GenericButton
        type="submit"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
        text={"Sign Up"}
      />
      <Typography
        fontSize={18}
        sx={{ mr: -28, mt: 2, cursor: "pointer" }}
        color={Colors.primary}
        onClick={() => onChangeSignup()}
      >
        Already Have an account! Login
      </Typography>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={() => setSnackState({ ...snackState, open: false })}
        message="Account Successfully Created!"
        key={vertical + "right"}
      />
    </Box>
  );
}

function Login({ onChangeLogin }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [forgotPassEmail, setForgotPassEmail] = useState("");
  const [error, setError] = useState({ email: "", password: "", forgot: "" });
  const [open, setOpen] = useState(false);
  const [forgotStatus, setForgotStatus] = useState(0);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(SERVER, user);
      localStorageSetter(data.token, data.user);
      const prevUrl = localStorage.getItem("prevUrl") || "";
      if (prevUrl.length !== 0) {
        navigate(`../${prevUrl}`);
        return localStorage.removeItem("prevUrl");
      }
      localStorage.setItem("active", data.user.isAdmin ? 0 : 1);
      localStorage.setItem("navigation", String(true));
      navigate(data.user.isAdmin ? "/admin/dashboard" : "/movies");
    } catch (e) {
      setError({
        email: e.response.data.message,
        password: e.response.data.message,
      });
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  function handleInputValid() {
    const { email, password } = user;
    let error = { email: "", password: "" };
    if (email.length === 0) {
      error.email = "Enter Email Address";
    }
    if (password.length === 0) error.password = "Enter Password";
    return { emailError: error.email, passwordError: error.password };
  }

  function validateForm(event) {
    event.preventDefault();
    const { emailError, passwordError } = handleInputValid();
    if (emailError.length !== 0 || passwordError.length !== 0)
      return setError({ email: emailError, password: passwordError });

    const isValidEmail = EMAIL_REGEX.test(user.email);
    if (!isValidEmail)
      return setError({ ...error, email: "Please Enter Valid Email Address" });
    handleSubmit();
  }

  function handleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  function handleMouseDownPassword(event) {
    event.preventDefault();
  }
  function handleForgotPassword() {
    setOpen(true);
  }
  function submitForgotPassword() {
    const { error } = handleForgotPassInput();

    setError((prev) => {
      return {
        ...prev,
        forgot: error.length === 0 ? "" : error,
      };
    });
    if (error.length === 0) handleCreateForgotPasword();
  }

  async function handleCreateForgotPasword() {
    try {
      const response = await restClient.post(`${SERVER}/forgotPassword`, {
        email: forgotPassEmail,
      });
      setForgotStatus(response.status);
      setTimeout(() => {
        setForgotStatus(0);
      }, 3000);
    } catch (e) {
      setError((prev) => {
        return { ...prev, forgot: e.response.data.message };
      });
    }
  }

  function handleForgotPassInput() {
    let error = { forgotPassEmail: "" };
    const isEmpty = forgotPassEmail.length === 0;
    const isPasswordValid = EMAIL_REGEX.test(forgotPassEmail);

    if (!isEmpty && isPasswordValid) {
      error.forgotPassEmail = "";
      return { error: error.forgotPassEmail };
    }

    error.forgotPassEmail = "Enter Valid Email Address";
    return { error: error.forgotPassEmail };
  }

  return (
    <Box component="form" onSubmit={validateForm} sx={{ mt: 1 }} noValidate>
      <TextInput
        id="email"
        label="Email Address"
        value={user.email}
        onChange={handleChange}
        error={error?.email?.length !== 0}
        helperText={error.email}
      />
      <PasswordInput
        type="password"
        id="password"
        label="Password"
        value={user.password}
        onChange={handleChange}
        error={error?.password?.length !== 0}
        helperText={error.password}
        showPassword={showPassword}
        onShow={handleShowPassword}
        onMouseDown={handleMouseDownPassword}
      />

      <GenericButton
        type="submit"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
        text={"Login"}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography
          fontSize={18}
          sx={{ cursor: "pointer" }}
          color={Colors.red}
          onClick={handleForgotPassword}
        >
          Forgot Password
        </Typography>
        <Typography
          fontSize={18}
          sx={{ cursor: "pointer" }}
          color={Colors.primary}
          onClick={() => onChangeLogin()}
        >
          SignUp
        </Typography>
      </Box>
      <Modal
        open={open}
        onClose={() => {
          setForgotPassEmail("");
          setOpen((prev) => !prev);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            justifyContent={"center"}
            textAlign={"center"}
          >
            Forgot Password
          </Typography>
          <TextInput
            id="email"
            label="Email Address"
            value={forgotPassEmail}
            onChange={(e) => setForgotPassEmail(e.target.value)}
            error={error?.forgot?.length !== 0}
            helperText={error.forgot}
          />
          <GenericButton
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            text={"Request"}
            onClick={submitForgotPassword}
          />
          {forgotStatus === 200 ? (
            <Collapse in={forgotStatus === 200}>
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                severity="success"
                action={
                  <CloseIcon
                    onClick={() => setForgotStatus(0)}
                    sx={{ cursor: "pointer" }}
                  />
                }
              >
                Request Success!
              </Alert>
            </Collapse>
          ) : null}
        </Box>
      </Modal>
    </Box>
  );
}

export default function Authenticate() {
  const [isLogin, setIsLogin] = useState(true);

  function handleLogin() {
    setIsLogin((prev) => !prev);
  }
  return (
    <Container component="main" maxWidth="sm">
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
        <Typography component="h1" variant="h5" color={Colors.primary}>
          {isLogin ? "Login" : "SignUp"}
        </Typography>
        {isLogin ? (
          <Login onChangeLogin={handleLogin} />
        ) : (
          <SingUp onChangeSignup={handleLogin} />
        )}
      </Box>
    </Container>
  );
}
