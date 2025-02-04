import { Box, CardMedia, Typography } from "@mui/material";
import React, { useState } from "react";
import GenericChip from "../Core/GenericChip";

export default function RecommendedMovieCard(props) {
  const { item } = props;

  return (
    <Box
      onClick={() =>
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(
            item.title
          )} movie`,
          "_blank"
        )
      }
      sx={{
        width: 180,
      }}
    >
      <CardMedia
        component="img"
        image={"../../../public/emptyImage.webp"}
        sx={{
          borderRadius: 2,
          height: 350,
          objectFit: "cover",
          width: 200,
          border: "3px solid #126180",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
            cursor: "pointer",
          },
        }}
      />
      <Box
        sx={{
          borderRadius: 2,
          position: "relative",
          top: -35,
          mr: -3,
          background:
            "linear-gradient(0deg,rgba(29,29,29,.7) 0,rgba(29,29,29,.7) 70%,rgba(29,29,29,0) 100%)",
        }}
      >
        <Typography
          variant="body2"
          component="div"
          sx={{
            fontWeight: 600,
            color: "white",
            alignSelf: "center",
            height: 35,
            mb: 2,
          }}
        >
          {item.title.slice(0, 20)}
          {item.title.length > 20 ? "..." : ""}
        </Typography>
      </Box>
    </Box>
  );
}
