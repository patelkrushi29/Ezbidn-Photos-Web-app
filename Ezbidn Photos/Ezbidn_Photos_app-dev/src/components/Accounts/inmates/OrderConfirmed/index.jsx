import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./confirmed.css";
import { useSelector } from "react-redux";

const OrderConfirmation = () => {
	const { isLoggedIn } = useSelector((state) => state.auth);

	const navigate = useNavigate();

	const handleReturn = () => {
		if (isLoggedIn) {
			navigate("/user/profile/orders");
		} else {
			navigate("/");
		}
	};

	return (
		<Box className="order-confirmation-container">
			<Box className="inmate-order-card">
				<img src="/assets/svgs/inmates/Confirmed.svg" alt="confirmed" />
				<Typography variant="h5" className="order-title">
					Your Order is Confirmed!
				</Typography>
				<Typography className="order-message">
					Thank you for your order! Your order is being processed and will be completed within 2-3 days. You will
					receive an email confirmation when your order is completed.
				</Typography>
				<Button variant="contained" className="order-button" onClick={handleReturn}>
					Go to Home
				</Button>
			</Box>
		</Box>
	);
};

export default OrderConfirmation;
