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
import DashboardIcon from "@mui/icons-material/Dashboard";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Colors, DEFAULT_ACTIV_TAB } from "../../helpers/constants";
import { capitalizeFirstLetter } from "../../helpers/textHelper";

const drawerWidth = 240;
const navItems = [
  "dashboard",
  "movies",
  "actors",
  "users",
  "genres",
  "languages",
  "purchases",
];

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
  const activeTab = JSON.parse(localStorage.getItem("active")) || 0;

  const handleNavigate = (item) => {
    if (item !== "logout") return navigate(`/admin/${item}`);

    localStorage.setItem("active", DEFAULT_ACTIV_TAB);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("navigation");
    navigate("/movies");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem("navigation", String(true));
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem("navigation", String(true));
  };

  function generateIcons(item, index) {
    const sxProp = {
      color: activeTab === index ? Colors.primary : "",
    };

    switch (item) {
      case "dashboard":
        return <DashboardIcon sx={sxProp} />;
      case "users":
        return <PersonIcon sx={sxProp} />;
      case "actors":
        return <FaceRetouchingNaturalIcon sx={sxProp} />;
      case "movies":
        return <MovieIcon sx={sxProp} />;
      case "genres":
        return <RedditIcon sx={sxProp} />;
      case "languages":
        return <LanguageIcon sx={sxProp} />;
      case "purchases":
        return <MovieFilterIcon sx={sxProp} />;
      case "logout":
        return <LogoutIcon sx={sxProp} />;
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={true} sx={{ background: Colors.primary }}>
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
          sx={{ background: theme.direction === "rtl" ? "" : Colors.primary }}
        >
          <IconButton onClick={handleDrawerClose}>
            {
              theme.direction === "rtl" ? <ChevronRightIcon /> : null
              // <ChevronLeftIcon sx={{ color: Colors.textWhite }} />
            }
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navItems.map((item, index) => (
            <ListItem
              key={item}
              disablePadding
              onClick={() => {
                localStorage.setItem("active", index);
                handleNavigate(item);
              }}
            >
              <ListItemButton>
                <ListItemIcon>{generateIcons(item, index)}</ListItemIcon>
                <ListItemText
                  primary={capitalizeFirstLetter(item)}
                  primaryTypographyProps={{
                    fontWeight: activeTab === index ? "bold" : "",
                  }}
                  sx={{
                    color: activeTab === index ? Colors.primary : "",
                  }}
                />
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
