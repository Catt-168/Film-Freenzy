import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from "@mui/icons-material/Movie";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import PersonIcon from "@mui/icons-material/Person";
import RedditIcon from "@mui/icons-material/Reddit";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../helpers/textHelper";

const drawerWidth = 240;
const navItems = ["users", "movies", "genres", "languages", "rentals"];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function VariantDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(
    localStorage.getItem("navigation") === "true"
  );
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    if (item !== "logout") return navigate(`/admin/${item}`);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("navigation");
    navigate("/login");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem("navigation", String(true));
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem("navigation", String(false));
  };

  console.log("navigation", open);

  function generateIcons(item) {
    switch (item) {
      case "users":
        return <PersonIcon />;
      case "movies":
        return <MovieIcon />;
      case "genres":
        return <RedditIcon />;
      case "languages":
        return <LanguageIcon />;
      case "rentals":
        return <MovieFilterIcon />;
      case "logout":
        return <LogoutIcon />;
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,

              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Site - Admin Name
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{ background: theme.direction === "rtl" ? "" : "#1976d2" }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon sx={{ color: "#fff" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navItems.map((item, index) => (
            <ListItem
              key={item}
              disablePadding
              onClick={() => handleNavigate(item)}
            >
              <ListItemButton>
                <ListItemIcon>{generateIcons(item)}</ListItemIcon>
                <ListItemText primary={capitalizeFirstLetter(item)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding onClick={() => handleNavigate("logout")}>
            <ListItemButton>
              <ListItemIcon>{<LogoutIcon />}</ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
