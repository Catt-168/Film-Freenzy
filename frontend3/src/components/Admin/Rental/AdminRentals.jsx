import {
  Box,
  FormControl,
  InputLabel,
  Pagination,
  Select,
  Typography,
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
import { Colors, STATUS_TYPE } from "../../../helpers/constants";
import LoadingSpinner from "../../Core/LoadingSpinner";

const PAGE_SIZE = 11;

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [metaData, setMetaData] = useState({ totalItems: 0 }); // Metadata for total items
  const [filter, setFilter] = useState({
    startDate: dayjs("2020-11-29"),
    endDate: dayjs(),
  });
  const [status, setStatus] = useState(STATUS_TYPE.loading);
  const [total, setTotal] = useState(0);

  async function getRentals(saveCurrentDate = false) {
    setStatus(STATUS_TYPE.loading);
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
      const fees = data.map((item) => item.rentalFee);
      setTotal(
        fees.reduce((acc, current) => {
          return acc + current;
        })
      );
    } catch (e) {
      console.log(e.message);
    } finally {
      setStatus(STATUS_TYPE.success);
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

  const isLoading = status === STATUS_TYPE.loading;

  console.log("TOTAL", total);
  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavigation />
      <Box mt={6} flexGrow={1} sx={{ padding: "1.6rem" }}>
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
          <Typography
            component="body1"
            color="black"
            fontWeight="bold"
            sx={{
              mt: 1,
              background: Colors.yellow,
              paddingTop: 1,
              paddingLeft: 2,
              paddingRight: 2,
              borderRadius: 1,
              height: 40,
            }}
          >
            Total Amount: {total} MMK
          </Typography>
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
                mt: 2
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
          <div>
            {isLoading ? <LoadingSpinner /> : <h1>No PURCHASED MOVIES</h1>}
          </div>
        )}
      </Box>
    </Box>
  );
}
