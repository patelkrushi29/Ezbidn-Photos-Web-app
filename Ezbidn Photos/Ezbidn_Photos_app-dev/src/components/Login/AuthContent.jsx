import React from "react";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { Box, Divider, IconButton } from "@mui/material";
import OAuthLogin from "./OAuthLogin";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import OTPVerification from "./Otp";
import ResetPassword from "./ConfirmPassword";
import LoginGuest from "./GuestLogin";

const AuthContent = () => {
	const path = window.location.pathname;
	const navigate = useNavigate();

	let Component;
	switch (path) {
		case "/register":
			Component = Register;
			break;
		case "/forgot-password":
			Component = ForgotPassword;
			break;
		case "/otp-verify":
			Component = OTPVerification;
			break;
		case "/confirm-password":
			Component = ResetPassword;
			break;
		case "/guest-user":
			Component = LoginGuest;
			break;
		default:
			Component = Login;
	}

	const showOAuth = !["/guest-user", "/forgot-password", "/otp-verify", "/confirm-password"].includes(path);

	return (
		<Box>
			<IconButton className="auth-back-btn" onClick={() => navigate(-1)}>
				<ArrowBackIosNewIcon /> Back
			</IconButton>
			<Component />
			{showOAuth && (
				<>
					<Divider sx={{ margin: "1rem 0" }} />
					<OAuthLogin />
				</>
			)}
		</Box>
	);
};

export default AuthContent;
