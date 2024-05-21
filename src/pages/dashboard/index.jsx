import { useEffect, useState } from "react";
import axios from "axios";
import { SideMenu } from "../../components";
import Grid from "@mui/material/Grid";
import "./index.css";
import SalesIcon from "./../../assets/svg/sales.svg";
import RevenueIcon from "./../../assets/svg/revenue.svg";
import ProfitIcon from "./../../assets/svg/profit.svg";
import CostIcon from "./../../assets/svg/cost.svg";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const convertToDollars = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };
  const [filter, setFilter] = useState("Weekly");
  const FilterList = ["Weekly", "Monthly", "Yearly"];
  const [Orders, setOrders] = useState([]);
  const getOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/orderInfo`,
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <SideMenu>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={8} lg={12} xl={12}>
          <div className="dashboard-box">
            <p className="dashboard-box-title">Orders Information</p>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3} md={3} lg={3} xl={3}>
                <div className="dashboard-box-innner">
                  <div className="dashboard-box-icon">
                    <img src={SalesIcon} alt="alt" />
                  </div>

                  <div className="dashboard-box-footer">
                    <p className="dashboard-box-footer-title">Total Orders</p>
                    {Orders?.totalItemCount && (
                      <p className="dashboard-box-price">
                        {Orders.totalItemCount}
                      </p>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={3} md={3} lg={3} xl={3}>
                <div
                  className="dashboard-box-innner"
                  id="dashboard-box-right-border-hide"
                >
                  <div className="dashboard-box-icon">
                    <img src={RevenueIcon} alt="alt" />
                  </div>
                  <div className="dashboard-box-footer">
                    <p className="dashboard-box-footer-title">Paid(Stripe)</p>
                    {Orders?.paymentStatusCounts && (
                      <p className="dashboard-box-price">
                        {Orders?.paymentStatusCounts?.paid}
                      </p>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={3} md={3} lg={3} xl={3}>
                <div className="dashboard-box-innner">
                  <div className="dashboard-box-icon">
                    <img src={ProfitIcon} alt="alt" />
                  </div>
                  <div className="dashboard-box-footer">
                    <p className="dashboard-box-footer-title">Unpaid(Stripe)</p>
                    {Orders?.paymentStatusCounts && (
                      <p className="dashboard-box-price">
                        {Orders?.paymentStatusCounts?.unpaid}
                      </p>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={3} md={3} lg={3} xl={3}>
                <div
                  className="dashboard-box-innner"
                  style={{ borderRightWidth: "0px" }}
                >
                  <div className="dashboard-box-icon">
                    <img src={CostIcon} alt="alt" />
                  </div>
                  <div className="dashboard-box-footer">
                    <p className="dashboard-box-footer-title">Revenue</p>
                    {Orders?.paymentStatusCounts && (
                      <p className="dashboard-box-price">
                        {convertToDollars(Orders.totalAmount)}
                      </p>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <BootstrapDialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogContent dividers style={{ backgroundColor: "#fff" }}>
          <Typography gutterBottom>
            <p className="dashboard-box-title">Sales & Purchase</p>
            {FilterList.map((v, i) => {
              return (
                <Button
                  key={i}
                  style={{ color: v === filter ? "#1570EF" : "#5D6679" }}
                  className="dashboard-filter-list"
                  onClick={() => {
                    setFilter(v);
                    setOpen(false);
                  }}
                >
                  {v} <CheckCircleIcon />
                </Button>
              );
            })}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </SideMenu>
  );
};
export default Dashboard;
