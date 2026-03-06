import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckIcon from "@mui/icons-material/Check";
import "./orders.css";
import { fontSizesMUI } from "../../../utils/muiFonts";
import { useNavigate } from "react-router-dom";
import PopupModel from "../../../utils/Model/Model";
import apiHandler from "../../../utils/API/api";
import apiConfig from "../../../utils/API/apiConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LoadingScreen from "../../../utils/Loader";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrdersList();
  }, []);

  const fetchOrdersList = async () => {
    setIsLoading(true);
    try {
      const response = await apiHandler.get(apiConfig.user.orderList.url);
      if (response?.status) {
        setOrders(response.data || []);
      }
    } catch (err) {
      console.error("Inmate fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  const handleResend = (order) => {
    navigate("/user/account/send-to-inmates", {
      state: { inmateId: order.id },
    });
  };
  const getStepsFromSelectedOrder = (selectedOrder) => {
    console.log({ selectedOrder });

    const currentStatus = selectedOrder?.shipment_status || "";
    const statuses = ["processing", "shipped", "completed"];
    return statuses.map((label) => ({
      label,
      completed: statuses.indexOf(label) <= statuses.indexOf(currentStatus),
    }));
  };
  const steps = getStepsFromSelectedOrder(selectedOrder);

  function formatLocalDateFromTimestamp(timestamp) {
    const isoString = timestamp.replace(" ", "T") + "Z"; // Treat as UTC
    const date = new Date(isoString); // Will convert to local device time
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString(undefined, { month: "long" });
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };
  
    return `${month} ${day}${getOrdinal(day)} ${year}`;
  }
  
  if (isLoading) {
    return <LoadingScreen height="40vh" numRows={5} />;
  }

  return (
    <Box className="orders-container">
      <Box className="orders-sub-container">
        <Typography
          variant="h4"
          className="orders-title"
          sx={{ fontSize: fontSizesMUI.h4 }}
        >
          My Orders
        </Typography>
        <Typography
          variant="body1"
          className="orders-count"
          sx={{ fontSize: fontSizesMUI.body1 }}
        >
          {orders?.length > 0
            ? `${orders?.length} Orders Found `
            : "No Order Placed"}
        </Typography>
        <Stack spacing={2} className="orders-stack">
          {orders?.map((order) => (
            <Card key={order.id} className="order-card">
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                className="order-content"
              >
                <Box className="order-details-start">
                  <Box className="order-image-container">
                    <LazyLoadImage
                      src={`${order?.images[0]?.image}`}
                      alt={`${order?.images[0]?.id}`}
                      effect="blur"
                      width="100%"
                      className="order-image"
                    />{" "}
                  </Box>
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="order-name text-capitalize boldCss"
                      sx={{ fontSize: fontSizesMUI.h6 }}
                    >
                      {order?.inmate_nameFirst} {order?.inmate_nameLast}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="order-name text-capitalize "
                      sx={{ fontSize: fontSizesMUI.h6 }}
                    >
                      {order?.inmate_faclName} ({order?.inmate_faclCode})
                    </Typography>

                    <Typography
                      variant="body2"
                      className="order-photo-size"
                      sx={{ fontSize: fontSizesMUI.body2 }}
                    >
                      <span className="highlight">
                        {order.images.length}{" "}
                        {order.images.length === 1 ? "Photo" : "Photos"}
                      </span>
                    </Typography>

                    <Typography
                      variant="body2"
                      className="order-event text-capitalize"
                      sx={{ fontSize: fontSizesMUI.body2 }}
                    >
                      <span className="boldCss">Payment: </span>
                      {order.payment_status}
                    </Typography>

                    <Typography
                      variant="body2"
                      className="order-event text-capitalize"
                      sx={{ fontSize: fontSizesMUI.body2 }}
                    >
                      <span className="boldCss">Shipment Status: </span>
                      {order.shipment_status}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="order-date"
                      sx={{ fontSize: fontSizesMUI.caption1 }}
                    >
                      Date: {formatLocalDateFromTimestamp(order.created_at)}
                    </Typography>
                  </CardContent>
                </Box>
                <Stack spacing={1} className="button-group">
                  <Button
                    variant="contained"
                    className="reorder-button"
                    onClick={() => handleResend(order)}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: fontSizesMUI.body2 }}
                    >
                      Reorder
                    </Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModal(order)}
                    className="order-view-button"
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: fontSizesMUI.body2 }}
                    >
                      View Details
                    </Typography>
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>

        {/* </InfiniteScroll> */}
        <PopupModel open={modalOpen} handleClose={() => setModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="c2-order-modal-container"
          >
            <Box className="c2-order-details-card">
              {selectedOrder && (
                <Stack spacing={3} className="c2-order-details-stack">
                  {/* Header */}
                  <Box className="c2-order-header">
                    <Typography variant="h6" className="c2-order-title">
                      <strong>Order Details - #{selectedOrder.order_id}</strong>
                    </Typography>
                  </Box>
                  <Divider sx={{ borderBottomWidth: 3, mb: 2 }} />

                  {/* User Info */}
                  <Box className="c2-section c2-user-info">
                    <Typography
                      variant="h6"
                      sx={{ fontSize: fontSizesMUI.h6 }}
                      className="c2-section-title"
                    >
                      <strong>User Info</strong>
                    </Typography>
                    <Box>
                      <Typography
                        variant="body2"
                        className="text-capitalize detail-item"
                      >
                        <strong>Name:</strong> {selectedOrder.user_name}
                      </Typography>
                      <Typography variant="body2" className="detail-item">
                        <strong>Email:</strong> {selectedOrder.user_email}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-capitalize detail-item"
                      >
                        <strong>Type:</strong> {selectedOrder.user_provider}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ borderBottomWidth: 3, mb: 2 }} />
                  {/* Inmate Info */}
                  <Box className="c2-section c2-inmate-info">
                    <Typography
                      variant="h6"
                      sx={{ fontSize: fontSizesMUI.h6 }}
                      className="c2-section-title detail-item"
                    >
                      <strong>Inmate Info</strong>
                    </Typography>
                    <Box>
                      <Typography variant="body2" className="detail-item">
                        <strong>Name:</strong> {selectedOrder.inmate_nameFirst}{" "}
                        {selectedOrder.inmate_nameLast}
                      </Typography>
                      <Typography variant="body2" className="detail-item">
                        <strong>Location:</strong>{" "}
                        {selectedOrder.inmate_faclName}
                      </Typography>
                      <Typography variant="body2" className="detail-item">
                        <strong>Register Number:</strong>{" "}
                        {selectedOrder.inmateRegisterNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ borderBottomWidth: 3, mb: 2 }} />
                  <Box className="c2-section c2-order-info text-capitalize">
                    <Typography
                      variant="h6"
                      sx={{ fontSize: fontSizesMUI.h6 }}
                      className="c2-section-title detail-item"
                    >
                      <strong>Order Info</strong>
                    </Typography>
                    <Box>
                      <Typography variant="body2" className="detail-item">
                        <strong>Amount:</strong> $
                        {selectedOrder.amount_total / 100}
                      </Typography>
                      <Typography variant="body2" className="detail-item">
                        <strong>Payment Status:</strong>{" "}
                        {selectedOrder.payment_status}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="c2-transaction-id text-wrap-limit detail-item"
                      >
                        <strong>Transaction ID:</strong>{" "}
                        {selectedOrder.transaction_id}
                      </Typography>
                      <Typography variant="body2" className="detail-item">
                        <strong>Date:</strong>{" "}
                        {formatLocalDateFromTimestamp(selectedOrder.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ borderBottomWidth: 3, mb: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontSize: fontSizesMUI.h6 }}
                    className="c2-section-title"
                  >
                    <strong>Order Status</strong>
                  </Typography>
                  <Box className="c2-status-container">
                    {steps.map((step, idx) => (
                      <Box
                        key={"circle" + idx}
                        className={`c2-status-step ${
                          step.completed ? "c2-status-completed" : ""
                        }`}
                      >
                        <Box className="c2-status-circle">
                          {step.completed && (
                            <CheckIcon
                              className="c2-status-icon"
                              size="large"
                            />
                          )}
                        </Box>
                        <Typography
                          className={`c2-status-text text-capitalize ${
                            step.completed ? "text-active" : "text-inactive"
                          }`}
                        >
                          {step.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box className="c2-section c2-images">
                    <Typography
                      variant="h6"
                      sx={{ fontSize: fontSizesMUI.h6, mb: 3 }}
                      className="c2-section-title"
                    >
                      <strong>Photos Shared</strong>
                    </Typography>
                    <Box className="c2-swiper-wrapper">
                      <IconButton className="c2-swiper-button-prev">
                        <ArrowBackIosIcon />
                      </IconButton>
                      <Swiper
                        spaceBetween={20}
                        slidesPerView={2}
                        navigation={{
                          nextEl: ".c2-swiper-button-next",
                          prevEl: ".c2-swiper-button-prev",
                        }}
                        modules={[Navigation]}
                        className="c2-swiper-gallery"
                        breakpoints={{
                          640: { slidesPerView: 1 },
                          768: { slidesPerView: 2 },
                          1024: { slidesPerView: 3 },
                        }}
                      >
                        {selectedOrder.images?.map((image, index) => (
                          <SwiperSlide key={"image"}>
                            <Box className="c2-swiper-slide">
                              <LazyLoadImage
                                src={image.image}
                                alt={image.id}
                                effect="blur"
                                width="100%"
                                className="c2-order-img"
                              />
                            </Box>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <IconButton className="c2-swiper-button-next">
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Stack>
              )}
            </Box>
          </motion.div>
        </PopupModel>
      </Box>
    </Box>
  );
};

export default Orders;
