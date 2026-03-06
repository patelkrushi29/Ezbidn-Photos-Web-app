import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "./login.css";
import { useDispatch } from "react-redux";
import { resendOtp, verifyOtp, verifyPasswordOtp } from "../../redux/slices/authSlice";

const OTPVerification = () => {
	const [timer, setTimer] = useState(120);
	const [isResendDisabled, setIsResendDisabled] = useState(true);
	const [otp, setOtp] = useState(new Array(6).fill(""));
	const inputRefs = useRef([]);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	let { email, from } = location.state;

	useEffect(() => {
		if (from !== "forgot-password" && from !== "register" && from !== "login") {
			navigate("/");
		}
		if (from !== "login") {
			handleResend();
		}
	}, [location]);

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setIsResendDisabled(false);
		}
	}, [timer]);

	const handleResend = async () => {
		if (!email) {
			return;
		}
		const response = await dispatch(resendOtp(email));

		if (response.payload?.status) {
			setTimer(120);
			setIsResendDisabled(true);
		}
	};

	const handleChange = (index, e) => {
		const value = e.target.value.replace(/[^0-9]/g, "");
		if (value) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);
			if (index < 5 && inputRefs.current[index + 1]) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace") {
			const newOtp = [...otp];

			if (!newOtp[index] && index > 0) {
				inputRefs.current[index - 1].focus();
			}

			newOtp[index] = "";
			setOtp(newOtp);
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
		if (pastedData.length === 6) {
			setOtp(pastedData.split(""));
			pastedData.split("").forEach((char, i) => {
				if (inputRefs.current[i]) {
					inputRefs.current[i].value = char;
				}
			});
		}
	};

	const handleSubmit = async () => {
		const otpIs = otp.join("");
		const ResetPassword = from === "forgot-password";
		if (otpIs.length === 6 && email) {
			const response = await dispatch(
				ResetPassword ? verifyPasswordOtp({ email, otp: otpIs }) : verifyOtp({ email, otp: otpIs })
			);

			if (response.payload?.status) {
				if (from === "register" || from === "login") {
					navigate("/login");
				} else if (from === "forgot-password") {
					navigate("/confirm-password", { state: { email, verificationId: response.payload?.data?.verificationId } });
				}
			}
		} else {
			alert("Please enter a valid 6-digit OTP");
		}
	};

	return (
		<div className="forgot-container">
			<Typography variant="h4" className="forgot-title">
				Verify OTP
			</Typography>
			<Typography variant="body1" className="forgot-subtitle">
				Enter your verification code from your email address that we’ve sent.
			</Typography>

			<div className="otp-container" onPaste={handlePaste}>
				{otp.map((value, i) => (
					<input
						key={"otp" + i}
						type="text"
						maxLength="1"
						pattern="[0-9]*"
						className="otp-box"
						value={value}
						onChange={(e) => handleChange(i, e)}
						onKeyDown={(e) => handleKeyDown(i, e)}
						ref={(el) => (inputRefs.current[i] = el)}
					/>
				))}
			</div>

			<Button fullWidth className="forgot-button" onClick={handleSubmit}>
				Verify
			</Button>

			<Typography align="center" className="forgot-footer">
				Didn’t receive?{" "}
				{isResendDisabled ? (
					<span className="resend-timer">
						Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
					</span>
				) : (
					<Button variant="outline" className="resend-link" onClick={handleResend}>
						Resend
					</Button>
				)}
			</Typography>
		</div>
	);
};

export default OTPVerification;
