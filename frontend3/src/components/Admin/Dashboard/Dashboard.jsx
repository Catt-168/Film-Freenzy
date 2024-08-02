import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import AdminNavigation from "../../Navigation/AdminNavigation";
import { useEffect } from "react";
import restClient from "../../../helpers/restClient";
import { SERVER } from "../../../constants";
import { useState } from "react";
import { Colors } from "../../../helpers/constants";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  const [pieData, setPieData] = useState([]);

  async function fetchPieData() {
    const response = await restClient.get(
      `${SERVER}/dashboard/getPieChartData`
    );
    setPieData(response.data.pieData);
  }

  useEffect(() => {
    fetchPieData();
  }, []);

  const sortedPieData = pieData?.sort((a, b) => b.value - a.value).slice(0, 6);
  console.log(sortedPieData);
  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavigation />
      <Box sx={{ padding: "2rem", mt: 5 }}>
        <PieChart
          colors={colors}
          series={[
            {
              data: sortedPieData,
            },
          ]}
          width={600}
          height={400}
        />
        <h1>Top Movies by Genre</h1>
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
