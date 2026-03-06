import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import "./contact.css";
import apiHandler from "../../utils/API/api";
import apiConfig from "../../utils/API/apiConfig";
import { enqueueSnackbar } from "notistack";

const ContactUs = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState({ email: "", message: "" });

	const validateForm = () => {
		let valid = true;
		let errors = { email: "", message: "" };

		if (!/\S+@\S+\.\S+/.test(email)) {
			errors.email = "Please enter a valid email";
			valid = false;
		}
		if (message.trim() === "") {
			errors.message = "Message cannot be empty";
			valid = false;
		}

		setError(errors);
		return valid;
	};

	const handleSubmit = async () => {
		if (validateForm()) {
			const response = await apiHandler.post(
				apiConfig.user.contactUsForm.url,
				{},
				{
					email: email,
					description: message,
				}
			);
			if (response?.status) {
				enqueueSnackbar(response?.message || "Message sent Successfully", { variant: "success" });
				setEmail("");
				setMessage("");
			}
		}
	};

	return (
		<Box className="contact-container">
			<Typography variant="h5" className="contact-title">
				Support Center
			</Typography>
			<Typography className="contact-subtitle">
				Our dedicated team is here to assist you with any questions or issues.
			</Typography>

			<Box className="contact-flex">
				<Box className="contact-box">
					<img src="/assets/png/contact/contact1.png" alt="Support Team" className="contact-image" />
					<Typography className="contact-heading">Visit Us</Typography>
					<Typography className="contact-text">
						123 Irving St, San Francisco,
						<br /> California 93510
					</Typography>
				</Box>

				<Box className="contact-box">
					<img src="/assets/png/contact/contact2.png" alt="Customer Support" className="contact-image" />
					<Typography className="contact-heading">Contact Us</Typography>
					<Typography className="contact-text">
						<a href="mailto:support@ezbidn.com" className="contact-link">
							support@ezbidn.com
						</a>
						<br />
						<a href="tel:+16156166170" className="contact-link">
							(615) 616-6170
						</a>
					</Typography>
				</Box>
			</Box>

			{/* Contact Form */}
			<Box className="contact-form-box">
				<Typography className="contact-form-label" variant="h6">
					For Any Help
				</Typography>
				<TextField
					variant="outlined"
					fullWidth
					placeholder="Enter Your Email"
					className="contact-form-input"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={!!error.email}
					helperText={error.email}
				/>
				<TextField
					variant="outlined"
					fullWidth
					placeholder="Enter Your Message"
					multiline
					rows={4}
					className="contact-form-input"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					error={!!error.message}
					helperText={error.message}
				/>
				<Button variant="contained" className="contact-form-button" onClick={handleSubmit}>
					<Typography variant="body1">Email Us {"  "} </Typography>
					<SendTwoToneIcon size={"small"} sx={{ marginLeft: "1rem" }} />
				</Button>
			</Box>
		</Box>
	);
};

export default ContactUs;
