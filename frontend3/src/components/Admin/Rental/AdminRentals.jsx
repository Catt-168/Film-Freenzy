import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminNavigation from "../../Navigation/AdminNavigation";
import CustomTable from "../CustomTable";
import restClient from "../../../helpers/restClient";
import { SERVER } from "../../../constants";

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);

  async function getRentals() {
    try {
      const { data } = await restClient.get(`${SERVER}/rentals`);
      setRentals(data);
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getRentals();
  }, []);
  const tableHeaders = rentals.length !== 0 ? Object.keys(rentals[0]) : [];
  tableHeaders[3] = "Expired Date";
  tableHeaders[4] = "Total Rental Fee";
  tableHeaders[5] = "Subscribed Date";
  tableHeaders[6] = "Movie Daily Rental Rate";
  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavigation />
      <Box mt={7} flexGrow={1}>
        {rentals.length !== 0 ? (
          <CustomTable
            tableHeaders={tableHeaders}
            items={rentals}
            type="adminRentals"
          />
        ) : (
          <h1>No Rentals</h1>
        )}
      </Box>
    </Box>
  );
}
