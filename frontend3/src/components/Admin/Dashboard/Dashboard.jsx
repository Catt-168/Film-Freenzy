import { Box, Slider, TextField, Typography } from "@mui/material";
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

  const [purchasedMovieCount, setPurchasedMovieCount] = useState(0); // tpm limit
  const [barChartCount, setBarChartCount] = useState(5); // bar chart count for backend tpm
  const [bcX, setBcX] = useState([]); // x-axis
  const [bcY, setBcY] = useState([]); // y-axis

  async function fetchPieData() {
    const response = await restClient.get(
      `${SERVER}/dashboard/getPieChartData`
    );
    setPieData(response.data.pieData);
  }

  async function fetchBarChartData() {
    const response = await restClient.get(
      `${SERVER}/dashboard/getBarChartData/${barChartCount}`
    );
    // setBarchData(response.data.barChartData);
    setPurchasedMovieCount(response.data.totalCount);

    setBcX(response.data.barChartData.map((item) => item[0]));
    setBcY(response.data.barChartData.map((item) => item[1]));
  }

  useEffect(() => {
    fetchPieData();
    fetchBarChartData();
  }, []);

  const sortedPieData = pieData
    ?.sort((a, b) => b.value - a.value)
    .slice(0, pieDataCount);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchBarChartData();
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AdminNavigation />
      <Box
        sx={{
          mt: 15,
          display: "flex",

          // flexDirection: "column",
          // flexWrap: "nowrap",

          // width: "70%",
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            ml: 5,
            border: "1px solid #D3D3D3",
            borderRadius: 2,
            maxHeight: 450,
          }}
        >
          <Typography id="input-item-number" gutterBottom fontSize={13}>
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
                // outerRadius: 100,
                cx: 140,
                // cy: 100,
              },
            ]}
            width={pieDataCount >= 10 ? (pieDataCount >= 18 ? 550 : 480) : 360}
            height={300}
            slotProps={{
              legend: {
                // direction: "row",
                // position: { vertical: "bottom", horizontal: "middle" },
                padding: 0,
                labelStyle: {
                  fontSize: 12,
                },
                itemMarkWidth: 6,
                itemMarkHeight: 6,
              },
            }}
          />
          <Typography fontSize={24} color={Colors.primary} mt={2}>
            Top Movies by Genre
          </Typography>
        </Box>

        <Box
          sx={{
            padding: "1rem",
            ml: 5,
            border: "1px solid #D3D3D3",
            borderRadius: 2,
            maxHeight: 450,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <TextField
              id="outlined-controlled"
              label={"Bar Chart Count"}
              value={barChartCount}
              onChange={(event) => {
                setBarChartCount(event.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <p>{`Maximum Count ${purchasedMovieCount}`}</p>
          </Box>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: bcX,
                tickLabelStyle: {
                  textAnchor: "start",
                  fontSize: 11,
                  angle: 50,
                },
              },
            ]}
            series={[
              {
                data: bcY,
              },
            ]}
            width={pieDataCount >= 10 ? (pieDataCount >= 18 ? 400 : 480) : 600}
            height={310}
            colors={colors}
          />
          <Typography fontSize={24} color={Colors.primary} mt={2}>
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
