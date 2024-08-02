import React from "react";
import { Colors } from "../../helpers/constants";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer
      style={{
        margin: 0,
        padding: 0,
        background: Colors.yellow,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

        position: "absolute",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "flex" },
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img
            src={"/finalLogo.png"}
            style={{ width: 35, height: 35, cursor: "pointer" }}
          />

          <span style={{ fontWeight: "bold", color: Colors.textWhite }}>
            Film Freenzy!
          </span>

          {/* <span style={{ color: Colors.yellow, fontWeight: "bold" }}>
              {user?.name}
            </span> */}
        </Typography>
      </Box>
      <Box>
        <h3 style={{ color: Colors.textWhite }}>
          &copy; All rights reserved. Privacy Policy
        </h3>
      </Box>
    </footer>
  );
}
