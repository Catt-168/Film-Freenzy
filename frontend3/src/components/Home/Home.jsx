import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserNavigation from "../Navigation/UserNavigation";
import useAuth from "../hooks/useAuth";
import { Colors, STATUS_TYPE } from "../../helpers/constants";
import GenericButton from "../Core/GenericButton";
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
export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [popularMovies, setPopularMovies] = useState([]);
  const [newRelasedMovies, setNewReleasedMovies] = useState([]);
  const [topMovie, setTopMovie] = useState({});
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS_TYPE.idle);

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
            paddingRight: "2rem",
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
              <Typography
                variant="h2"
                gutterBottom
                sx={{ marginTop: 5, fontSize: "78px", color: Colors.textWhite }}
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
                }}
              >
                {topMovie?.description}
              </Typography>
              <GenericButton
                startIcon={<PlayArrowIcon />}
                text="Watch Now"
                sx={{ background: Colors.yellow, mt: 10, ml: "45%" }}
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
                      <MovieCard item={item} handleClick={handleClick} />
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
                      <MovieCard item={item} handleClick={handleClick} />
                    </Box>
                  ))}
                </Slider>
              </Box>
            ) : null}
          </Box>
          <Grid container sx={{ width: "100%", height: "auto" }}>
            <Grid
              item
              xs={12}
              lg={6}
              md={6}
              sx={{ background: Colors.primary, width: "100%", height: 340 }}
            >
              <h2 style={{ fontSize: "21px", color: Colors.textWhite }}>
                Visit our website
              </h2>
              <h1 style={{ fontSize: "46px", color: Colors.textWhite }}>
                Watch Anywhere
              </h1>
              <p style={{ fontSize: "18px", color: Colors.textWhite }}>
                Visit our webiste and enjoy high-quality movies and TV shows
                anywhere.
              </p>
            </Grid>
            <Grid item xs={12} lg={6} md={6} sx={{}}>
              <img src={"/hardBG.png"} />
            </Grid>
          </Grid>
        </Box>

        <Footer />
      </Box>
    );
}
