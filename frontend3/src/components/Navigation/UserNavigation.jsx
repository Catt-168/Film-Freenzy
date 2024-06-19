import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Colors } from "../../helpers/constants";

const navItems = ["movies", "rentals", "edit", "logout"];

function UserNavigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const activeTab = JSON.parse(localStorage.getItem("active")) || 0;

  const handleNavigate = (item) => {
    if (item !== "logout") return navigate(`/${item}`);

    localStorage.removeItem("active");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("page");
    navigate("/login");
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav" sx={{ background: Colors.primary }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Hello Welcome To Diggie Movies!{" "}
            <span style={{ color: "#ffb703", fontWeight: "bold" }}>
              {user.name}
            </span>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item, index) => (
              <Button
                key={item}
                sx={{
                  color: "#fff",
                  fontWeight: activeTab === index ? "bold" : "",
                }}
                onClick={() => {
                  localStorage.setItem("active", index);
                  handleNavigate(item);
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default UserNavigation;
