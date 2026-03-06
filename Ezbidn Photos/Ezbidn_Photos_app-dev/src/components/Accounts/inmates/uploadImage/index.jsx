import React, { useState, useCallback, useEffect } from "react";
import {
	Box,
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	ButtonGroup,
} from "@mui/material";
import { motion } from "framer-motion";

import { useDropzone } from "react-dropzone";
import "./upload.css";

import { useLocation, useNavigate } from "react-router-dom";
import { fontSizesMUI } from "../../../../utils/muiFonts";
import PreviewPhotoGrid from "./PhotoPreview";
import { ArrowRightAlt } from "@mui/icons-material";
import GooglePhotosPicker from "./GooglePhoto";
import apiHandler from "../../../../utils/API/api";
import apiConfig from "../../../../utils/API/apiConfig";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import FacebookPhotosPicker from "./FacebookPhoto";
import InstagramPhotosPicker from "./InstagramPhoto";

const UploadPhoto = () => {
	const [selectedImage, setSelectedImage] = useState([]);
	const [fileName, setFileName] = useState("");
	const [photoList, setPhotoList] = useState([]);

	const [openPreview, setOpenPreview] = useState(false);

	const [socialOpen, setSocialOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [minPhotoLimit, setMinPhotoLimit] = useState(1);
	const [imagePicker, setImagePicker] = useState("");

	const { user } = useSelector((state) => state.auth);

	const location = useLocation();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	// const { inmateId, price } = location.state;
	const inmateId = location.state?.inmateId;
	const price = location.state?.price;

	const onDrop = useCallback(
		async (acceptedFiles) => {
			const file = acceptedFiles[0];
			if (!file) return;

			if (photoList.length >= price?.photos) {
				enqueueSnackbar("Reached the limit to upload as per the selected plan.", { variant: "warn" });
				return;
			}
			setFileName(file.name);

			await uploadPhoto(file);
		},
		[photoList, price, inmateId, navigate]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: "image/jpeg, image/png, image/heic",
	});

	useEffect(() => {
		handleListing();
		setMinPhotoLimit(price?.min);
	}, [inmateId, price, location, navigate]);

	const uploadPhoto = async (file, socialLink = null, imageType = "local") => {
		if (!file && !socialLink) return;

		if (!socialLink && file.size > 5 * 1024 * 1024) {
			alert("File size must be under 5MB.");
			return;
		}

		const formData = new FormData();

		formData.append("inmate_id", inmateId || null);
		formData.append("image_type", imageType);

		if (file) {
			formData.append("image", file);
		} else if (socialLink) {
			formData.append("image", socialLink);
		}

		try {
			setIsUploading(true);
			setSocialOpen(false);
			const response = await apiHandler.post(apiConfig.user.imageUpload.url, {}, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status) {
				setPhotoList((prev) => [...prev, response.data]);
			}
		} catch (error) {
			console.error("Upload failed:", error);
			enqueueSnackbar("Image upload failed. Please try again.", { variant: "error" });
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileSelect = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		if (photoList.length >= price?.photos) {
			enqueueSnackbar("Reached the limit to upload as per the selected plan.", { variant: "warn" });
			return;
		}

		await uploadPhoto(file);
	};

	const handleListing = async () => {
		// try {
		// 	const response = await apiHandler.get(apiConfig.user.imageUploadedList.url, {
		// 		inmateId: inamteId,
		// 	});
		// 	if (response.status) {
		// 		setPhotoList(response.data);
		// 	}
		// } catch (error) {
		// 	console.error("Error deleting image:", error);
		// }
	};

	const handleDeleteImage = (id) => {
		setPhotoList((prev) => prev.filter((img, index) => index !== id));
	};

	const confirmDelete = () => {
		setFileName("");
		setConfirmDeleteOpen(false);
	};

	const handleSubmit = () => {
		placeOrder();
		// const selectedIds = photoList.map((img) => img.id);
		// navigate("/user/account/shipping-info", {
		// 	state: { inmateId: inmateId, selectedImage: selectedIds, price: price },
		// });
	};

	const handlePreview = () => {
		setOpenPreview(true);
	};

	const fetchSocialMediaImages = (platform) => {
		setSocialOpen(true);
		setImagePicker(platform);
	};

	const placeOrder = async () => {
		try {
			if (inmateId && user) {
				const selectedIds = photoList.map((img) => img.id);

				const response = await apiHandler.post(
					apiConfig.user.checkoutOrder.url,
					{},
					{
						inmate_id: `${inmateId}`,
						customer_id: `${user.customer_id}`,
						pricing_tier_id: `${price.id}`,
						images: selectedIds || [],
					}
				);
				if (response.status) {
					const stripeUrl = response.data?.url;
					window.location.href = stripeUrl;
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const socialImagesSelector = () => {
		switch (imagePicker) {
			case "Google":
				return (
					<GooglePhotosPicker
						selectedImage={(url) => {
							console.log(url);

							uploadPhoto(null, url, "google");
						}}
					/>
				);
			case "Facebook":
				return <FacebookPhotosPicker selectedImage={(url) => uploadPhoto(null, url, "facebook")} />;
			case "Instagram":
				return <InstagramPhotosPicker selectedImage={(url) => uploadPhoto(null, url, "instagram")} />;
			default:
				break;
		}
	};

	const shouldSendPhoto = minPhotoLimit > photoList.length;
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1 }}
			className="upload-container"
		>
			<Box className="upload-header">
				<Typography variant="h4">Upload Photo</Typography>

				<Typography variant="subtitle2">
					Connect with your loved ones now simply upload your photo, type your message, and send it instantly
				</Typography>
			</Box>

			<Box className="social-icons-container">
				<Button className="social-button">
					<input
						type="file"
						id="file-upload"
						accept="image/jpeg, image/png, image/heic"
						style={{ display: "none" }}
						onChange={(e) => handleFileSelect(e)}
					/>
					<label htmlFor="file-upload">
						<img src="/assets/svgs/inmates/uploadIcon.svg" alt="Upload" className="social-icon" />
					</label>
					<Typography variant="caption">Upload</Typography>
				</Button>
				<Button className="social-button" onClick={() => fetchSocialMediaImages("Google")}>
					<img src="/assets/svgs/social/google.svg" alt="google" className="social-icon " />
					<Typography variant="caption">Google</Typography>
				</Button>
				<Button className="social-button" onClick={() => fetchSocialMediaImages("Facebook")}>
					<img src="/assets/svgs/social/facebook.svg" alt="google" className="social-icon " />
					<Typography variant="caption">Facebook</Typography>
				</Button>
				<Button className="social-button" onClick={() => fetchSocialMediaImages("Instagram")}>
					<img src="/assets/svgs/social/instagram.svg" alt="google" className="social-icon " />
					<Typography variant="caption">Instagram</Typography>
				</Button>
			</Box>

			<Box {...getRootProps()} className={`upload-zone ${isDragActive ? "drag-active" : ""}`}>
				<input {...getInputProps()} type="file" accept="image/jpeg, image/png, image/heic" />
				<img src="/assets/svgs/inmates/Upload.svg" alt="upload" />
				<Typography variant="body1">
					Drag & Drop Photo or <span className="browse-text">Browse</span>
				</Typography>
				<Typography variant="caption">Photo Formats: JPEG, PNG, HEIC</Typography>
			</Box>
			<Typography variant="body2" sx={{ fontSize: fontSizesMUI.body2 }}>
				According to your current subscription plan you can upload up to {price?.photos} images.
			</Typography>

			<PreviewPhotoGrid
				onSelectionChange={setSelectedImage}
				photoUploaded={photoList}
				onDeleteImage={handleDeleteImage}
				isUploading={isUploading}
			/>

			{/* Submit Button */}
			<ButtonGroup className="upload-button-group">
				{" "}
				<Button
					variant="contained"
					color="primary"
					disabled={shouldSendPhoto}
					fullWidth
					className="submit-button"
					onClick={handleSubmit}
				>
					Submit <ArrowRightAlt />
				</Button>
				{shouldSendPhoto && (
					<Typography variant="body2">
						{" "}
						Please upload atleast <strong>{minPhotoLimit}</strong> photos as per the selected plan.
					</Typography>
				)}
			</ButtonGroup>

			<Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>Are you sure you want to delete this image?</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
					<Button color="error" onClick={confirmDelete}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={socialOpen} onClose={() => setSocialOpen(false)}>
				<DialogTitle>
					<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }}>
						{" "}
						Upload from Social Account
					</Typography>
				</DialogTitle>
				<DialogContent>{socialImagesSelector()}</DialogContent>
			</Dialog>
		</motion.div>
	);
};

export default UploadPhoto;
