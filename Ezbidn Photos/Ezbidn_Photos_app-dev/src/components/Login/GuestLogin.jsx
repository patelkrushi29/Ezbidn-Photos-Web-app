import React, { useState } from "react";
import { TextField, Button, IconButton, Typography, Box, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginGuestUser, loginUser } from "../../redux/slices/authSlice";
import "./login.css";

const LoginGuest = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailValid, setEmailValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoginedUser, setIsLoginedUser] = useState(false);
	const [touched, setTouched] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.auth);

	const validateEmail = (value) => {
		const isValid = /^\S+@\S+\.\S+$/.test(value);
		setEmailValid(isValid);
		setTouched(true);
	};

	const handleEmailChange = (e) => {
		const val = e.target.value;
		setEmail(val);
		validateEmail(val);
	};

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const handleAction = async () => {
		if (!isLoginedUser && emailValid) {
			const response = await dispatch(loginGuestUser({ email }));

			if (response.payload?.customcode == 214) {
				setIsLoginedUser(true);
				navigate("/user/profile/inmates");
			}
		} else if (isLoginedUser && password) {
			const response = await dispatch(loginUser({ email, password }));
			if (response.payload?.status) {
				navigate("/user/profile/inmates");
			}
		}
	};

	return (
		<div className="login-auth-wrapper">
			<Typography variant="h4" className="auth-title">
				{isLoginedUser ? "Login" : "Guest Login"}
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
					value={email}
					onChange={handleEmailChange}
					error={touched && !emailValid}
					helperText={touched && !emailValid ? "Enter a valid email" : ""}
					className="auth-input-field"
				/>
			</div>

			{isLoginedUser && (
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="auth-input-field"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={togglePasswordVisibility} edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</div>
			)}

			<Button
				variant="contained"
				className="auth-login-btn"
				fullWidth
				onClick={handleAction}
				disabled={!emailValid || (isLoginedUser && !password)}
			>
				{loading ? "Logging in..." : isLoginedUser ? "Login" : "Continue"}
			</Button>

			{error && <Typography className="auth-error-text">{error}</Typography>}

			<Box className="auth-register-text">
				<span>Don’t have an account? </span>
				<span className="auth-register-link" onClick={() => navigate("/register")}>
					Register Now
				</span>
			</Box>
		</div>
	);
};

export default LoginGuest;
