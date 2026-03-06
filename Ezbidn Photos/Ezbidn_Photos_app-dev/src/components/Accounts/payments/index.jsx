import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl, Button, Card, Box } from "@mui/material";
import "./payment.css"; // External CSS file

const PaymentMethod = () => {
	const [selectedMethod, setSelectedMethod] = useState("stripe");

	const paymentMethods = [
		{ id: "stripe", label: "Stripe", logo: "/assets/svgs/payment/Stripe.svg" },
		{ id: "paypal", label: "PayPal", logo: "/assets/svgs/payment/PayPal.svg" },
		{ id: "applepay", label: "Apple Pay", logo: "/assets/svgs/payment/ApplePay.svg" },
		{ id: "googlepay", label: "Google Pay", logo: "/assets/svgs/payment/GooglePay.png" },
	];

	return (
		<div className="payment-container">
			<div className="payment-sub-container">
				<h2 className="payment-title">Payment Method</h2>
				<FormControl component="fieldset" className="payment-fieldset-container">
					<RadioGroup
						value={selectedMethod}
						onChange={(e) => setSelectedMethod(e.target.value)}
						className="payment-radio-group"
					>
						{paymentMethods.map((method) => (
							<Card key={method.id} className={`payment-card ${selectedMethod === method.id ? "selected" : ""}`}>
								<FormControlLabel
									value={method.id}
									control={<Radio className="payment-radio" />}
									label={
										<div className="payment-option">
											<span className="payment-label">{method.label}</span>
										</div>
									}
								/>
								<Box className="payment-image-conatiner">
									<img src={method.logo} alt={method.label} className="payment-logo" />
								</Box>
							</Card>
						))}
					</RadioGroup>
				</FormControl>
				<Button variant="contained" className="payment-button">
					Save Changes
				</Button>
			</div>
		</div>
	);
};

export default PaymentMethod;
