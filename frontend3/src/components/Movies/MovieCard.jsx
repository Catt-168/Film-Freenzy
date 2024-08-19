import { Box, CardMedia, Typography } from "@mui/material";
import React, { useState } from "react";
import GenericChip from "../Core/GenericChip";

export default function MovieCard(props) {
  const { item, handleClick, removeGenre = false } = props;
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Box
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => handleClick(item._id)}
      sx={{
        position: "relative",
        width: 180,
        mt: -10,
      }}
    >
      <CardMedia
        component="img"
        image={item.image.name}
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
          top: -60,
          mr: -3,
          background:
            "linear-gradient(0deg,rgba(29,29,29,.7) 0,rgba(29,29,29,.7) 70%,rgba(29,29,29,0) 100%)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            top: -10,
            opacity: !removeGenre ? 1 : 0,
          }}
        >
          {item.genre.map((g, index) => (
            <GenericChip
              label={g.name}
              key={g._id}
              color="primary"
              size="small"
              sx={{ display: index > 1 ? "none" : "", mr: 1 }}
            />
          ))}
        </Box>
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
