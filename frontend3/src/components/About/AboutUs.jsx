// src/AboutMe.js
import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
} from "@mui/material";
import UserNavigation from "../Navigation/UserNavigation";
import Footer from "../Footer/Footer";
import { Colors } from "../../helpers/constants";

const hobbies = [
  {
    name: "Photography",
    description: "I love capturing moments and creating memories.",
  },
  {
    name: "Reading",
    description: "I enjoy reading books on various topics, especially fiction.",
  },
];

function AboutMe() {
  return (
    <Box>
      <UserNavigation />
      {/* <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={12}
        mx={38}
      >
        <Avatar
          alt="Thin Kabyar Oo"
          src={`/me.png`}
          sx={{ width: 150, height: 150, mb: 2 }}
        />
        <Typography variant="h4" align="center" gutterBottom>
          Thin Kabyar Oo
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Hi, I'm Kabyar, a passionate developer with a love for coding,
          technology, and creative problem-solving. With a background in
          computer science, I enjoy building innovative solutions that make a
          difference.
        </Typography>
      </Box>

      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ mt: 1, mb: 1 }}
      >
        My Hobbies
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3.9 }}>
        {hobbies.map((hobby, index) => (
          <Box key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {hobby.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {hobby.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box> */}
      <Grid container mt={12} spacing={4}>
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            fontSize={27}
            sx={{ color: Colors.primary, mb: 2, fontWeight: "bold" }}
          >
            About Us
          </Typography>
          <Typography
            fontSize={15}
            textAlign={"center"}
            sx={{ color: "#707070", padding: 3 }}
          >
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </Typography>
          <Typography
            fontSize={15}
            textAlign={"center"}
            sx={{ color: "#707070", padding: 3 }}
          >
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={"/hardBG.png"} style={{ height: 423 }} />
        </Grid>
      </Grid>

      <Footer />
    </Box>
  );
}

export default AboutMe;
