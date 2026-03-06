import React from "react";
import { Typography, Button, Container } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import "./OrderCancelled.css"; // Import the CSS file

const OrderCancelled = () => {
	const navigate = useNavigate();

	const handleRedirect = () => {
		navigate("/"); // Replace with your desired route
	};

	return (
		<Container maxWidth="sm" className="order-cancel-container">
			<div className="order-cancel-box">
				<CancelIcon className="order-cancel-icon" />
				<Typography variant="h5" gutterBottom>
					Order Failed
				</Typography>
				<Typography variant="body1" className="order-cancel-text">
					Your order has been cancelled. If this was a mistake, please try again or contact support.
				</Typography>
				<Button variant="contained" color="error" onClick={handleRedirect}>
					Go to Home
				</Button>
			</div>
		</Container>
	);
};

export default OrderCancelled;
