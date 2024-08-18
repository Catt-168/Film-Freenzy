import {
  Box,
  FormControl,
  InputLabel,
  Pagination,
  Select,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import AdminNavigation from "../../Navigation/AdminNavigation";
import CustomTable from "../CustomTable";
import restClient from "../../../helpers/restClient";
import { SERVER } from "../../../constants";
import DateInput from "../../Input/DateInput";
import GenericButton from "../../Core/GenericButton";
import dayjs from "dayjs";
import { Colors } from "../../../helpers/constants";

const PAGE_SIZE = 12;

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [metaData, setMetaData] = useState({ totalItems: 0 }); // Metadata for total items
  const [filter, setFilter] = useState({
    startDate: dayjs("2020-11-29"),
    endDate: dayjs(),
  });

  async function getRentals(saveCurrentDate = false) {
    try {
      const { data } = await restClient.get(
        `${SERVER}/rentals?startDate=${filter.startDate}&endDate=${filter.endDate}`
      );
      setRentals(data);
      setMetaData({ totalItems: data.length }); // Set total items in metadata
      setFilter({
        ...filter,
        startDate: saveCurrentDate ? filter.startDate : dayjs(data[0].dateOut),
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getRentals();
  }, []);

  let tableHeaders = rentals.length !== 0 ? Object.keys(rentals[0]) : [];

  // Filter out the "DateOut" and "__v" columns (consider both cases)
  tableHeaders = tableHeaders.filter(
    (header) => header !== "__v" && header.toLowerCase() !== "rentaldate"
  );

  // Optionally, you can rename other headers if necessary
  tableHeaders = tableHeaders.map((header) => {
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

  function handleChange(e) {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  }

  function handleFilter() {
    getRentals(true, filter.startDate, filter.endDate);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavigation />
      <Box mt={6} flexGrow={1} sx={{ padding: "1.2rem" }}>
        <Box
          sx={{
            width: "100%",

            display: "flex",
            gap: 2,
            justifyContent: "flex-start",
            aliginItems: "center",
          }}
        >
          <DateInput
            value={filter.startDate}
            onChange={handleChange}
            label="From"
            name="startDate"
          />
          <DateInput
            value={filter.endDate}
            onChange={handleChange}
            label="To"
            name="endDate"
          />
          {/* <GenericButton
            onClick={handleFilter}
            text="Search"
            sx={{ height: 38, mt: 1 }}
          /> */}
          <GenericButton
            onClick={handleFilter}
            sx={{ height: 38, mt: 1 }}
            text={<SearchIcon size={60} />}
            tooltipTitle="Filter"
          />
          {/* <GenericButton
            onClick={() => {
              window.location.reload();
            }}
            text="Reset"
            isError
            sx={{ height: 38, mt: 1 }}
          /> */}
          <GenericButton
            hoverColor={Colors.yellow}
            sx={{ height: 38, mt: 1 }}
            onClick={() => {
              window.location.reload();
            }}
            text={<ReplayIcon size={60} color={"BlueSapphire.white"} />}
            isError={true}
            tooltipTitle="Reset"
          />
        </Box>

        {rentals.length !== 0 ? (
          <>
            <CustomTable
              tableHeaders={tableHeaders}
              items={currentItems}
              type="adminRentals"
            />
            <Box
              sx={{
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
