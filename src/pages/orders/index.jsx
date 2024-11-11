import React, { useMemo } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { SideMenu } from "../../components";
import "./index.css";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useQuery, useMutation } from "@tanstack/react-query";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { BeatLoader } from "react-spinners";

const Orders = () => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [expandedOrderId, setExpandedOrderId] = React.useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/all-orders`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  const {
    data: orders = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // Memoize the reversed orders
  const reversedOrders = useMemo(() => {
    return [...orders].reverse();
  }, [orders]);

  const convertToDollars = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const handleExpandClick = (orderId) => {
    setExpandedOrderId((prevOrderId) =>
      prevOrderId === orderId ? null : orderId,
    );
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const { mutate: updateDelivery } = useMutation({
    mutationFn: (orderId) => {
      return axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/update-status`,
        {
          orderId,
          deliveryStatus: selectedStatus,
        },
      );
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch(); // Moved refetch here to ensure it's called after success
    },
    onError: (error) => {
      toast.error(`Update Error: ${error.message}`);
    },
  });

  const handleUpdateStatus = (orderId) => {
    updateDelivery(orderId);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <SideMenu>
      {isLoading && <div className="text-4xl font-bold my-5 text-center"><BeatLoader color="#328CF2"/></div>}
      {isError && (
        <div className="text-4xl font-bold my-5">Error fetching orders</div>
      )}

      <div className="order-table-main">
        <Paper sx={{ width: "100%" }} style={{ backgroundColor: "#fff" }}>
          <TableContainer sx={{ maxHeight: "80vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Tracking IDs
                  </TableCell>
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Full Name
                  </TableCell>
                  <TableCell style={{ fontWeight: "bolder" }}>Email</TableCell>
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reversedOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <React.Fragment key={order._id}>
                      <TableRow>
                        <TableCell>{order.trackingId}</TableCell>
                        <TableCell>
                          {order.shipping?.customer_details?.name}
                        </TableCell>
                        <TableCell>
                          {order.shipping?.customer_details?.email}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => handleExpandClick(order._id)}
                          >
                            {expandedOrderId === order._id
                              ? "Collapse"
                              : "Expand"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Collapse
                            in={expandedOrderId === order._id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Order ID
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Delivery Status
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Product Name
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Unit Amount
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Quantity
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Order Status (Stripe)
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Images
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bolder" }}>
                                    Customer Details
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.lineItems.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>
                                      <FormControl fullWidth>
                                        <InputLabel id={`status-label-${order._id}`}>
                                          {order.delivery_status}
                                        </InputLabel>
                                        <Select
                                          labelId={`status-label-${order._id}`}
                                          value={selectedStatus || order.delivery_status}
                                          onChange={handleStatusChange}
                                          label="Delivery Status"
                                        >
                                          <MenuItem value="Expected">Expected</MenuItem>
                                          <MenuItem value="Shipped">Shipped</MenuItem>
                                          <MenuItem value="Inproduction">Inproduction</MenuItem>
                                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                                          <MenuItem value="Rejected">Rejected</MenuItem>
                                          <MenuItem value="Delivered">Delivered</MenuItem>
                                        </Select>
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            handleUpdateStatus(order._id)
                                          }
                                          style={{ marginTop: "10px" }}
                                        >
                                          Update Status
                                        </Button>
                                      </FormControl>
                                    </TableCell>
                                    <TableCell>
                                      {item.price_data?.product_data?.name}
                                    </TableCell>
                                    <TableCell>
                                      {convertToDollars(
                                        item.price_data.unit_amount,
                                      )}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                      {order?.shipping?.payment_status}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "5px",
                                      }}
                                    >
                                      {item.price_data?.product_data?.images.map(
                                        (image, idx) => (
                                          <div
                                            key={idx}
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <a
                                              href={image}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              download={`Product_${idx}`}
                                            >
                                              <img
                                                src={image}
                                                alt={`Product ${idx}`}
                                                style={{
                                                  width: "100px",
                                                  height: "auto",
                                                  cursor: "pointer",
                                                }}
                                              />
                                            </a>
                                          </div>
                                        ),
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {order.shipping?.customer_details && (
                                        <div>
                                          <strong>Name:</strong>{" "}
                                          {
                                            order.shipping?.customer_details
                                              ?.name
                                          }
                                          <br />
                                          <strong>Email:</strong>{" "}
                                          {
                                            order.shipping?.customer_details
                                              .email
                                          }
                                          <br />
                                          <strong>Address:</strong>{" "}
                                          {
                                            order.shipping?.customer_details
                                              .address.line1
                                          }
                                          <br />
                                          <strong>City:</strong>{" "}
                                          {
                                            order.shipping?.customer_details
                                              .address.city
                                          }
                                          <br />
                                          <strong>State:</strong>{" "}
                                          {
                                            order.shipping?.customer_details
                                              .address.state
                                          }
                                          <br />
                                          <strong>Postal Code:</strong>{" "}
                                          {
                                            order.shipping?.customer_details
                                              .address.postal_code
                                          }
                                          <br />
                                          <strong>Country:</strong>{" "}
                                          {
                                            order.shipping?.customer_details
                                              .address?.country
                                          }
                                          <br />
                                        </div>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={reversedOrders.length} // Updated to use reversedOrders
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{
              backgroundColor: "#fff",
              color: "#6B7280",
              fontFamily: "Inter",
            }}
          />
        </Paper>
      </div>
    </SideMenu>
  );
};

export default Orders;
