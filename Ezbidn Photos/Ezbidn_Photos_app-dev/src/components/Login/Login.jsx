import React, { useState } from "react";
import { TextField, Button, IconButton, Typography, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/authSlice"; // Import Redux action
import "./login.css";

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({ email: "", password: "" });

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.auth);

	// Toggle password visibility
	const handleShowPassword = () => setShowPassword(!showPassword);

	// Handle input change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Validate form
	const validateForm = () => {
		let newErrors = { email: "", password: "" };
		if (!formData.email) newErrors.email = "Email/Phone is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email) && isNaN(formData.email)) {
			newErrors.email = "Enter a valid email or phone number";
		}
		if (!formData.password) newErrors.password = "Password is required";
		else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
		setErrors(newErrors);
		return Object.values(newErrors).every((error) => error === "");
	};

	// Handle Login
	const handleLogin = async (e) => {
		e.preventDefault();
		if (validateForm()) {
			const response = await dispatch(loginUser(formData));
			if (response.payload?.status) {
				if (response.payload.isUserAdmin) {
					navigate("/admin");
				} else {
					navigate("/user/profile/inmates");
				}
			} else if (response.payload.customcode === 210) {
				navigate("/otp-verify", { state: { email: formData.email, from: "register" } });
			}
		}
	};

	return (
		<div className="login-auth-wrapper">
			<Typography variant="h4" className="auth-title">
				Login
			</Typography>
			<Typography variant="body2" className="auth-subtitle">
				Make time to reconnect with your loved ones today
			</Typography>

			<div className="auth-input-group">
				<Typography className="auth-label">
					Email <span className="required">*</span>
				</Typography>
				<TextField
					placeholder="Enter your email"
					variant="outlined"
					fullWidth
					name="email"
					value={formData.email}
					onChange={handleChange}
					error={!!errors.email}
					helperText={errors.email}
					className="auth-input-field"
				/>
			</div>

			<div className="auth-input-group">
				<Typography className="auth-label">
					Password <span className="required">*</span>
				</Typography>
				<TextField
					placeholder="Enter your password"
					variant="outlined"
					fullWidth
					name="password"
					type={showPassword ? "text" : "password"}
					value={formData.password}
					onChange={handleChange}
					error={!!errors.password}
					helperText={errors.password}
					className="auth-input-field"
					InputProps={{
						endAdornment: (
							<IconButton onClick={handleShowPassword} edge="end">
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						),
					}}
				/>
			</div>

			<Typography className="auth-forgot-password" onClick={() => navigate("/forgot-password")}>
				Forgot Password?
			</Typography>

			<Button variant="contained" className="auth-login-btn" fullWidth onClick={handleLogin} disabled={loading}>
				{loading ? "Logging in..." : "Login"}
			</Button>

			{error && <Typography className="auth-error-text">{error}</Typography>}

			<Box className="auth-register-text">
				<span>Don’t have an account? </span>
				<Button variant="outline" className="auth-register-link" onClick={() => navigate("/register")}>
					Register Now
				</Button>
			</Box>
		</div>
	);
};

export default Login;
