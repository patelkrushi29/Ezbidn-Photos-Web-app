import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Tooltip,
  IconButton,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import apiHandler from "../../../../utils/API/api";
import apiConfig from "../../../../utils/API/apiConfig";
import "../orderlist.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";

const OrderDetails = () => {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const { id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [editedFields, setEditedFields] = useState({
    comment: order.comment || "",
    shipment_status: order.shipment_status || "",
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiHandler.get(
        apiConfig.admin.getOrderDetailsById.url,
        {
          orderId: id,
        }
      );
      if (res?.status) {
        setEditedFields({
          ...editedFields,
          shipment_status: res?.data?.shipment_status,
          comment: res?.data?.comment,
        });
        setOrder(res?.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  const truncateId = (id) => {
    if (!id) return "";
    return id.slice(0, 15) + "..." + id.slice(-6);
  };

  const formatDate = (dateString) => {
    // Convert to ISO format and treat as UTC
    const isoString = dateString && dateString.replace(" ", "T") + "Z";
    const date = new Date(isoString); // Converts to local time
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    // let hours = date.getHours();
    // const minutes = String(date.getMinutes()).padStart(2, "0");
    // const seconds = String(date.getSeconds()).padStart(2, "0");
    // const ampm = hours >= 12 ? "PM" : "AM";
    // hours = hours % 12 || 12; // Convert 0 to 12
    // return `${mm}/${dd}/${yyyy}, ${hours}:${minutes} ${ampm}`;
    return `${mm}/${dd}/${yyyy}`;
  };

  const handleDownloadAll = async (orderId) => {
    try {
      setLoadingImage(true);
      const zip = new JSZip();
      const imgFolder = zip.folder("images");
      const imagePromises = order.images.map(async (img, index) => {
        const response = await fetch(img.image, {
          method: "GET",
          headers: { "Cache-Control": "no-cache" },
          cache: "no-store",
        });
        const blob = await response.blob();
        const ext = img.image.split(".").pop().split(/\#|\?/)[0]; // get file extension
        imgFolder.file(`image_${index + 1}.${ext}`, blob);
      });
      await Promise.all(imagePromises);
      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      const time = now.toTimeString().slice(0, 8).replace(/:/g, "-");
      const zipFileName = `order-${orderId}_${date}_${time}.zip`;
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, zipFileName);
      setLoadingImage(false);
    } catch {
      enqueueSnackbar(
        "An error occurred while downloading the image.",
        { variant: "error" },
        {
          action: (key) => (
            <Fragment>
              <Button size="small" onClick={() => closeSnackbar(key)}>
                Dismiss
              </Button>
            </Fragment>
          ),
        }
      );
      setLoadingImage(false);
    }
  };

  const handleShow = (row) => {
    setEditedFields({
      comment: row.comment || "",
      shipment_status: row.shipment_status || "",
    });
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditedFields({
      ...editedFields,
      shipment_status: order?.shipment_status,
      comment: order?.comment,
    });
    setEditOpen(false);
  };

  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true);
      const payload = {
        shipment_status: editedFields?.shipment_status,
        comment: editedFields?.comment,
      };
      const response = await apiHandler.put(
        apiConfig.admin.updateOrder.url,
        { id: order?.id },
        payload
      );
      if (response.status) {
        await fetchData();
        setLoadingUpdate(false);
        handleClose();
        enqueueSnackbar(response.message, { variant: "success" });
      } else {
        setLoadingUpdate(false);
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (err) {
      setLoadingUpdate(false);
      enqueueSnackbar("Something went wrong.", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <Box className="admin-order-conatiner loaderCss">
        <CircularProgress color="primary" size={40} thickness={4} />
      </Box>
    );
  }
  return (
    <Box className="admin-order-conatiner">
      <Typography variant="h5" gutterBottom>
        Order Details - #{order.id}
      </Typography>

      <Box className="info-grid">
        <Box className="section-box">
          <Typography variant="h6">User Info</Typography>
          <Typography>
            <span className="lableclass">Name:</span> {order.user_name}
          </Typography>
          <Typography>
            <span className="lableclass">Email:</span> {order.user_email}
          </Typography>
          <Typography>
            <span className="lableclass">Type:</span>{" "}
            {order.user_role
              ? order.user_role.charAt(0).toUpperCase() +
                order.user_role.slice(1)
              : "N/A"}
          </Typography>
          <Divider />
        </Box>

        <Box className="section-box">
          <Typography variant="h6">Inmate Info</Typography>
          <Typography>
            <span className="lableclass">Name:</span> {order.inmate_nameFirst}{" "}
            {order.inmate_nameMiddle} {order.inmate_nameLast}
          </Typography>
          <Typography>
            <span className="lableclass">Location:</span>{" "}
            {order.inmate_faclName} ({order.inmate_faclCode})
          </Typography>
          <Typography>
            <span className="lableclass">Register Number:</span>{" "}
            {order.inmate_inmateNum}
          </Typography>
          <Divider />
        </Box>

        <Box className="section-box">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Order Info</Typography>
            <Tooltip title="Update Shipment Status" placement="top">
              <IconButton
                size="small"
                onClick={() => handleShow(order)}
                sx={{ color: "#cf5835" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography>
            <span className="lableclass">Amount:</span> $
            {(order.amount_total / 100).toFixed(2)}
          </Typography>
          <Typography>
            <span className="lableclass">Payment Status:</span>{" "}
            {order.payment_status
              ? order.payment_status.charAt(0).toUpperCase() +
                order.payment_status.slice(1)
              : "N/A"}
          </Typography>
          <Typography className="breakable-text">
            <span className="lableclass">Transaction ID:</span>{" "}
            {truncateId(order.transaction_id)}
            <Tooltip title="Copy Transaction ID">
              <IconButton
                size="small"
                onClick={() => handleCopy(order.transaction_id)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Typography>
            <span className="lableclass">Shipment Status:</span>{" "}
            {order.shipment_status
              ? order.shipment_status.charAt(0).toUpperCase() +
                order.shipment_status.slice(1)
              : "N/A"}
          </Typography>
          <Typography>
            <span className="lableclass">Comment:</span>{" "}
            {order.comment
              ? order.comment.charAt(0).toUpperCase() + order.comment.slice(1)
              : "N/A"}
          </Typography>
          <Typography>
            <span className="lableclass">Date</span>{" "}
            {formatDate(order.created_at)}
          </Typography>
          <Divider />
        </Box>
      </Box>
      <Box className="image-section-class">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Images
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDownloadAll(order.id)}
            sx={{
              bgcolor: "#cf5835",
              color: "#fff",
              "&:hover": { bgcolor: "#b64d2d" },
            }}
          >
            {loadingImage ? "Downloading.." : "Download All Images"}
          </Button>
        </Box>

        <Box className="image-grid-container">
          {order.images &&
            order.images.map((img) => (
              <Card className="image-card" key={img.id}>
                <CardMedia
                  component="img"
                  image={img.image}
                  alt={`Image ${img.id}`}
                />
                <CardContent className="image-card-content">
                  <Tooltip title="Copy Image Link">
                    <IconButton
                      onClick={() => handleCopy(img.image)}
                      className="image-copy-icon"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="caption">Image #{img.id}</Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Box>
      <Dialog
        open={editOpen}
        onClose={() => handleClose()}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Order Info</DialogTitle>
        <DialogContent>
          <TextField
            disabled={loadingUpdate}
            select
            label="Shipment Status"
            value={editedFields?.shipment_status ?? ""}
            onChange={(e) =>
              setEditedFields({
                ...editedFields,
                shipment_status: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          >
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>

          {/* Comment */}
          <TextField
            disabled={loadingUpdate}
            fullWidth
            margin="dense"
            label="Comment"
            multiline
            rows={3}
            value={editedFields.comment || ""}
            onChange={(e) =>
              setEditedFields({ ...editedFields, comment: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button
            onClick={() => handleUpdate()}
            disabled={loadingUpdate}
            variant="contained"
            color="primary"
          >
            {loadingUpdate ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetails;
