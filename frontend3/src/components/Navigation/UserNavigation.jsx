import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Colors, DEFAULT_ACTIV_TAB } from "../../helpers/constants";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

const navItems = ["home", "movies", "purchase", "edit", "logout"];

function UserNavigation() {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(
    JSON.parse(localStorage.getItem("active"))
  );

  const handleNavigate = (item) => {
    if (item !== "logout") return navigate(`/${item}`);

    localStorage.setItem("active", DEFAULT_ACTIV_TAB);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("page");
    navigate(isAuthenticated ? "/movies" : "/login", { replace: true });
    isAuthenticated ? window.location.reload() : null;
  };
  console.log("[Active Tab]: ", activeTab);
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        sx={{ background: Colors.primary, zIndex: 10, boxShadow: 0 }}
      >
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
              src={"/finalLogo.png"}
              style={{ width: 35, height: 35, cursor: "pointer" }}
              onClick={() => {
                localStorage.setItem("active", 0);
                navigate("/home");
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
                    ? item === "purchase" || item === "edit"
                      ? "none"
                      : ""
                    : "",
                }}
                onClick={() => {
                  setActiveTab(index);
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
