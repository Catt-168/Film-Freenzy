import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import UserNavigation from "../Navigation/UserNavigation";
import Footer from "../Footer/Footer";
import { Colors } from "../../helpers/constants";

function AboutMe() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      <UserNavigation />

      <Box
        component="main"
        sx={{flexGrow: 1, mt: 12}}
      >
        <Grid container spacing={4} >
          {/* Centering the image in the grid */}
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <img
              src={"/hardBG.png"}
              style={{ height: 423, maxWidth: "100%" }}
              alt="Background"
            />
          </Grid>

          {/* Text content */}
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            sx={{ textAlign: "left", padding: 2 }}
          >
            <Typography
              fontSize={27}
              sx={{ color: Colors.primary, mb: 2, fontWeight: "bold" }}
            >
              About Us
            </Typography>
            <Typography
              fontSize={15}
              sx={{ color: "#707070" }}
            >
            Our Online Movie Management System is a harmonious blend of technology and passion, crafted to elevate your cinematic journey. Imagine a digital sanctuary where your cherished films are meticulously organized, effortlessly accessible, and beautifully displayed. With every click, our system unveils a world of endless possibilities, allowing you to explore, discover, and revel in the art of cinema. Each feature is thoughtfully designed to cater to your unique tastes, ensuring that your movie collection is as dynamic and vibrant as the stories it holds.
            </Typography>
            <Typography
              fontSize={15}
              sx={{ color: "#707070", mt: 2 }}
            >
            Immerse yourself in a platform designed to celebrate storytelling and the magic of cinema. Whether curating your personal collection or discovering new favorites, our system offers a seamless journey through creativity and emotion. Let us be your guide in this enchanting adventure, where every film is a gateway to unforgettable experiences.            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}

export default AboutMe;
