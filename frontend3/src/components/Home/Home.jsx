import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UserNavigation from "../Navigation/UserNavigation";
import useAuth from "../hooks/useAuth";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Colors, STATUS_TYPE } from "../../helpers/constants";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GenericButton from "../Core/GenericButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import restClient from "../../helpers/restClient";
import { SERVER } from "../../constants";
import MovieCard from "../Movies/MovieCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import LoadingSpinner from "../Core/LoadingSpinner";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { convertMinutesToHoursAndMinutes } from "../../helpers/textHelper";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [popularMovies, setPopularMovies] = useState([]);
  const [newRelasedMovies, setNewReleasedMovies] = useState([]);
  const [topMovie, setTopMovie] = useState({});
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS_TYPE.idle);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const fetchPopularMovies = async () => {
    try {
      const { data } = await restClient.get(`${SERVER}/movies/popular`);
      setPopularMovies(data.movies);
      setStatus(STATUS_TYPE.success);
    } catch (e) {
      setStatus(STATUS_TYPE.error);
    }
  };

  const fetchNewReleasedMovies = async () => {
    try {
      const { data } = await restClient.get(`${SERVER}/movies/newReleased`);
      setNewReleasedMovies(data.movies);
      setStatus(STATUS_TYPE.success);
    } catch (e) {
      setStatus(STATUS_TYPE.error);
    }
  };

  const fetchRandomMovie = async () => {
    try {
      const { data } = await restClient.get(`${SERVER}/movies/getRandom`);
      setTopMovie(data.movie);
    } catch (e) {
      setStatus(STATUS_TYPE.error);
    }
  };

  useEffect(() => {
    setStatus(STATUS_TYPE.loading);
    fetchPopularMovies();
    fetchNewReleasedMovies();
    fetchRandomMovie();
  }, []);

  async function handleClick(id) {
    navigate(`/movies/${id}`, { state: { id } });
  }

  const { hours, remainingMinutes } = convertMinutesToHoursAndMinutes(
    topMovie.length
  );

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  function handleSubmit() {}

  const isLoading = status === STATUS_TYPE.loading;
  const isSuccess = status === STATUS_TYPE.success;

  if (isLoading) return <LoadingSpinner />;
  if (isSuccess)
    return (
      <Box>
        <UserNavigation />

        <Box
          sx={{
            paddingTop: "0.5rem",
          }}
        >
          <Grid
            container
            sx={{ width: "100%", height: "55vh", marginTop: 5 }}
            rowSpacing={1}
          >
            <Grid
              item
              xs={12}
              lg={9}
              md={9}
              sx={{ background: Colors.primary, width: "100%", mt: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: 2,
                  width: "60%",
                  borderRadius: 2,
                  mb: 1,
                  ml: "19.5%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <CalendarMonthIcon sx={{color: Colors.textWhite, mr: 1 }} />
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "Arial",
                      marginLeft: 2,
                      marginRight: 2,
                      color: Colors.textWhite,
                    }}
                  >
                    {topMovie.releasedYear}
                  </p>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ ml: 1, mr: 1 }}
                  />
                  <StarOutlineIcon sx={{color: Colors.textWhite, mr: 1 }} />
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "Arial",
                      ml: 1,
                      mr: 1,
                      color: Colors.textWhite,
                    }}
                  >
                    {topMovie.rating} / 5
                  </p>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ marginLeft: 2, marginRight: 1 }}
                  />
                  {/* {movie.genre.map((g) => (
                    <GenericChip label={g.name} sx={{ mr: 1 }} key={g._id} />
                  ))} */}
                  <AccessTimeIcon sx={{color: Colors.textWhite }}/>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ mt: 0.5, ml: 1, color: Colors.textWhite, fontWeight: "bold" }}
                  >
                    {hours} hr {remainingMinutes} minutes
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontSize: "58px",
                  color: Colors.textWhite,
                  textAlign: "left",
                  ml: "21%",
                }}
              >
                {topMovie?.title}
              </Typography>

              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  ml: "21%",
                  mr: "10%",
                  width: "60%",
                  textAlign: "left",
                  color: Colors.textWhite,
                  fontSize: 16,
                }}
              >
                {topMovie?.description}
              </Typography>
              <GenericButton
                startIcon={<PlayArrowIcon />}
                text="Watch Now"
                sx={{ background: Colors.yellow, mt: 10, ml: "50%" }}
                onClick={() => {
                  handleClick(topMovie._id);
                }}
              />
            </Grid>
            <Grid item xs={12} lg={3} md={3} sx={{ mt: 2.5 }}>
              <img
                src={`/${topMovie?.image?.name}`}
                style={{ width: 300, height: 400, objectFit: "cover" }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 20 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: Colors.primary, fontSize: 42, fontWeight: 700 }}
            >
              Popular Movies
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ mt: 1, color: Colors.grey }}
            >
              Here are some of the most popular movies that our users & viewers
              enjoy.
            </Typography>

            {popularMovies.length !== 0 ? (
              <Box
                sx={{
                  width: "55%",
                  ml: "25%",
                  mt: 2,
                }}
              >
                <Slider {...settings}>
                  {popularMovies.map((item, index) => (
                    <Box sx={{ mt: 10 }}>
                      <MovieCard
                        item={item}
                        handleClick={handleClick}
                        removeGenre={true}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            ) : null}
          </Box>
          <Box sx={{ mt: -5 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: Colors.primary, fontSize: 42, fontWeight: 700 }}
            >
              New releases
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ mt: 1, color: Colors.grey }}
            >
              Check out the highly rated TV shows, available at Film Freenzy.
            </Typography>

            {newRelasedMovies.length !== 0 ? (
              <Box
                sx={{
                  width: "55%",
                  ml: "25%",
                  mt: 2,
                }}
              >
                <Slider {...settings}>
                  {newRelasedMovies.map((item, index) => (
                    <Box sx={{ mt: 10 }}>
                      <MovieCard
                        item={item}
                        handleClick={handleClick}
                        removeGenre={true}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            ) : null}
          </Box>
          <Grid container sx={{ overflowX: "hidden" }}>
          <Grid item xs={12} lg={6} md={6} sx={{}}>
              <img src={"/hardBG.png"} />
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
              md={6}
              sx={{
                background: Colors.primary,
                width: "100%",
                height: 340,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "21px",
                  color: Colors.textWhite,
                  fontFamily: "Arial",
                }}
              >
                Visit our website
              </h2>
              <h1
                style={{
                  fontSize: "46px",
                  color: Colors.textWhite,
                  fontFamily: "Arial",
                }}
              >
                Watch Anywhere
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  color: Colors.textWhite,
                  fontFamily: "Arial",
                }}
              >
                Visit our webiste and enjoy high-quality movies and TV shows
                anywhere.
              </p>
            </Grid>

          </Grid>
          <Grid container sx={{ width: "100%" }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: Colors.primary,
                fontSize: 42,
                fontWeight: 700,
                textAlign: "center",
                width: "100%",
              }}
            >
              Get in Touch
            </Typography>

            <Grid md={6} lg={6}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: Colors.primary, fontWeight: 700 }}>
                  Send a Message
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mt: 1, mb: 1, width: "80%" }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mt: 1, mb: 1, width: "80%" }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    sx={{ mt: 1, mb: 1, width: "80%" }}
                  />
                </form>
                <GenericButton
                  text="Send"
                  onClick={() => {
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  }}
                  sx={{ mt: 1, mb: 1 }}
                />
              </Box>
            </Grid>
            <Grid md={6} lg={6}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: Colors.primary, fontWeight: 700  }}>
                  Our Location
                </Typography>
                <img
                  src={`jMapJS.png`}
                  alt="NO MAP"
                  style={{ objectFit: "cover", width: 450 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Footer />
      </Box>
    );
}
