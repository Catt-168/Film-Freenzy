import { Box, Slider, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import * as React from "react";
import { useEffect, useState } from "react";
import { SERVER } from "../../../constants";
import { Colors } from "../../../helpers/constants";
import restClient from "../../../helpers/restClient";
import useAuth from "../../hooks/useAuth";
import AdminNavigation from "../../Navigation/AdminNavigation";

const PIE_SLIDER_MIN = 3;

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  const [pieData, setPieData] = useState([]);
  const [pieDataCount, setPieDataCount] = useState(3);
  const [barChartData, setBarchData] = useState([]);

  async function fetchPieData() {
    const response = await restClient.get(
      `${SERVER}/dashboard/getPieChartData`
    );
    setPieData(response.data.pieData);
  }

  async function fetchBarChartData() {
    const response = await restClient.get(
      `${SERVER}/dashboard/getBarChartData`
    );
    setBarchData(response.data.barChartData);
  }

  useEffect(() => {
    fetchPieData();
    fetchBarChartData();
  }, []);

  const moviesData = [
    { movieId: 1, title: "Movie A", rentalCount: 100 },
    { movieId: 2, title: "Movie B", rentalCount: 80 },
    // ... more movies
  ];
  const chartData = {
    columns: [
      { field: "title", headerName: "Movie Title", width: 200 },
      { field: "rentalCount", headerName: "Rental Count", type: "number" },
    ],
    rows: moviesData,
  };
  const sortedPieData = pieData
    ?.sort((a, b) => b.value - a.value)
    .slice(0, pieDataCount);

  const barChartX = [];
  const barChartY = [];
  barChartData.forEach((b) => {
    barChartX.push(b[0]);
    barChartY.push(b[1]);
  });
  console.log(pieDataCount);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AdminNavigation />
      <Box
        sx={{
          mt: 15,
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          gap: 5,
          width: "70%",
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            ml: 5,
            border: "1px solid #D3D3D3",
            borderRadius: 2,
            maxHeight: 500,
          }}
        >
          <Typography id="input-item-number" gutterBottom>
            Number of items
          </Typography>
          <Slider
            value={pieDataCount}
            onChange={(e, newValue) => setPieDataCount(newValue)}
            valueLabelDisplay="auto"
            min={PIE_SLIDER_MIN}
            max={pieData.length}
            aria-labelledby="input-item-number"
          />
          <PieChart
            colors={colors}
            series={[
              {
                data: sortedPieData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            width={800}
            height={300}
          />
          <Typography fontSize={24} color={Colors.primary}>
            Top Movies by Genre
          </Typography>
        </Box>

        <Box
          sx={{
            padding: "1rem",
            ml: 5,
            border: "1px solid #D3D3D3",
            borderRadius: 2,
            maxHeight: 400,
          }}
        >
          <BarChart
            xAxis={[{ scaleType: "band", data: barChartX }]}
            series={[
              {
                data: barChartY,
              },
            ]}
            width={900}
            height={300}
            colors={colors}
          />
          <Typography fontSize={18} color={Colors.primary}>
            Top Purchased Movies
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const colors = [
  Colors.primary,
  Colors.secondary,
  Colors.yellow,
  "#FF5733", // Red-Orange
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FF33A8", // Pink
  "#FFD733", // Yellow
  "#33FFF3", // Cyan
  "#8A33FF", // Purple
  "#FF8333", // Orange
  "#33FF83", // Light Green
  "#3383FF", // Light Blue
  "#FF3383", // Magenta
  "#FFF333", // Light Yellow
  "#33FFF8", // Light Cyan
  "#8333FF", // Violet
  "#FF338A", // Dark Pink
  "#33FFD7", // Aqua
  "#D733FF", // Deep Purple
  "#FF5733", // Coral
  "#33FF8A", // Mint
];
