import { Avatar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Colors, DEFAULT_ACTIV_TAB } from "../../helpers/constants";
import { capitalizeName } from "../../helpers/textHelper";
import useAuth from "../hooks/useAuth";

const navItems = ["home", "movies", "purchase", , "about us", "user"];

const defaultState = [
  { id: 0, hover: false },
  { id: 1, hover: false },
];
function UserNavigation() {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const { isAuthenticated, user } = useAuth();

  const [activeTab, setActiveTab] = useState(
    JSON.parse(localStorage.getItem("active"))
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(defaultState);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (item) => {
    if (item === "user" && isAuthenticated) {
      return toggleDropdown();
    } else if (item === "user" && !isAuthenticated) {
      return navigate(`/login`);
    }
    navigate(`/${item}`);
  };

  function logout() {
    localStorage.setItem("active", DEFAULT_ACTIV_TAB);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("page");
    localStorage.removeItem("filter");
    navigate(isAuthenticated ? "/home" : "/login", { replace: true });
    isAuthenticated ? window.location.reload() : null;
  }

  function handleUserActions() {
    const selected = isHover.find((item) => item.hover);
    navigate(selected.id === 0 ? `/edit` : logout());
  }

  return (
    <Box sx={{ display: "flex" }} onMouseLeave={() => setIsOpen(false)}>
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
                  fontWeight:
                    activeTab === null
                      ? index === 0
                        ? "bold"
                        : ""
                      : activeTab === index
                      ? "bold"
                      : "",
                  display: !isAuthenticated
                    ? item === "purchase"
                      ? item === "user"
                        ? "Login"
                        : "none"
                      : ""
                    : "",
                  textTransform:
                    item === "user" && isAuthenticated ? "none" : "",
                }}
                onClick={() => {
                  setActiveTab(index);
                  localStorage.setItem("active", index);
                  handleNavigate(item);
                }}
              >
                {item === "user" && isAuthenticated ? (
                  <Avatar
                    alt={user?.name}
                    src={`/${user?.image?.name}`}
                    sx={{ width: 30, height: 30, mr: 0.5 }}
                  />
                ) : null}
                {item === "logout"
                  ? isAuthenticated
                    ? item
                    : "login"
                  : item === "user" && !isAuthenticated
                  ? "login"
                  : item === "user"
                  ? capitalizeName(user.name)
                  : item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      {isOpen ? (
        <div
          style={{
            position: "absolute",
            marginTop: 60,
            right: 10,
            backgroundColor: "#f9f9f9",
            minWidth: 160,
            boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
            zIndex: 1,
          }}
        >
          <ul style={{ listStyle: "none", padding: 2, cursor: "pointer" }}>
            <li
              style={{
                borderBottom: "1px solid black",
                paddingTop: 3,
                paddingBottom: 10,
                color: isHover[0].hover ? Colors.primary : Colors.textBlack,
                fontFamily: "Arial",
                fontSize: 18,
              }}
              onMouseEnter={() =>
                setIsHover((isHover) =>
                  isHover.map((hov) =>
                    hov.id === 0 ? { ...hov, hover: true } : hov
                  )
                )
              }
              onMouseLeave={() =>
                setIsHover((isHover) =>
                  isHover.map((hov) =>
                    hov.id === 0 ? { ...hov, hover: false } : hov
                  )
                )
              }
              onClick={handleUserActions}
            >
              Edit
            </li>
            <li
              style={{
                fontSize: 18,
                marginTop: 10,
                color: isHover[1].hover ? Colors.primary : Colors.textBlack,
                fontFamily: "Arial",
              }}
              onMouseEnter={() =>
                setIsHover((isHover) =>
                  isHover.map((hov) =>
                    hov.id === 1 ? { ...hov, hover: true } : hov
                  )
                )
              }
              onMouseLeave={() =>
                setIsHover((isHover) =>
                  isHover.map((hov) =>
                    hov.id === 1 ? { ...hov, hover: false } : hov
                  )
                )
              }
              onClick={handleUserActions}
            >
              Logout
            </li>
          </ul>
        </div>
      ) : null}
    </Box>
  );
}

export default UserNavigation;
