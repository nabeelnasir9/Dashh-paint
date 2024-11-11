/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import axios from "axios";
import SideMenuData from "./side-menu-data";
import { Grid, IconButton, Badge } from "@mui/material"; // Import Badge component
import "./index.css";
import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Logo from "../../assets/logo512.png";
import GridViewIcon from "@mui/icons-material/GridView";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchIcon from "./../../assets/svg/search.svg";
import NotificationIcon from "./../../assets/svg/notification.svg";

export const SideMenu = (props) => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newOrders, setNewOrders] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [notificationBadge, setNotificationBadge] = useState(false); // State to control badge visibility
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();
  let CurrentPagePath = location.pathname;

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const getNoti = useQuery({
    queryKey: ["getnoti"],
    queryFn: async () => {
      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/api/admin/order-noti`;
        const res = await axios.get(url);
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (getNoti.isSuccess) {
      const remain = parseInt(localStorage.getItem("noti")) || 0;
      const newData = parseInt(getNoti.data);
      const difference = newData - remain;
      if (difference > 0) {
        setNotificationBadge(true);
      }
      setNewOrders(difference);
      localStorage.setItem("noti", newData.toString());
    }
  }, [getNoti.isSuccess, getNoti.data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      <div>
        <Grid container>
          <Grid item xs={12} md={2}>
            <SideMenuData />
          </Grid>
          <Grid item xs={12} lg={10}>
            <div className="right-side-container">
              <div className="right-side-header-container">
                <div className="right-side-header-content-wrapper">
                  <div>
                    {isMatch ? (
                      <div>
                        <IconButton
                          onClick={() => {
                            setIsDrawerOpen(true);
                          }}
                        >
                          <MenuIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <div> </div>
                    )}

                    <Drawer
                      anchor="left"
                      open={isDrawerOpen}
                      onClose={handleDrawerClose}
                    >
                      <div>
                        <div className="sider-content-wraper">
                          <div
                            className="drawer-header-main"
                            style={{ paddingRight: "20px" }}
                          >
                            <img src={Logo} alt="Logo" />
                            <IconButton
                              onClick={() => {
                                handleDrawerClose();
                              }}
                              className="app-bar-component-drawer-close-btn"
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>
                          <div className="side-menu-data-list-main">
                            <ul className="side-menu-ul">
                              <li className="side-menu-list-item">
                                <Button
                                  variant="text"
                                  className={
                                    CurrentPagePath === "/"
                                      ? "side-menu-active-page"
                                      : "side-menu-page"
                                  }
                                  onClick={() => {
                                    navigate("/");
                                  }}
                                >
                                  <GridViewIcon />
                                  <span className="side-menu-page-title">
                                    dashboard
                                  </span>
                                </Button>
                              </li>
                              <li className="side-menu-list-item">
                                <Button
                                  variant="text"
                                  className={
                                    CurrentPagePath === "/orders"
                                      ? "side-menu-active-page"
                                      : "side-menu-page"
                                  }
                                  onClick={() => {
                                    navigate("/orders");
                                  }}
                                >
                                  <AddShoppingCartIcon />
                                  <span className="side-menu-page-title">
                                    Orders
                                  </span>
                                </Button>
                              </li>
                              {/* <li className="side-menu-list-item">
                                <Button
                                  variant="text"
                                  className={
                                    CurrentPagePath === "/profile"
                                      ? "side-menu-active-page"
                                      : "side-menu-page"
                                  }
                                  onClick={() => {
                                    navigate("/profile");
                                  }}
                                >
                                  <AccountCircleOutlinedIcon />
                                  <span className="side-menu-page-title">
                                    Profile
                                  </span>
                                </Button>
                              </li>
                              <br /> */}
                              <li className="side-menu-list-item">
                                <Button
                                  variant="text"
                                  className={
                                    CurrentPagePath === "/logout"
                                      ? "side-menu-active-page"
                                      : "side-menu-page"
                                  }
                                  onClick={() => {
                                    navigate("/log-in");
                                  }}
                                >
                                  <LogoutIcon />
                                  <span className="side-menu-page-title">
                                    Logout
                                  </span>
                                </Button>
                              </li>
                            </ul>
                          </div>
                          <div className="side-menu-footer-container">
                            {/* <Button */}
                            {/*   variant="text" */}
                            {/*   className={"side-menu-page"} */}
                            {/*   // onClick={() => { */}
                            {/*   //   navigate("/settings"); */}
                            {/*   // }} */}
                            {/* > */}
                            {/*   <LogoutOutlinedIcon /> */}
                            {/*   <span className="side-menu-page-title"> */}
                            {/*     Log Out */}
                            {/*   </span> */}
                            {/* </Button> */}
                          </div>
                        </div>
                      </div>
                    </Drawer>
                  </div>

                  <div className="side-menu-header">
                    <div className="header-search-main">
                      <img src={SearchIcon} />
                      <input
                        type="text"
                        placeholder="Search product, supplier, order"
                      />
                    </div>
                    <div>
                      <IconButton
                        id="basic-button"
                        className="side-menu-notificatin"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <Badge
                          badgeContent={notificationBadge ? "•" : null}
                          color="secondary"
                        >
                          <img src={NotificationIcon} />
                        </Badge>
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {Array.from({ length: newOrders }, (_, index) => (
                          <MenuItem key={index} onClick={handleClose}>
                            New Order {index + 1} at {currentTime}
                          </MenuItem>
                        ))}
                      </Menu>
                      {/* <Button
                        variant="text"
                        className="side-menu-profile"
                        onClick={() => navigate("/profile")}
                      >
                        <img src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp" />
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className={"side-menu-children-data"}>{props.children}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default SideMenu;
