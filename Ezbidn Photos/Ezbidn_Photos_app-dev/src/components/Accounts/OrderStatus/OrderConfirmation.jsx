import React from "react";
import { Typography, Button, Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import "./orderStatus.css"; // Import the CSS file

const OrderConfirmation = () => {
	const navigate = useNavigate();

	const handleRedirect = () => {
		navigate("/"); // Replace with your desired route
	};

	return (
		<Container maxWidth="sm" className="order-confirm-container">
			<div className="order-confirm-box">
				<CheckCircleIcon className="order-confirm-icon" />
				<Typography variant="h5" gutterBottom>
					Order Confirmed!
				</Typography>
				<Typography variant="body1" className="order-confirm-text">
					Thank you for your purchase. A confirmation email has been sent to your inbox.
				</Typography>
				<Button variant="contained" color="primary" onClick={handleRedirect}>
					Go to Home
				</Button>
			</div>
		</Container>
	);
};

export default OrderConfirmation;
