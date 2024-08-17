import React, { useEffect, useReducer, useState } from "react";

import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import CustomTable from "../CustomTable";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import GenericButton from "../../Core/GenericButton";
import {
  Colors,
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from "../../../helpers/constants";
import FormHeader from "../../Input/FormHeader";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TextInput from "../../Input/TextInput";
import PasswordInput from "../../Input/PassowrdInput";

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

const errorInitialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  errors: errorInitialState,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.key]: action.value,
        },
      };
    case "RESET":
      return initialState;
  }
}

const PAGE_SIZE = 5;
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [metaData, setMetaData] = useState({});
  const [open, setOpen] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState("All");
  const [adminStatus, setAdminStatus] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  async function getUsers(page, filter) {
    const { data } = await restClient.get(
      `${SERVER}/users?page=${page}&pageSize=${PAGE_SIZE}&filterKeyWord=${filter}`
    );

    setUsers(data.users);
    setMetaData(data.metaData);
  }

  useEffect(() => {
    getUsers(page, filter);
  }, []);

  async function handlePaginate(e, value) {
    setPage(value);
    getUsers(value, filter);
  }

  function handleChange(e) {
    dispatch({
      type: "SET_FIELD",
      key: e.target.name,
      value: e.target.value,
    });
  }

  function handleFilter(e) {
    const { value } = e.target;
    setFilter(value);
    setPage(1);
    getUsers(1, value);
  }

  async function createAdmin() {
    const admin = {
      name: state.name,
      email: state.email,
      password: state.password,
      isAdmin: true,
      dob: new Date(),
    };
    try {
      await restClient.post(`${SERVER}/users`, admin);
      setAdminStatus(200);
      setTimeout(() => {
        setAdminStatus(0);
        dispatch({
          type: "RESET",
        });
      }, 3000);
    } catch (e) {
      dispatch({
        type: "SET_ERROR",
        key: "email",
        value: e.response.data.message,
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { name, email, password, confirmPassword } = state;
    const errors = { ...errorInitialState };

    const isNameEmpty = name.length === 0;
    const isMailEmpty = email.length === 0;
    const isPasswordEmpty = password.length === 0;
    const isConfirmPassEmpty = confirmPassword.length === 0;

    const isNameValid = name.length >= 3;
    const isEmailValid = EMAIL_REGEX.test(email);
    const isPasswordValid = PASSWORD_REGEX.test(password);
    const isConfirmPassValid = PASSWORD_REGEX.test(confirmPassword);
    const isPasswordSame = password === confirmPassword;

    errors.name = isNameEmpty
      ? "Please Enter Username"
      : !isNameValid
      ? "Username must be 3 characters long"
      : "";

    errors.email = isMailEmpty
      ? "Please Enter Email Address"
      : !isEmailValid
      ? "Please Enter valid email address"
      : "";

    errors.password = isConfirmPassEmpty
      ? "Enter Password"
      : !isPasswordValid
      ? password.length < 8
        ? "Password must be 8 characters at least"
        : "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
      : !isPasswordSame
      ? "Passwords must be same"
      : "";

    errors.confirmPassword = isPasswordEmpty
      ? "Enter Password"
      : !isConfirmPassValid
      ? confirmPassword.length < 8
        ? "Password must be 8 characters at least"
        : "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
      : !isPasswordSame
      ? "Passwords must be same"
      : "";

    for (let e in errors) {
      dispatch({
        type: "SET_ERROR",
        key: e,
        value: errors[e],
      });
    }

    const errorValues = Object.values(errors);
    const result = errorValues.every((item) => item.length === 0);

    if (result) {
      createAdmin();
    }
  }

  const tableHeaders = users.length !== 0 ? Object.keys(users[0]) : [];
  tableHeaders[0] = "Username";
  tableHeaders[1] = "Email";

  tableHeaders[3] = "DOB";
  tableHeaders[4] = "Action";
  tableHeaders[5] = "Is Credit?";

  tableHeaders.splice(2, 1);
  tableHeaders.pop();
  console.log(tableHeaders);
  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 6.5, flexGrow: 1, padding: "1.3rem" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <FormControl size="small">
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              label="Age"
              onChange={handleFilter}
              sx={{ "& .MuiSelect-select ": { height: 10 } }}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Admins"}>Admins</MenuItem>
              <MenuItem value={"Users"}>Users</MenuItem>
            </Select>
          </FormControl>
          <GenericButton
            onClick={() => setOpen(true)}
            sx={{ marginBottom: 2 }}
            text="Create"
          />
        </Box>
        <Box sx={{ maxWidth: "100%" }}>
          <CustomTable tableHeaders={tableHeaders} items={users} type="users" />
        </Box>
        <Box
          sx={{
            mt: 4,
            display: "flex",
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
      <Modal
        open={open}
        onClose={() => {
          setOpen((prev) => !prev);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormHeader title="Admin Create Form" />
          <TextInput
            type="name"
            id="name"
            label="Name"
            value={state.name}
            onChange={handleChange}
            error={state.errors?.name?.length !== 0}
            helperText={state.errors?.name}
          />
          <TextInput
            type="email"
            id="email"
            label="Email Address"
            value={state.email}
            onChange={handleChange}
            error={state.errors?.email?.length !== 0}
            helperText={state.errors?.email}
          />
          <PasswordInput
            type="password"
            id="password"
            label="Password"
            value={state.password}
            onChange={handleChange}
            error={state.errors?.password?.length !== 0}
            helperText={state.errors?.password}
            showPassword={showPassword1}
            onShow={() => setShowPassword1((prev) => !prev)}
            // onMouseDown={handleMouseDownPassword}
          />
          <PasswordInput
            type="confirmPassword"
            id="confirmPassword"
            label="Confirm Password"
            value={state.confirmPassword}
            onChange={handleChange}
            error={state.errors?.confirmPassword?.length !== 0}
            helperText={state.errors?.confirmPassword}
            showPassword={showPassword2}
            onShow={() => setShowPassword2((prev) => !prev)}
            // onMouseDown={handleMouseDownPassword}
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <GenericButton text="Create" onClick={handleSubmit} />
          </Box>
          {adminStatus === 200 ? (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              action={
                <CloseIcon
                  onClick={() => setAdminStatus(0)}
                  sx={{ cursor: "pointer" }}
                />
              }
            >
              Successfully Created Admin!
            </Alert>
          ) : null}
        </Box>
      </Modal>
    </Box>
  );
}
