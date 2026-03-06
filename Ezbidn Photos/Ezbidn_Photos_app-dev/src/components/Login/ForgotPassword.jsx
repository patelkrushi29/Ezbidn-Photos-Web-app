import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./login.css"; // External CSS
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/slices/authSlice";

/* Validation Schema */
const forgotPasswordSchema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
	const [email, setEmail] = useState(""); // Add state for email
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(forgotPasswordSchema),
	});

	const onSubmit = async () => {
		const response = await dispatch(forgotPassword(email));
		if (response.payload?.status) {
			navigate("/otp-verify", { state: { email, from: "forgot-password" } });
		}
	};

	return (
		<div className="forgot-container">
			<Typography variant="h4" className="auth-title">
				Forgot Password
			</Typography>
			<Typography variant="body1" className="forgot-subtitle">
				Enter your registered email address, we will send you a verification code.
			</Typography>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="forgot-input-group">
					<label>
						Email Address<span className="required">*</span>
					</label>
					<TextField
						fullWidth
						placeholder="Enter email address"
						{...register("email")}
						error={!!errors.email}
						helperText={errors.email?.message}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<Button type="submit" fullWidth className="forgot-button">
					Send Code
				</Button>
			</form>

			<Typography align="center" className="forgot-footer">
				Don’t have an account?{" "}
				<Link to="/register" className="register-link">
					Register Now
				</Link>
			</Typography>
		</div>
	);
};

export default ForgotPassword;
