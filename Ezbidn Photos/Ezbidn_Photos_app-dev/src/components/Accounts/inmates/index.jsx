import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import AddIcon from "@mui/icons-material/Add";
import "./inmates.css";
import { useNavigate } from "react-router-dom";
import { fontSizesMUI } from "../../../utils/muiFonts";
import PopupModel from "../../../utils/Model/Model";
import { motion } from "framer-motion";
import apiHandler from "../../../utils/API/api";
import apiConfig from "../../../utils/API/apiConfig";
import { enqueueSnackbar } from "notistack";
import LoadingScreen from "../../../utils/Loader";

const Inmates = () => {
  const [inmates, setInmates] = useState([]);

  const [selectedInmate, setSelectedInmate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchInmateList();
  }, []);

  const fetchInmateList = async () => {
    setIsLoading(true);
    try {
      const response = await apiHandler.get(apiConfig.user.inmateList.url);
      if (response?.status) {
        setInmates(response.data || []);
      }
    } catch (err) {
      console.error("Inmate fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (inmate) => {
    setSelectedInmate(inmate);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedInmate(null);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedInmate?.id) return;

    setIsLoading(true);
    try {
      const response = await apiHandler.put(apiConfig.user.removeInmate.url, {
        id: selectedInmate.id,
      });
      if (response?.status) {
        enqueueSnackbar(
          `Successfully deleted inmate ${selectedInmate?.nameFirst}`,
          {
            variant: "info",
            autoHideDuration: 5000,
          }
        );
        fetchInmateList();
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhotoTo = (id) => {
    navigate("/user/account/send-to-inmates", { state: { inmateId: id } });
  };

  const handleAddInmate = () => {
    navigate("/user/account/add-inmates");
  };

  const getReleaseDate = (inmate) => {
    const { projRelDate, actRelDate, releaseCode } = inmate || {};
    if (projRelDate) {
      return (
        <>
          <span>Release Date:</span> {projRelDate}
        </>
      );
    } else if (releaseCode.toLowerCase() === "d") {
      return (
        <>
          <span>Deceased:</span> {actRelDate}
        </>
      );
    } else if (releaseCode.toLowerCase() === "r" || actRelDate) {
      return (
        <>
          <span>Release Date:</span> {actRelDate}
        </>
      );
    }
  };

  if (isLoading) {
    return <LoadingScreen height="40vh" numRows={5} />;
  }

  return (
    <Box className="inmate-container">
      <Box className="inmate-sub-container">
        <Box className="inmate-header-box">
          <Typography
            variant="h4"
            className="inmate-title"
            sx={{ fontSize: fontSizesMUI.h4 }}
          >
            Inmates
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddInmate}
            startIcon={<AddIcon />}
            disabled={isLoading}
          >
            Add Inmate
          </Button>
        </Box>

        {!isLoading && (
          <Typography
            variant="body1"
            className="inmate-count"
            sx={{ fontSize: fontSizesMUI.body1 }}
          >
            {inmates?.length > 0 ? (
              <>
                {inmates.length} Inmate{inmates.length !== 1 ? "s" : ""}{" "}
              </>
            ) : (
              "No Record Found."
            )}
          </Typography>
        )}

        <InfiniteScroll
          dataLength={inmates.length}
          next={() => {}}
          hasMore={false}
          loader={<Typography>Loading more inmates...</Typography>}
        >
          <Stack spacing={2} className="inmate-stack">
            {inmates.map((inmate) => (
              <Card key={inmate.id} className="inmate-card">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  className="inmate-content"
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="inmate-name"
                      sx={{ fontSize: fontSizesMUI.h6 }}
                    >
                      {[inmate.nameFirst, inmate.nameMiddle, inmate.nameLast]
                        .filter(Boolean)
                        .join(" ")}
                    </Typography>
                    <Typography variant="body2" className="inmate-event">
                      {inmate.faclType}
                    </Typography>
                    <Typography variant="body2" className="inmate-date">
                      Register Number:{" "}
                      <span className="color-orange">{inmate.inmateNum}</span>
                    </Typography>
                    {inmates?.inmateLocation?.city &&
                      inmates?.inmateLocation?.state && (
                        <Typography className="inmate-details">
                          Location: {inmates.inmateLocation.city},{" "}
                          {inmates.inmateLocation.state}
                        </Typography>
                      )}
                    <Typography className="inmate-details">
                      {getReleaseDate(inmate)}
                    </Typography>
                  </CardContent>

                  <Stack spacing={1} className="inmate-button-group">
                    <Button
                      variant="contained"
                      className="inmate-reorder-button"
                      onClick={() => sendPhotoTo(inmate?.id)}
                    >
                      Send Photo
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenModal(inmate)}
                      className="inmate-view-button"
                    >
                      {" "}
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        </InfiniteScroll>
      </Box>

      <PopupModel
        open={modalOpen}
        handleClose={handleCloseModal}
        loader={isLoading}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box className="delete-box">
            <Typography variant="h6" className="delete-title">
              Confirm Deletion
            </Typography>
            <Typography variant="body1" className="delete-message">
              Are you sure you want to delete{" "}
              <strong>{selectedInmate?.nameFirst || "this inmate"}</strong>?
              This action cannot be undone.
            </Typography>
            <Box className="delete-actions">
              <Button
                variant="outlined"
                className="cancel-button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="delete-button"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </motion.div>
      </PopupModel>
    </Box>
  );
};

export default Inmates;
