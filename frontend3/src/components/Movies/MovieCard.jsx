import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import { capitalizeFirstLetterinSentence } from "../../helpers/textHelper";

export default function MovieCard({ item, handleClick }) {
  return (
    <Card sx={{ height: 750, maxWidth: 300 }} key={item._id}>
      <CardMedia
        component="img"
        image={item.image.name}
        sx={{ height: 400, objectFit: "contain", width: "100%" }}
      />
      <CardContent>
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
          {/* <Typography variant="body2" sx={{ fontWeight: 600 }} gutterBottom>
                Duration: {item.length} minutes
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }} gutterBottom>
                Released Date: {formatReadableDate(item.releasedYear)}
              </Typography> */}
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
          {/* <Typography variant="body2" sx={{ fontWeight: 600 }} gutterBottom>
                Stock: {item.numberInStock}
              </Typography> */}
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
      </CardContent>
    </Card>
  );
}
