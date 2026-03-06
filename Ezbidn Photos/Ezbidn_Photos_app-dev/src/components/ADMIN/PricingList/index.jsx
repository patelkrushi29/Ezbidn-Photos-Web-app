import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Modal, Button, TextField, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion, AnimatePresence } from "framer-motion";
import { useSnackbar } from "notistack";
import "./pricing.css"; // Import the CSS file
import apiHandler from "../../../utils/API/api";
import apiConfig from "../../../utils/API/apiConfig";

export default function EditableCards() {
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [editedFields, setEditedFields] = useState({});
	const [loading, setLoading] = useState(false);
	const [loadingUpdate, setLoadingUpdate] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const loadPricing = async () => {
		setLoading(true);
		try {
			const data = await apiHandler.get(apiConfig.admin.listPricingTier.url);
			if (data.status) {
				setData(data.data || []);
			}
		} catch (err) {
			console.error(err);
			enqueueSnackbar("Failed to load pricing.", { variant: "error" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPricing();
	}, []);

	const handleOpen = (item) => {
		setSelectedItem(item);
		setEditedFields(item);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSelectedItem(null);
	};

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setEditedFields((prev) => ({
			...prev,
			[name]: type === "number" ? Number(value) : value,
		}));
	};

	const handleUpdate = async () => {
		try {
			setLoadingUpdate(true);
			if (!selectedItem?.id) {
				enqueueSnackbar("No item selected for update.", { variant: "error" });
				return;
			}
			const payload = {
				min_images: editedFields.min_images,
				max_images: editedFields.max_images,
				label: editedFields.label,
				price_cents: editedFields.price_cents,
				description: editedFields.description,
			};

			const response = await apiHandler.put(
				apiConfig.admin.putUpdatePricingTier.url,
				{ tierId: editedFields?.id },
				payload
			);
			if (response.status) {
				await loadPricing();
				handleClose();
				setLoadingUpdate(false);
				enqueueSnackbar(response.message, { variant: "success" });
			} else {
				setLoadingUpdate(false);
				enqueueSnackbar(response.message, { variant: "error" });
			}
		} catch (err) {
			setLoadingUpdate(false);
			console.error(err);
			enqueueSnackbar("Something went wrong.", { variant: "error" });
		}
	};

	function formatToLocaleDateTime(timestamp) {
		const iso = timestamp.replace(' ', 'T') + 'Z'; // Make it UTC
		const date = new Date(iso);
		return date.toLocaleString('en-US'); // Uses device locale
	}

	if (loading) {
		return (
			<Box className="admin-order-conatiner loaderCss">
				<CircularProgress color="primary" size={40} thickness={4} />
			</Box>
		);
	}

	return (
		<Box className="editable-container">
			<Box className="cards-row">
				{data.map((item) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						<Box className="editable-card" onClick={() => handleOpen(item)}>
							<Box display="flex" justifyContent="space-between" alignItems="center">
								<Typography className="card-label">{item.label}</Typography>
								<IconButton size="small">
									<EditIcon sx={{ color: "#cf5835" }} />
								</IconButton>
							</Box>

							<Box mt={1}>
								<Typography className="card-value">
									<ImageIcon fontSize="small" /> <strong>Min Images:</strong> {item.min_images}
								</Typography>
								<Typography className="card-value">
									<ImageIcon fontSize="small" /> <strong>Max Images:</strong> {item.max_images}
								</Typography>
								<Typography className="card-value">
									<MonetizationOnIcon fontSize="small" /> <strong>Price:</strong> ${(item.price_cents / 100).toFixed(2)}
								</Typography>
								<Typography className="card-value">
									<DescriptionIcon fontSize="small" /> <strong>Description:</strong>{" "}
									{item.description || <em>No description</em>}
								</Typography>
								<Typography className="card-updated">
									<AccessTimeIcon fontSize="small" /> Updated: {formatToLocaleDateTime(item.updated_at)}
								</Typography>
							</Box>
						</Box>
					</motion.div>
				))}
			</Box>
			{/* Modal for Editing */}
			<Modal open={open} onClose={handleClose}>
				<AnimatePresence>
					{open && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.3 }}
							className="modal-box"
						>
							<Typography variant="h6" mb={2}>
								Edit Image Option
							</Typography>

							<Box className="modal-form">
								<TextField
									disabled={loadingUpdate}
									className="form-field"
									label="Min Images"
									name="min_images"
									type="number"
									value={editedFields.min_images || ""}
									onChange={handleChange}
								/>
								<TextField
									disabled={loadingUpdate}
									className="form-field"
									label="Max Images"
									name="max_images"
									type="number"
									value={editedFields.max_images || ""}
									onChange={handleChange}
								/>
								<TextField
									disabled={loadingUpdate}
									className="form-field"
									label="Price (in cents)"
									name="price_cents"
									type="number"
									value={editedFields.price_cents || ""}
									onChange={handleChange}
								/>
								<TextField
									disabled={loadingUpdate}
									className="form-field"
									label="Label"
									name="label"
									value={editedFields.label || ""}
									onChange={handleChange}
								/>
							</Box>
							<Box mt={2}>
								<TextField
									disabled={loadingUpdate}
									id="description"
									label="Description"
									name="description"
									value={editedFields.description || ""}
									onChange={handleChange}
									multiline
									rows={4}
									fullWidth
									variant="outlined"
								/>
							</Box>

							<Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
								<Button onClick={handleClose} variant="outlined" color="secondary">
									Cancel
								</Button>
								<Button onClick={handleUpdate} variant="contained" color="primary" disabled={loadingUpdate}>
									{loadingUpdate ? "Updating..." : "Update"}
								</Button>
							</Box>
						</motion.div>
					)}
				</AnimatePresence>
			</Modal>
		</Box>
	);
}
