import React from "react";
import { Colors } from "../../helpers/constants";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

export default function Footer() {
  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ mt: "auto", background: Colors.primary }}
    >
      <Container maxWidth="md">
        <Toolbar>
          <Typography
            variant="body1"
            color="inherit"
            align="center"
            style={{ width: "100%" }}
          >
            © 2024 Film Freenzy. All rights reserved.
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
