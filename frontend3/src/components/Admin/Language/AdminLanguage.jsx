import React, { useEffect, useState } from "react";
import restClient from "../../../helpers/restClient";
import { SERVER } from "../../../constants";
import { Box, Button, Grid } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import { useNavigate } from "react-router-dom";
import CustomTable from "../CustomTable";
import GenericButton from "../../Core/GenericButton";
import { Colors } from "../../../helpers/constants";
import { capitalizeFirstLetter } from "../../../helpers/textHelper";

export default function AdminLanguage() {
  const [languages, setLanguages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  async function getLanguages() {
    try {
      const { data } = await restClient.get(`${SERVER}/languages`);
      setLanguages(data);
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getLanguages();
  }, []);
  const tableHeaders = languages.length !== 0 ? Object.keys(languages[0]) : [];
  tableHeaders[2] = "Action";
  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 6.5, flexGrow: 1, padding: "1.3rem" }}>
        <GenericButton
          onClick={() => navigate(`/admin/languages/create`)}
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
    </Box>
  );
}
