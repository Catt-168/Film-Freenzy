import React, { useEffect, useState } from "react";

import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import CustomTable from "../CustomTable";
import { Box, Button } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";
import GenericButton from "../../Core/GenericButton";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  async function getUsers() {
    const { data } = await restClient.get(`${SERVER}/users`);

    setUsers(data);
  }

  useEffect(() => {
    getUsers();
  }, []);
  const tableHeaders = users.length !== 0 ? Object.keys(users[0]) : [];
  tableHeaders[4] = "Is Admin";
  tableHeaders[5] = "DOB";
  tableHeaders[6] = "Action";
  return (
    <Box sx={{ display: "flex" }}>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 7, flexGrow: 1, padding: "2rem" }}>
        <GenericButton
          disabled
          onClick={() => navigate(`/admin/user/create`)}
          sx={{ marginBottom: 3, mr: "100%" }}
          text="Create"
        />
        <CustomTable tableHeaders={tableHeaders} items={users} type="users" />
      </Box>
    </Box>
  );
}
