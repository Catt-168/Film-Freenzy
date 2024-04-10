import React, { useEffect, useState } from "react";

import { SERVER } from "../../../constants";
import restClient from "../../../helpers/restClient";
import CustomTable from "../CustomTable";
import { Box, Button } from "@mui/material";
import AdminNavigation from "../../Navigation/AdminNavigation";
import UserNavigation from "../../Navigation/UserNavigation";

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
  tableHeaders[5] = "Action";
  return (
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box sx={{ mt: 4 }}>
        <Button
          disabled
          variant="contained"
          onClick={() => navigate(`/admin/user/create`)}
          sx={{ marginBottom: 3, position: "relative", marginLeft: "92%" }}
        >
          Create
        </Button>
        <CustomTable tableHeaders={tableHeaders} items={users} type="users" />
      </Box>
    </Box>
  );
}
