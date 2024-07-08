import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Colors } from "../../helpers/constants";
import useAuth from "../hooks/useAuth";

const navItems = ["movies", "rentals", "edit", "logout"];

function UserNavigation() {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const { isAuthenticated, user } = useAuth();
  const activeTab = JSON.parse(localStorage.getItem("active")) || 0;

  const handleNavigate = (item) => {
    if (item !== "logout") return navigate(`/${item}`);

    localStorage.removeItem("active");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("page");
    navigate(isAuthenticated ? "/movies" : "/login", { replace: true });
    isAuthenticated ? window.location.reload() : null;
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav" sx={{ background: Colors.primary, zIndex: 10 }}>
        <Toolbar>
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
              src={"/logoColor.png"}
              style={{ width: 40, height: 40, cursor: "pointer" }}
              onClick={() => {
                localStorage.setItem("active", 0);
                navigate("/movies");
              }}
            />
            <span>
              Hello Welcome To{" "}
              <span style={{ color: Colors.yellow, fontWeight: "bold" }}>
                Film Freenzy!
              </span>
            </span>
            {/* <span style={{ color: Colors.yellow, fontWeight: "bold" }}>
              {user?.name}
            </span> */}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item, index) => (
              <Button
                key={item}
                sx={{
                  color: "#fff",
                  fontWeight: activeTab === index ? "bold" : "",
                  display: !isAuthenticated
                    ? item === "rentals" || item === "edit"
                      ? "none"
                      : ""
                    : "",
                }}
                onClick={() => {
                  localStorage.setItem("active", index);
                  handleNavigate(item);
                }}
              >
                {item === "logout" ? (isAuthenticated ? item : "login") : item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default UserNavigation;
