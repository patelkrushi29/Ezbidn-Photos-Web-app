import React, { useEffect, useState, useCallback } from "react";
import { Box, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion, AnimatePresence } from "framer-motion";
import apiHandler from "../../../../utils/API/api";
import apiConfig from "../../../../utils/API/apiConfig";
import Loader from "../../../../utils/Loader/loader";
import { fontSizesMUI } from "../../../../utils/muiFonts";

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => (
	<AnimatePresence>
		{open && (
			<Box
				component={motion.div}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="modal-overlay"
			>
				<Box
					component={motion.div}
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.25 }}
					className="modal-content"
				>
					<Typography variant="h6" gutterBottom>
						Are you sure you want to delete this image?
					</Typography>
					<Box display="flex" justifyContent="space-between" gap={2} mt={2}>
						<Button variant="contained" color="error" onClick={onConfirm}>
							Delete
						</Button>
						<Button variant="outlined" onClick={onClose}>
							Cancel
						</Button>
					</Box>
				</Box>
			</Box>
		)}
	</AnimatePresence>
);

const ImageCard = ({ src, onRemoveClick, onClick, isSelected }) => (
	<Box className={`photo-card ${isSelected ? "selected" : ""}`} onClick={onClick}>
		<img src={src?.image} alt="preview" className="photo-img" />
		<IconButton
			className="remove-btn"
			onClick={(e) => {
				e.stopPropagation();
				onRemoveClick();
			}}
		>
			<CloseIcon fontSize="medium" />
		</IconButton>
	</Box>
);

const PreviewPhotoGrid = ({ photoUploaded, onSelectionChange, onDeleteImage, isUploading }) => {
	const [visibleCount, setVisibleCount] = useState(7);
	const [selectedImages, setSelectedImages] = useState([]);
	const [confirmImage, setConfirmImage] = useState(null);

	useEffect(() => {
		onSelectionChange?.(selectedImages);
	}, [selectedImages, onSelectionChange]);

	// const toggleSelect = useCallback((image) => {
	// 	setSelectedImages((prev) =>
	// 		prev.some((img) => img.id === image.id) ? prev.filter((img) => img.id !== image.id) : [...prev, image]
	// 	);
	// }, []);

	const handleRemove = async () => {
		if (!confirmImage) return;

		try {
			const response = await apiHandler.put(apiConfig.user.deleteUploadedImage.url, {
				imageId: confirmImage.id,
			});

			if (response.status) {
				// Remove from photo grid
				onDeleteImage?.(confirmImage.index, { source: "preview-grid" });

				// Also remove from selection if selected
				setSelectedImages((prev) => prev.filter((img) => img.id !== confirmImage.id));
			}
		} catch (error) {
			console.error("Error deleting image:", error);
		} finally {
			setConfirmImage(null);
		}
	};

	const handleViewMore = () => setVisibleCount(photoUploaded.length);
	const handleViewLess = () => setVisibleCount(7);

	return (
		<Box className="preview-container">
			<Typography variant="h6" className="preview-title">
				Preview Photo
				{/* ( {selectedImages.length} photo{selectedImages.length !== 1 ? "s" : ""} selected ) */}
			</Typography>
			<Box className="photo-scroll-wrapper">
				{isUploading && <Loader position="center" overlay={true} />}
				<Box className="photo-grid">
					{photoUploaded?.length > 0 ? (
						photoUploaded?.slice(0, visibleCount).map((imageObj, index) => (
							<ImageCard
								key={imageObj.id || index}
								src={imageObj}
								isSelected={selectedImages.some((img) => img.id === imageObj.id)}
								onRemoveClick={() => setConfirmImage({ ...imageObj, index })}
								// onClick={() => toggleSelect(imageObj)}
							/>
						))
					) : (
						<Box className="no-image-uploaded">
							<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }}>
								No Photo Uploaded Yet
							</Typography>
						</Box>
					)}

					{visibleCount < photoUploaded?.length && (
						<Box className="view-more-card" onClick={handleViewMore}>
							<VisibilityIcon fontSize="large" />
							<Typography>View More Photos</Typography>
						</Box>
					)}
					{visibleCount > 7 && (
						<Box className="view-more-card" onClick={handleViewLess}>
							<VisibilityIcon fontSize="large" />
							<Typography>View Less Photos</Typography>
						</Box>
					)}
				</Box>
			</Box>

			<ConfirmDeleteModal open={!!confirmImage} onClose={() => setConfirmImage(null)} onConfirm={handleRemove} />
		</Box>
	);
};

export default PreviewPhotoGrid;
