import React, { useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./login.css"; // External CSS for styling
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";

/* ✅ Validation Schema */
const registerSchema = yup.object({
	name: yup.string().required("Full Name is required"),
	email: yup.string().email("Invalid email").required("Email is required"),
	// phone: yup
	// 	.string()
	// 	.matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
	// 	.required("Phone Number is required"),
	password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Confirm Password is required"),
});

const Register = () => {
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(registerSchema),
	});

	const onSubmit = async (data) => {
		setLoading(true);
		const response = await dispatch(registerUser(data));
		if (response.payload?.status) {
			navigate("/otp-verify", { state: { email: data.email, from: "register" } });
		}
		setLoading(false);
		// setTimeout(() => {
		// 	setLoading(false);
		// 	alert("Registration Successful!");
		// 	navigate("/dashboard"); // Redirect after successful registration
		// }, 2000);
	};

	return (
		<div className="register-container">
			<Typography variant="h4" className="auth-title">
				Create your account!
			</Typography>
			<Typography className="register-subtitle">Start connecting with your loved ones today</Typography>

			<form onSubmit={handleSubmit(onSubmit)} className="register-form">
				{/* ✅ Full Name Field */}
				<div className="input-group">
					<label className="input-label">
						Full Name <span className="required">*</span>
					</label>
					<TextField
						fullWidth
						placeholder="Enter your name"
						{...register("name")}
						error={!!errors.name}
						helperText={errors.name?.message}
					/>
				</div>

				{/* ✅ Email Field */}
				<div className="input-group">
					<label className="input-label">
						Email Address <span className="required">*</span>
					</label>
					<TextField
						fullWidth
						placeholder="Enter email address"
						{...register("email")}
						error={!!errors.email}
						helperText={errors.email?.message}
					/>
				</div>

				{/* ✅ Phone Number Field */}
				{/* <div className="input-group">
					<label className="input-label">
						Phone Number <span className="required">*</span>
					</label>
					<TextField
						fullWidth
						placeholder="Your phone number"
						{...register("phone")}
						error={!!errors.phone}
						helperText={errors.phone?.message}
					/>
				</div> */}

				{/* ✅ Password Field */}
				<div className="input-group">
					<label className="input-label">
						Set Password <span className="required">*</span>
					</label>
					<TextField
						fullWidth
						type="password"
						placeholder="Enter password"
						{...register("password")}
						error={!!errors.password}
						helperText={errors.password?.message}
					/>
				</div>

				{/* ✅ Confirm Password Field */}
				<div className="input-group">
					<label className="input-label">
						Confirm Password <span className="required">*</span>
					</label>
					<TextField
						fullWidth
						type="password"
						placeholder="Confirm password"
						{...register("confirmPassword")}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword?.message}
					/>
				</div>

				{/* ✅ Signup Button with Loader */}
				<Button type="submit" fullWidth variant="contained" className="register-button" disabled={loading}>
					{loading ? <CircularProgress size={24} color="inherit" /> : "Signup"}
				</Button>
			</form>

			{/* ✅ Already have an account? */}
			<Typography align="center" className="register-footer">
				Already have an account?{" "}
				<span className="login-link" onClick={() => navigate("/login")}>
					Login
				</span>
			</Typography>
		</div>
	);
};

export default Register;
