import { Box, CardMedia, Typography } from "@mui/material";
import React, { useState } from "react";
import GenericChip from "../Core/GenericChip";

export default function MovieCard({ item, handleClick }) {
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
          position: "relative",
          top: -60,
          mr: -3,
          background:
            "linear-gradient(0deg,rgba(29,29,29,.7) 0,rgba(29,29,29,.7) 70%,rgba(29,29,29,0) 100%)",
          // visibility: isVisible ? "" : "hidden",
        }}
      >
        <Box sx={{ position: "relative", top: -10 }}>
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
      <Box></Box>
      {/* <CardContent>
        {item.genre.map((g) => (
          <Chip
            label={g.name}
            sx={{ mr: 1 }}
            key={g._id}
            color="success"
            variant="filled"
          />
        ))}
        <Typography
          variant="h5"
          component="div"
          sx={{ mt: 1, mb: 1, height: 80, fontWeight: 600 }}
        >
          {capitalizeFirstLetterinSentence(item.title)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "left" }}
        >
          {item.description.slice(0, 100)}.....
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }} gutterBottom>
            Rating:
            <Rating
              name="read-only"
              value={item.rating}
              readOnly
              size="small"
              sx={{ position: "absolute" }}
            />
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 600 }} gutterBottom>
            Fee: {item.dailyRentalRate}$ per Day
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{ width: "100%", mt: 1.5 }}
          onClick={() => handleClick(item._id)}
        >
          Go To Details
        </Button>
      </CardContent> */}
    </Box>
  );
}
