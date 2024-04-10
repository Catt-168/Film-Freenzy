import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const navItems = [
  "users",
  "movies",
  "genres",
  "languages",
  "rentals",
  "logout",
];

function AdminNavigation(props) {
  const { window } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleNavigate = (item) => {
    if (item !== "logout") return navigate(`/admin/${item}`);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Admin Panel
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ color: "#fff" }}
                onClick={() => handleNavigate(item)}
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

export default AdminNavigation;
