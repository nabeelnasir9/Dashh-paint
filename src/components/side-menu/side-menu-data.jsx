import "./side-menu-data.css";
import { useTheme } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo512.png";
import GridViewIcon from "@mui/icons-material/GridView";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
const SideMenuData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let CurrentPagePath = location.pathname;
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <>
      {isMatch ? (
        <div></div>
      ) : (
        <div
          className="side-menu-container"
          style={{ position: isMatch ? "" : "fixed" }}
        >
          <div className="sider-content-wraper">
            <div className="side-menu-logo-container">
              <img src={Logo} alt="Logo" />
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
                    <span className="side-menu-page-title">dashboard</span>
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
                    <span className="side-menu-page-title">Orders</span>
                  </Button>
                </li>
                <li className="side-menu-list-item">
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
                    <span className="side-menu-page-title">Profile</span>
                  </Button>
                </li>
                <br />
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
                    <span className="side-menu-page-title">Logout</span>
                  </Button>
                </li>
              </ul>
            </div>
            <div className="side-menu-footer-container">
              {/* <Button variant="text" className={"side-menu-page"}> */}
              {/*   <LogoutOutlinedIcon /> */}
              {/*   <span className="side-menu-page-title">Log Out</span> */}
              {/* </Button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SideMenuData;
