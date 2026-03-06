// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
// 	Elements,
// 	useStripe,
// 	useElements,
// 	PaymentRequestButtonElement,
// 	CardNumberElement,
// 	CardExpiryElement,
// 	CardCvcElement,
// } from "@stripe/react-stripe-js";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
// import "./StripeCheckout.css";

// const STRIPE_PUBLISH_KEY = import.meta.env.VITE_PAYMENT_STRIPE_PUBLISH_KEY;
// const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

// const CheckoutForm = () => {
// 	const stripe = useStripe();
// 	const elements = useElements();
// 	const [loading, setLoading] = useState(false);
// 	const [message, setMessage] = useState("");
// 	const [paymentRequest, setPaymentRequest] = useState(null);
// 	const [savedCards, setSavedCards] = useState([
// 		{ id: 1, last4: "4242", brand: "Visa" },
// 		{ id: 2, last4: "1881", brand: "MasterCard" },
// 	]);

// 	useEffect(() => {
// 		if (!stripe) return;

// 		const pr = stripe.paymentRequest({
// 			country: "US",
// 			currency: "usd",
// 			total: { label: "Total", amount: 5000 },
// 			requestPayerName: true,
// 			requestPayerEmail: true,
// 		});

// 		pr.canMakePayment().then((result) => {
// 			if (result) setPaymentRequest(pr);
// 		});
// 	}, [stripe]);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		setLoading(true);

// 		try {
// 			const { data } = await axios.post("http://localhost:5000/create-payment-intent", {
// 				amount: 5000,
// 			});

// 			const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
// 				payment_method: {
// 					card: elements.getElement(CardNumberElement),
// 				},
// 			});

// 			if (error) {
// 				setMessage(error.message);
// 			} else if (paymentIntent?.status === "succeeded") {
// 				setMessage("Payment Successful!");
// 			}
// 		} catch (err) {
// 			setMessage("Payment failed. Please try again.");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, y: -20 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			transition={{ duration: 0.5 }}
// 			className="checkout-container"
// 		>
// 			<Paper elevation={3} className="checkout-box">
// 				<Typography variant="h5" className="checkout-title">
// 					Complete Your Payment
// 				</Typography>

// 				{paymentRequest && (
// 					<Box mb={2}>
// 						<PaymentRequestButtonElement options={{ paymentRequest }} />
// 					</Box>
// 				)}

// 				<form onSubmit={handleSubmit} className="payment-form">
// 					<Box className="card-input-container">
// 						<CardNumberElement className="card-input" options={{ placeholder: "Card Number" }} />
// 					</Box>

// 					<Stack direction="row" spacing={2}>
// 						<Box flex={1} className="card-input-container">
// 							<CardExpiryElement className="card-input" options={{ placeholder: "MM/YY" }} />
// 						</Box>
// 						<Box flex={1} className="card-input-container">
// 							<CardCvcElement className="card-input" options={{ placeholder: "CVC" }} />
// 						</Box>
// 					</Stack>

// 					<Button
// 						variant="contained"
// 						color="primary"
// 						fullWidth
// 						type="submit"
// 						disabled={!stripe || loading}
// 						className="pay-button"
// 					>
// 						{loading ? <CircularProgress size={24} color="inherit" /> : "Pay Now"}
// 					</Button>
// 				</form>

// 				{message && <Typography className="payment-message">{message}</Typography>}

// 				<Box mt={3}>
// 					<Typography variant="h6" className="saved-cards-title">
// 						Saved Cards
// 					</Typography>
// 					<Stack spacing={1} className="saved-cards-container">
// 						{savedCards.map((card) => (
// 							<motion.div key={card.id} className="saved-card" whileHover={{ scale: 1.05 }}>
// 								<Typography className="card-details">
// 									{card.brand} **** **** **** {card.last4}
// 								</Typography>
// 								<Button variant="outlined" size="small" className="use-card-button">
// 									Use
// 								</Button>
// 							</motion.div>
// 						))}
// 					</Stack>
// 				</Box>

// 				{paymentRequest && (
// 					<Box mt={3}>
// 						<Typography variant="h6" className="alternative-payment-title">
// 							Other Payment Options
// 						</Typography>
// 						<PaymentRequestButtonElement options={{ paymentRequest }} />
// 					</Box>
// 				)}
// 			</Paper>
// 		</motion.div>
// 	);
// };

// const StripeCheckout = () => (
// 	<Elements stripe={stripePromise}>
// 		<CheckoutForm />
// 	</Elements>
// );

// export default StripeCheckout;
