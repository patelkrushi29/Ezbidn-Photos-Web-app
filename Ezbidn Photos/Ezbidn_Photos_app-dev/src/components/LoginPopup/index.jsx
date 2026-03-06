import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	IconButton,
	Typography,
	Box,
	InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import "./PopupLogin.css";
import { loginGuestUser } from "../../redux/slices/authSlice";

const MotionDialog = motion(Dialog);

const PopupLogin = ({ open, onClose }) => {
	const [email, setEmail] = useState("");
	const [emailValid, setEmailValid] = useState(false);
	const [password, setPassword] = useState("");
	const [isLoginedUser, setIsLoginedUser] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [touched, setTouched] = useState(false);

	const dispatch = useDispatch();

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

	const handleClose = () => {
		setEmail("");
		setPassword("");
		setEmailValid(false);
		setTouched(false);
		setShowPassword(false);
		setIsLoginedUser(false);
		onClose();
	};

	const handleAction = () => {
		debugger;
		if (emailValid && !isLoginedUser) {
			setIsLoginedUser(true);
		} else if (isLoginedUser && password) {
			const response = dispatch(loginGuestUser({ email, password }));

			if (response.payload?.status) {
				navigate("/user/profile/inmates");
			}
		} else {
			return;
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<MotionDialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
			PaperComponent={motion.div}
			PaperProps={{
				initial: { scale: 0.7, opacity: 0 },
				animate: { scale: 1, opacity: 1 },
				exit: { scale: 0.7, opacity: 0 },
				transition: { duration: 0.3 },
				className: "popup-login-container",
			}}
		>
			<Box className="popup-login-header-box">
				<Box className="popup-login-icon-button">
					<img src="/assets/svgs/ezLogo.svg" alt="ezbidn" className="popup-login-icon" />
				</Box>
				<DialogTitle className="popup-login-title">{isLoginedUser ? "Login" : "Login as Guest"}</DialogTitle>
			</Box>

			<DialogContent className="popup-login-content">
				<Box className="popup-login-fields">
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
						<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
									className="popup-login-password"
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
						</motion.div>
					)}

					<Box className="popup-login-actions">
						<Button onClick={handleClose} variant="outlined" color="error">
							Cancel
						</Button>
						<Button onClick={handleAction} variant="contained" disabled={!emailValid}>
							{isLoginedUser ? "Login" : "Guest Login"}
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</MotionDialog>
	);
};

export default PopupLogin;
