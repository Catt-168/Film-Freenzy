import { Button, TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { SERVER } from "../../constants";
import restClient from "../../helpers/restClient";
import { capitalizeFirstLetter } from "../../helpers/textHelper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Colors } from "../../helpers/constants";

export default function CustomTableBody({ items, type }) {
  let table = null;
  switch (type) {
    case "users":
      table = <UserTableBody items={items} />;
      break;
    case "movies":
      table = <MoviesTableBody items={items} />;
      break;
    case "genres":
      table = <GenresTableBody items={items} />;
      break;
    case "rentals":
      table = <UsersRentalTableBody items={items} />;
      break;
    case "adminRentals":
      table = <AdminRentalsTableBody items={items} />;
      break;
    case "languages":
      table = <LanguagesTableBody items={items} />;
      break;
  }
  return table;
}

function UserTableBody({ items }) {
  async function handleDelete(id) {
    try {
      await restClient.delete(`${SERVER}/users/${id}`);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }
  // console.log(new Date(items[3].dob).toLocaleDateString("en-GB"));
  return (
    <TableBody>
      {items.map((row, index) => (
        <TableRow
          key={index}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {/* <Link to={`/admin/users/${row._id}`}>{row.name}</Link> */}
            {row.name}
          </TableCell>
          <TableCell>{row.email}</TableCell>
          {/* <TableCell>{row.password}</TableCell> */}
          {/* <TableCell>{row.isAdmin ? "true" : "false"}</TableCell>{" "} */}
          <TableCell>
            {row.dob ? new Date(row.dob).toLocaleDateString("en-GB") : "null"}
          </TableCell>
          {/* <TableCell>
            <Button
              color="error"
              variant="contained"
              disabled={row.isAdmin || true}
              onClick={() => handleDelete(row._id)}
            >
              Delete
            </Button>
          </TableCell> */}
          <TableCell
            sx={{
              color: !!row.payment ? Colors.primary : "",
              fontWeight: !!row.payment ? "bold" : "",
            }}
          >
            {!!row.payment ? "Yes" : "No"}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

function MoviesTableBody({ items }) {
  function genrerateGenres(genres) {
    const genre = genres.map((item) => item.name);
    return genre.join(",");
  }

  function generateLanguages(languages) {
    const language = languages.map((item) => item.language);
    return language[0];
    // return language.join(",");
  }

  function trimText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + " .....";
  }

  async function handleDelete(id) {
    const response = confirm("Would You like to delete this movie");
    if (!response) return;

    try {
      await restClient.delete(`${SERVER}/movies/${id}`);
      window.location.reload();
    } catch (e) {
      alert("Purchased Movie cannot be deleted!");
    }
  }

  return (
    <TableBody>
      {items.map((row, index) => (
        <TableRow key={index} style={{ maxHeight: 10 }}>
          <TableCell
            component="th"
            scope="row"
            sx={{
              display: "flex",
              gap: 0.5,
              // justifyContent: "center",
              // alignItems: "center",
            }}
          >
            <Tooltip title="Edit">
              <Link
                to={`/admin/movies/${row._id}/update`}
                style={{ textDecoration: "none" }}
              >
                <EditIcon style={{ color: Colors.primary }} fontSize="small" />
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteForeverIcon
                style={{ color: Colors.red }}
                fontSize="small"
                onClick={() => handleDelete(row._id)}
              />
            </Tooltip>
          </TableCell>

          <TableCell size="medium" align="left" sx={{ fontWeight: "bold" }}>
            <Link to={`/admin/movies/${row._id}`}>
              {/* {trimText(row.title, 20)} */}
              {row.title}
            </Link>
          </TableCell>
          <TableCell size="medium" align="left">
            {trimText(row.description, 30)}
          </TableCell>
          {/* <TableCell>
            <img
              src={`/${row.image.name}`}
              alt={"hi"}
              style={{ width: "100%", height: "100%" }}
            />
          </TableCell> */}
          {/* <TableCell>{genrerateGenres(row.genre)}</TableCell> */}

          <TableCell size="medium">{row.rating}</TableCell>

          <TableCell size="medium">{row.releasedYear}</TableCell>
          <TableCell size="medium">{row.length}</TableCell>
          <TableCell size="medium">{generateLanguages(row.language)}</TableCell>
          {/* <TableCell>{row.price}</TableCell> */}
          {/* <TableCell>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleDelete(row._id)}
            >
              Delete
            </Button>
          </TableCell> */}
        </TableRow>
      ))}
    </TableBody>
  );
}

function GenresTableBody({ items }) {
  async function handleDelete(id) {
    try {
      await restClient.delete(`${SERVER}/genres/${id}`);
      window.location.reload();
    } catch (e) {
      if (e.response.status === 409) {
        alert("Action cannot be performed due to dependencies");
      }
    }
  }

  return (
    <TableBody>
      {items.map((row, index) => (
        <TableRow
          key={index}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Link to={`/admin/genres/${row._id}`}>
              {capitalizeFirstLetter(row.name)}
            </Link>
          </TableCell>
          <TableCell component="th" scope="row">
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(row._id)}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

function UsersRentalTableBody({ items }) {
  function generateExpireDate(dateOut, rentalDate) {
    const date = new Date(dateOut);
    date.setDate(date.getDate() + rentalDate);
    return date.toDateString();
  }
  return (
    <TableBody>
      {items.map((row, index) => (
        <TableRow
          key={index}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          {/* <TableCell component="th" scope="row" align="left">
            {row.customer.name}
          </TableCell> */}
          <TableCell size="large" align="left">
            <Link to={`/movies/${row.movie._id}`}>{row.movie.title}</Link>
          </TableCell>
          {/* <TableCell>
            {generateExpireDate(row.dateOut, row.rentalDate)}
          </TableCell> */}

          <TableCell>{new Date(row.dateOut).toDateString()}</TableCell>
          <TableCell>{row.rentalFee}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

function AdminRentalsTableBody({ items }) {
  function generateExpireDate(dateOut, rentalDate) {
    const date = new Date(dateOut);
    date.setDate(date.getDate() + rentalDate);
    return date.toDateString();
  }
  return (
    <TableBody>
      {items.map((row, index) => (
        <TableRow
          key={index}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row" align="left">
            {row.customer.name}
          </TableCell>
          <TableCell size="large" align="left">
            <Link to={`/admin/movies/${row.movie._id}`}>{row.movie.title}</Link>
          </TableCell>
          {/* <TableCell>
            {generateExpireDate(row.dateOut, row.rentalDate)}
          </TableCell> */}
          <TableCell>{row.rentalFee}</TableCell>
          <TableCell>{new Date(row.dateOut).toDateString()}</TableCell>
          {/* <TableCell>{row.movie.price}</TableCell> */}
        </TableRow>
      ))}
    </TableBody>
  );
}
function LanguagesTableBody({ items }) {
  async function handleDelete(id) {
    try {
      await restClient.delete(`${SERVER}/languages/${id}`);
      window.location.reload();
    } catch (e) {
      alert("Action cannot be performed due to dependencies");
    }
  }

  return (
    <TableBody>
      {items.map((row, index) => (
        <TableRow
          key={index}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Link to={`/admin/languages/${row._id}`}>
              {capitalizeFirstLetter(row.language)}
            </Link>
          </TableCell>
          <TableCell component="th" scope="row">
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(row._id)}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
