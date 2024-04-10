import React, { useEffect, useState } from "react";
import restClient from "../../../helpers/restClient";
import { SERVER } from "../../../constants";
import { Box, Button } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import { useNavigate } from "react-router-dom";
import CustomTable from "../CustomTable";

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
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate(`/admin/languages/create`)}
          sx={{ marginBottom: 3, position: "relative", marginLeft: "92%" }}
        >
          Create
        </Button>
        <CustomTable
          tableHeaders={tableHeaders}
          items={languages}
          type="languages"
        />
      </Box>
    </Box>
  );
}
