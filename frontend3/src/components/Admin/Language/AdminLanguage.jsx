import React, { useEffect, useState } from "react";
import restClient from "../../../helpers/restClient";
import { SERVER } from "../../../constants";
import { Alert, Box, Button, Grid, Snackbar } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import { useNavigate } from "react-router-dom";
import CustomTable from "../CustomTable";
import GenericButton from "../../Core/GenericButton";
import { Colors, STATUS_TYPE } from "../../../helpers/constants";
import { capitalizeFirstLetter } from "../../../helpers/textHelper";
import ActorGenreLanguageCreateModal from "../Actor/ActorGenreLanguageCreateModal";

const errorDefaultState = {
  status: false,
  message: "",
};

export default function AdminLanguage() {
  const [languages, setLanguages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [state, setState] = useState({
    openSnackBar: false,
    vertical: "bottom",
    horizontal: "right",
    message: "",
  });
  const { vertical, horizontal, openSnackBar } = state;
  const [actorStatus, setActorStatus] = useState(STATUS_TYPE.idle);
  const [language, setLanguage] = useState({ name: "" });
  const [languageError, setLanguageError] = useState({
    status: false,
    message: "",
  });

  async function getLanguages() {
    try {
      const { data } = await restClient.get(`${SERVER}/languages`);
      setLanguages(data);
    } catch (e) {
      console.log(e.message);
    }
  }
  const handleCloseSnackBar = () => {
    setState({ ...state, openSnackBar: false });
  };

  function handleChangeLanguage(e) {
    const { name, value } = e.target;
    setLanguage({ [name]: value });
  }

  function handleSubmitLangauge() {
    const { name } = language;

    const isLanguageValid = name.length >= 4;

    setLanguageError(
      isLanguageValid
        ? errorDefaultState
        : { status: true, message: "Language must be at least 4 characters" }
    );

    if (!isLanguageValid) return;
    handleCreateLanguage();
  }

  function handleClose() {
    setLanguage({ name: "" });
    setLanguageError(errorDefaultState);
    setOpenCreateModal(false);
  }

  async function handleCreateLanguage() {
    setActorStatus(STATUS_TYPE.loading);
    try {
      await restClient.post(`${SERVER}/languages`, {
        language: language.name,
      });
      getLanguages();
      setTimeout(() => {
        setState({
          ...state,
          openSnackBar: true,
          message: "Language Successfully Added!",
        });
        setLanguage({
          name: "",
        });
        setOpenCreateModal(false);
        setActorStatus(STATUS_TYPE.success);
      }, 1000);
    } catch (e) {
      setLanguageError({ status: true, message: e.response.data.message });
      setActorStatus(STATUS_TYPE.error);
      console.log(e);
    }
  }

  useEffect(() => {
    getLanguages();
  }, []);

  const tableHeaders = languages.length !== 0 ? Object.keys(languages[0]) : [];
  tableHeaders[2] = "Action";
  const isActorStatusLoading = actorStatus === STATUS_TYPE.loading;

  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 6.5, flexGrow: 1, padding: "1.3rem" }}>
        <GenericButton
          onClick={() => setOpenCreateModal(true)}
          sx={{ marginBottom: 1.5, ml: "88%" }}
          text={"Create"}
        />
        {/* <CustomTable
          tableHeaders={tableHeaders}
          items={languages}
          type="languages"
        /> */}
        <Grid container>
          {languages.map((item) => (
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
              {capitalizeFirstLetter(item.language)}
            </Grid>
          ))}
        </Grid>
      </Box>
      <ActorGenreLanguageCreateModal
        open={openCreateModal}
        onClose={handleClose}
        onChange={handleChangeLanguage}
        onCreate={handleSubmitLangauge}
        data={language}
        isLoading={isActorStatusLoading}
        openSnackBar={openSnackBar}
        error={languageError}
        type="language"
      />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={state.openSnackBar}
        onClose={handleCloseSnackBar}
        autoHideDuration={3000}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleCloseSnackBar}
          variant="filled"
          sx={{ width: "100%", background: Colors.primary }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
