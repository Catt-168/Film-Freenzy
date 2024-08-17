import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Divider, Paper, Snackbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER } from "../../constants";
import { Colors } from "../../helpers/constants";
import restClient from "../../helpers/restClient";
import { capitalizeFirstLetter } from "../../helpers/textHelper";
import GenericButton from "../Core/GenericButton";
import GenericChip from "../Core/GenericChip";
import LoadingSpinner from "../Core/LoadingSpinner";
import Footer from "../Footer/Footer";
import useAuth from "../hooks/useAuth";
import AdminNavigation from "../Navigation/AdminNavigation";
import UserNavigation from "../Navigation/UserNavigation";
import PaymentForm from "../Payment/PaymentForm";

export default function MovieDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState("idle");
  const [movie, setMovie] = useState({});
  const [rentDate, setRentDate] = useState(1);
  const [rentId, setRentId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const { isAuthenticated } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  async function getMovieDetails() {
    try {
      const response = await restClient.get(`${SERVER}/movies/${id}`);
      setMovie(response.data);
      setStatus((prev) => "success");
    } catch (e) {
      console.log(e);
    }
  }

  async function getRental() {
    console.log("GET", user?._id);
    try {
      const { data } = await restClient.get(
        `${SERVER}/rentals?customerId=${user._id}`
      );
      const movie = data.find((item) => item.movie._id === id);
      if (!movie) return null;

      setRentId(movie._id);
      setRentDate(movie.rentalDate);
      setIsUpdate(true);
    } catch (e) {
      console.log("SIMPLE NO RENTAL");
    }
  }

  useEffect(() => {
    setStatus((prev) => "loading");
    getMovieDetails();
    getRental();
  }, []);

  async function createRent() {
    const reqBody = {
      customerId: user._id,
      movieId: movie._id,
      rentalDate: 1,
    };
    if (rentDate <= 0) return alert("Please lend a day at least!");
    setDisabled(true);
    try {
      const { data } = await restClient.post(`${SERVER}/rentals`, reqBody);
      setMovie({ ...movie, rentalDate: data.rental.rentalDate });
      setOpenSnackbar(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setTimeout(() => {
        setDisabled(false);
      }, 1500);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  async function updateRent() {
    const reqBody = {
      rentalDate: rentDate,
      price: movie.price,
    };
    setDisabled(true);
    try {
      await restClient.put(`${SERVER}/rentals?id=${rentId}`, reqBody);
      setOpenSnackbar(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setTimeout(() => {
        setDisabled(false);
      }, 1500);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleRent() {
    if (!isAuthenticated) {
      alert("You need to login first!");
      localStorage.setItem(
        "prevUrl",
        window.location.href.split("/").slice(-2).join("/")
      );
      return navigate("/login");
    }
    return setShowPaymentModal(true);
    // isUpdate ? updateRent() : createRent();
  }

  function trimText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isIdle = status === "idle";
  const isDisabled = disabled;

  if (isIdle) return <p>Please Wait! Server is Loading</p>;
  if (isLoading) return <p>Loading</p>;
  if (isSuccess)
    return (
      <Box sx={{ paddingTop: "1rem" }}>
        {user?.isAdmin ? <AdminNavigation /> : <UserNavigation />}
        <Box sx={{ padding: "0.6rem" }}>
          <Typography variant="h3" component="div" sx={{ mt: 6, mb: 1 }}>
            {/* {capitalizeFirstLetterinSentence(movie.title)} */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
              message={
                isUpdate
                  ? "Video Rental Date Successfully Updated"
                  : "Video Successfully Purchased!"
              }
            />
          </Typography>
          <Paper
            sx={{
              display: "flex",
              width: "60%",
              ml: "20%",
              gap: 5,
              padding: 2,
            }}
            elevation={6}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyItems: "center",
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{ mt: 1, mb: 1, fontSize: 27, color: Colors.primary }}
              >
                {movie.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: 2,
                  background: "#f5f5f5",
                  maxWidth: "100%",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <CalendarMonthIcon />
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "Arial",
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                >
                  {movie.releasedYear}
                </p>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ ml: 1, mr: 1 }}
                />
                <StarOutlineIcon />
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "Arial",
                    ml: 1,
                    mr: 1,
                  }}
                >
                  {movie.rating} / 5
                </p>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ marginLeft: 2, marginRight: 1 }}
                />
                {movie.genre.map((g) => (
                  <GenericChip label={g.name} sx={{ mr: 1 }} key={g._id} />
                ))}
              </Box>
              {/* <Box mb={3}>
                {movie.genre.map((g) => (
                  <GenericChip label={g.name} sx={{ mr: 1 }} key={g._id} />
                ))}
              </Box> */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "left" }}
              >
                {trimText(movie.description, 140)}
                {/* {movie.description} */}
              </Typography>
              <Divider sx={{ width: "100%", mt: 1, mb: 1 }} />
              {/* <GenericButton
                startIcon={<PlayArrowIcon />}
                sx={{ mb: 1, mt: 1 }}
                onClick={() => window.open(movie.trailerLink)}
                disabled={movie?.trailerLink?.length === 0}
                text="Watch Trailer"
              /> */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, mr: 2.5 }}
                    gutterBottom
                  >
                    Duration
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {movie.length} minutes
                  </Typography>
                </Box>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ ml: 1, mr: 1 }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600 }}
                    gutterBottom
                  >
                    Price
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {movie.price}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ width: "100%", mb: 1, mt: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }} gutterBottom>
                Cast
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "left" }}
              >
                {movie.actor.map((item) => item.name).join(", ")}
              </Typography>
              <Divider sx={{ width: "100%", mb: 1, mt: 1 }} />

              <Typography variant="body1" sx={{ fontWeight: 600 }} gutterBottom>
                Language
              </Typography>
              <Typography variant="body1" gutterBottom>
                {movie.language.map((g) => (
                  <GenericChip
                    label={capitalizeFirstLetter(g.language)}
                    sx={{ mr: 1 }}
                    key={g._id}
                  />
                ))}
              </Typography>
              <Divider sx={{ width: "100%", mb: 1, mt: 1 }} />
              {/* <Typography variant="body2" sx={{ fontWeight: 600 }} gutterBottom>
              Stock: {movie.numberInStock}
            </Typography> */}

              {/*  */}
            </Box>
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                pt: 2,
                pl: 4,
              }}
            >
              <img
                src={`../../../public/${movie.image.name}`}
                alt="Movie Image"
                style={{ height: 300, objectFit: "cover" }}
              />

              <GenericButton
                sx={{ mt: 1, height: 35 }}
                onClick={handleRent}
                disabled={isUpdate}
                text={isDisabled ? <LoadingSpinner size={25} /> : "BUY"}
              />
              <GenericButton
                startIcon={<PlayArrowIcon />}
                sx={{ mb: 1, mt: 1 }}
                onClick={() => window.open(movie.trailerLink)}
                disabled={movie?.trailerLink?.length === 0}
                text="Watch Trailer"
              />
              {/* <TextField
              type={"number"}
              margin="normal"
              required
              disabled={isUpdate}
              fullWidth
              id="rentDay"
              label="Total Rent Date"
              name="rentDay"
              autoComplete="rentDay"
              value={rentDate}
              onChange={(e) => setRentDate(e.target.value)}
            /> */}
            </Box>
          </Paper>
          {showPaymentModal && (
            <PaymentForm
              visible={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onBuy={createRent}
            />
          )}
        </Box>
        <Box sx={{ bottom: -25, position: "relative" }}>
          <Footer />
        </Box>
      </Box>
    );
}
