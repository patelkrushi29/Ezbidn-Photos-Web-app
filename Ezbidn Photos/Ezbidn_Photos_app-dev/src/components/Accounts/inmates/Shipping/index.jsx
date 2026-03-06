import React, { useState, useEffect } from "react";
import { Checkbox, Button, Card, Typography, Box, Fade } from "@mui/material";
import { motion } from "framer-motion";
import "./shipping.css";
import { useLocation, useNavigate } from "react-router-dom";
import { fontSizesMUI } from "../../../../utils/muiFonts";
import apiHandler from "../../../../utils/API/api";
import apiConfig from "../../../../utils/API/apiConfig";
import { useSelector } from "react-redux";

const ShippingInfo = () => {
	const [checked, setChecked] = useState(false);
	const [error, setError] = useState(false);
	const [inmateDetails, setInmateDetails] = useState([]);
	const { user } = useSelector((state) => state.auth);

	const navigate = useNavigate();
	const location = useLocation();

	const { inmateId, price, selectedImage } = location.state;

	const handleSubmit = () => {
		if (!checked) {
			setError(true);
		} else {
			placeOrder();
		}
	};
	useEffect(() => {
		try {
			const fetchInmate = async () => {
				const response = await apiHandler.get(apiConfig.user.getInmateDetailById.url, { id: inmateId });

				if (response?.status) {
					setInmateDetails({ ...response.data?.inamteProfile, ...response.data?.inmateLocation });
				}
			};
			if (inmateId) {
				fetchInmate();
			} else {
				navigate("/user/account/add-inmates");
			}
		} catch (e) {
			console.error(e);
		}
	}, [inmateId]);

	const placeOrder = async () => {
		try {
			if (inmateId && user) {
				const response = await apiHandler.post(
					apiConfig.user.checkoutOrder.url,
					{},
					{
						inmate_id: `${inmateId}`,
						customer_id: `${user.customer_id}`,
						pricing_tier_id: `${price.id}`,
						images: selectedImage || [],
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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1 }}
			className="shipping-container"
		>
			<Typography variant="h5" sx={{ fontSize: fontSizesMUI.h5 }} className="shipping-title">
				Shipping Info
			</Typography>
			<Typography variant="subtitle2" sx={{ fontSize: fontSizesMUI.subtitle1 }} className="shipping-subtitle">
				Check all shipping information if you don’t make any changes please click on submit button & reach out to your
				loved ones
			</Typography>

			{/* Inmate Details */}
			<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }} className="shipping-detail-title">
				Inmate Details
			</Typography>
			<Box className="inmate-details">
				{inmateDetails && (
					<Box className="inmate-text">
						<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }} fontWeight="bold">
							{inmateDetails?.nameDisplay}
						</Typography>
						<Typography variant="subtitle2" sx={{ fontSize: fontSizesMUI.subtitle1 }}>
							Action Conservation Camp #11
						</Typography>
						<Typography variant="subtitle2" sx={{ fontSize: fontSizesMUI.subtitle1 }}>
							Register Number: <span className="highlight">{inmateDetails?.inmateNum}</span>
						</Typography>
						<Typography variant="subtitle2" sx={{ fontSize: fontSizesMUI.subtitle1 }} className="highlight">
							Total Photo Selected to sent <strong>{selectedImage?.length}</strong>
						</Typography>
					</Box>
				)}
			</Box>

			<Card className="subscription-details">
				<Box className="plan-info">
					<Box className="plan-name-box">
						<Typography variant="subtitle2" sx={{ fontSize: fontSizesMUI.subtitle1 }} className="plan-label">
							{price?.name}
						</Typography>
						<Typography variant="h5" sx={{ fontSize: fontSizesMUI.h5 }} className="plan-price">
							${price?.price}/mo
						</Typography>
					</Box>
					<Box className="plan-benefits-box">
						<Typography variant="subtitle2" sx={{ fontSize: fontSizesMUI.subtitle1 }} className="plan-benefits">
							Upgrade for more images & benefits.
						</Typography>
					</Box>
				</Box>
			</Card>

			{/* Terms & Conditions */}
			<Box className="terms-container">
				<Checkbox
					checked={checked}
					onChange={() => {
						setChecked(!checked);
						setError(false);
					}}
					style={{
						color: "#e75a1a",
					}}
					value="cryon"
				/>
				<Typography variant="subtitle2" sx={{ fontSize: fontSizesMUI.subtitle1 }}>
					I agree to the Ezbidn{" "}
					<a href="/user/terms" target="_blank" className="link">
						{" "}
						Terms & Condition{" "}
					</a>
					,{" "}
					<a href="/user/refund" target="_blank" className="link">
						Delivery Guidelines
					</a>{" "}
					and{" "}
					<a href="/user/privacy" target="_blank" className="link">
						Privacy Policy.
					</a>
				</Typography>
			</Box>
			{error && (
				<Fade in={error}>
					<Typography className="error-text">Please agree to the terms before submitting.</Typography>
				</Fade>
			)}

			{/* Submit Button */}
			<Box className="ship-submit-btn">
				<Button variant="contained" fullWidth className="submit-btn" onClick={handleSubmit}>
					Submit →
				</Button>
			</Box>
		</motion.div>
	);
};

export default ShippingInfo;
