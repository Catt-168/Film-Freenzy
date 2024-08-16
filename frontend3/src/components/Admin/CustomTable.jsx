import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { capitalizeFirstLetterinSentence } from "../../helpers/textHelper";
import CustomTableBody from "../TableBody/TableBody";

export default function CustomTable({ tableHeaders, items, type }) {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: "100%", overflow: "hidden" }}>
      <Table
        sx={{
          minWidth: 450,
          "& .MuiTableCell-root": {
            padding: "8px 16px", // Smaller padding
            fontSize: "0.8rem", // Smaller font size
          },
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            {tableHeaders.map((item, index) => (
              <TableCell
                key={index}
                align={"left"}
                sx={{
                  fontWeight: 600,
                  display: item === "_id" ? "none" : "",
                }}
              >
                {capitalizeFirstLetterinSentence(item)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <CustomTableBody items={items} type={type} />
      </Table>
    </TableContainer>
  );
}
