import { Box, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminNavigation from "../../Navigation/AdminNavigation";
import CustomTable from "../CustomTable";
import restClient from "../../../helpers/restClient";
import { SERVER } from "../../../constants";

const PAGE_SIZE = 12;

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [metaData, setMetaData] = useState({ totalItems: 0 }); // Metadata for total items

  async function getRentals() {
    try {
      const { data } = await restClient.get(`${SERVER}/rentals`);
      setRentals(data);
      setMetaData({ totalItems: data.length }); // Set total items in metadata
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getRentals();
  }, []);

  let tableHeaders = rentals.length !== 0 ? Object.keys(rentals[0]) : [];

  // Filter out the "DateOut" and "__v" columns (consider both cases)
  tableHeaders = tableHeaders.filter(header => header !== "__v" && header.toLowerCase() !== "rentaldate");

  // Optionally, you can rename other headers if necessary
  tableHeaders = tableHeaders.map(header => {
    if (header === "rentalFee") return "Price";
    if (header === "dateOut") return "Purchasesd Date";
    return header;
  });

  // Determine the items to display based on the current page
  const indexOfLastItem = page * PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
  const currentItems = rentals.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePaginate = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavigation />
      <Box mt={6} flexGrow={1} sx={{ padding: "2rem" }}>
        {rentals.length !== 0 ? (
          <>
            <CustomTable
              tableHeaders={tableHeaders}
              items={currentItems}
              type="adminRentals"
            />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Pagination
                page={page}
                count={Math.ceil(metaData.totalItems / PAGE_SIZE)}
                onChange={handlePaginate}
                shape="rounded"
                color="primary"
                size="small" // Smaller pagination
              />
            </Box>
          </>
        ) : (
          <h1>No Rentals</h1>
        )}
      </Box>
    </Box>
  );
}
