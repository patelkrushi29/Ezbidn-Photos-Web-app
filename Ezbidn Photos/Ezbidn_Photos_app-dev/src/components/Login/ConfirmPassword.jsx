import React, { useState } from "react";
import { TextField, Button, IconButton, InputAdornment, Typography, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const [errors, setErrors] = useState({});
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let { email, from, verificationId } = location.state;
	const validateForm = () => {
		let newErrors = {};

		if (!newPassword) {
			newErrors.newPassword = "New password is required";
		} else if (newPassword.length < 6) {
			newErrors.newPassword = "Password must be at least 6 characters";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "Confirm password is required";
		} else if (confirmPassword !== newPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validateForm()) {
			const response = await dispatch(resetPassword({ verificationId, newPassword, email }));
			if (response.payload?.status) {
				navigate("/login");
				console.info("Password Reset Successfully!");
			} // Handle API call here
		}
	};

	return (
		<Box className="reset-password-container" sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
			<Typography variant="h4" fontWeight="bold" gutterBottom>
				Reset Password
			</Typography>
			<Typography variant="body2" color="textSecondary" gutterBottom>
				Enter your new password and confirm the new password to reset password
			</Typography>

			<form onSubmit={handleSubmit}>
				<Box className="auth-input-group" mt={2}>
					<Typography className="auth-label">
						New Password <span className="required">*</span>
					</Typography>
					<TextField
						placeholder="Enter your Password"
						type={showPassword ? "text" : "password"}
						fullWidth
						variant="outlined"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						error={Boolean(errors.newPassword)}
						helperText={errors.newPassword}
						className="reset-password-field"
						sx={{ mt: 2 }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Box>
				<Box className="auth-input-group" mt={2}>
					<Typography className="auth-label">
						Confirm Password <span className="required">*</span>
					</Typography>
					<TextField
						placeholder="Please Enter Confirm Password"
						type={showPasswordConfirm ? "text" : "password"}
						fullWidth
						variant="outlined"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						error={Boolean(errors.confirmPassword)}
						helperText={errors.confirmPassword}
						className="confirm-password-field"
						sx={{ mt: 2 }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} edge="end">
										{showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Box>

				<Button type="submit" fullWidth variant="contained" className="reset-password-btn" sx={{ mt: 3, py: 1.5 }}>
					Save
				</Button>
			</form>
		</Box>
	);
};

export default ResetPassword;
