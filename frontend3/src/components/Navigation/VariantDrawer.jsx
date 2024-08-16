import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from "@mui/icons-material/Movie";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
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
import MailIcon from "@mui/icons-material/Mail";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Colors,
  DEFAULT_ACTIV_TAB,
  STATUS_TYPE,
} from "../../helpers/constants";
import { capitalizeFirstLetter } from "../../helpers/textHelper";
import restClient from "../../helpers/restClient";
import { useEffect } from "react";
import { SERVER } from "../../constants";
import { useState } from "react";
import {
  Alert,
  Badge,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import GenericButton from "../Core/GenericButton";
import LoadingSpinner from "../Core/LoadingSpinner";
import CloseIcon from "@mui/icons-material/Close";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "#fff",
  border: "2px solid",
  borderColor: Colors.primary,
  p: 4,
  display: "flex",
  flexDirection: "column",
  boxShadow: 3,
  borderRadius: 2,
};

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
  const [notiList, setNotiList] = useState([]);
  const [openNotiBox, setOpenNotiBox] = useState(false);
  const [status, setStatus] = useState(STATUS_TYPE.idle); // forgotpass submit loading status
  const [pressedItem, setPressedItem] = useState(null);
  const [forgotStatus, setForgotStatus] = useState(0);

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

  async function getNoti() {
    const { data } = await restClient.get(`${SERVER}/forgotPassword`);
    setNotiList(data.data);
  }

  async function handleSendResetMail(email) {
    setStatus(STATUS_TYPE.loading);
    try {
      const { data } = await restClient.post(
        `${SERVER}/forgotPassword/${email}`
      );
      if (data.message.length !== 0) {
        setStatus(STATUS_TYPE.success);
        setPressedItem(null);
        getNoti();
        setForgotStatus(200);
        setTimeout(() => {
          setForgotStatus(0);
        }, 3000);
      }
    } catch (e) {
      console.log("[ERROR]: ", e.request);
      setStatus(STATUS_TYPE.error);
    }
  }

  useEffect(() => {
    getNoti();
  }, []);

  const notiCount = notiList.length;
  const isLoading = status === STATUS_TYPE.loading;

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
          <Tooltip title="Rest Password Notifications">
            <Badge
              badgeContent={notiCount}
              sx={{
                ml: 2,
                cursor: "pointer",
                "& .MuiBadge-badge": {
                  background: Colors.yellow,
                },
              }}
              onClick={() => {
                setOpenNotiBox(true);
              }}
            >
              <MailIcon color="White" />
            </Badge>
          </Tooltip>
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
      <Modal
        open={openNotiBox}
        onClose={() => {
          setOpenNotiBox(false);
        }}
      >
        <Box sx={[style]}>
          <Typography fontSize={18} color={Colors.primary} sx={{ mb: 4 }}>
            Rest Passord Request List
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ width: "100%" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notiList.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.email}
                    </TableCell>
                    <TableCell align="center">
                      <GenericButton
                        text={
                          isLoading && pressedItem === index ? (
                            <LoadingSpinner color={"White"} size={20} />
                          ) : (
                            "Send Rest Password"
                          )
                        }
                        isError
                        onClick={() => {
                          setPressedItem(index);
                          handleSendResetMail(item.email);
                        }}
                        size="small"
                        disabled={isLoading}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {forgotStatus === 200 ? (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              action={
                <CloseIcon
                  onClick={() => setForgotStatus(0)}
                  sx={{ cursor: "pointer" }}
                />
              }
              sx={{ mt: 2 }}
            >
              Successfully sent new password
            </Alert>
          ) : null}
        </Box>
      </Modal>
    </Box>
  );
}
