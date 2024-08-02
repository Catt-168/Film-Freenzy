import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import restClient from "../../helpers/restClient";
import { SERVER } from "../../constants";
import CustomTable from "../Admin/CustomTable";
import Footer from "../Footer/Footer";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  async function getRentals() {
    try {
      const { data } = await restClient.get(
        `${SERVER}/rentals?customerId=${user._id}`
      );
      console.log("DATA", data);
      if (data.message) return setRentals([]);

      setRentals(data);
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getRentals();
  }, []);

  let tableHeaders = rentals.length !== 0 ? Object.keys(rentals[0]) : [];

  tableHeaders[3] = "Expired Date";
  tableHeaders[5] = "Subscribed Date";
  return (
    <Box>
      {user.isAdmin ? <AdminNavigation /> : <UserNavigation />}
      <Box mt={5} sx={{ padding: "2rem" }}>
        {rentals.length !== 0 ? (
          <CustomTable
            tableHeaders={tableHeaders}
            items={rentals}
            type="rentals"
          />
        ) : (
          <p>You has not rented any movies</p>
        )}
      </Box>
      <Box sx={{ bottom: -78, position: "relative" }}>
        <Footer />
      </Box>
    </Box>
  );
}
