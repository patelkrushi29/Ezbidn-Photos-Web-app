import { useState, useEffect } from "react";
import { TextField, Button, IconButton, Card, CardContent, Box, Stack, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PasswordIcon from "@mui/icons-material/Password";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, fetchProfile, updateProfile } from "../../redux/slices/profileSlice";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [showPassword, setShowPassword] = useState({
		oldPassword: false,
		newPassword: false,
		confirmPassword: false,
	});
	const [userData, setUserData] = useState({
		FullName: "",
		Email: "yourmail@example.com",
		Phone: "XXX-XXX-XXXX",
	});
	const [passwordData, setPasswordData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	useEffect(() => {
		setUserData({
			FullName: user.name,
			Email: user.email || "yourmail@example.com",
			Phone: user.phone || "XXX-XXX-XXXX",
		});
	}, [user]);

	const handleEditClick = () => {
		setIsEditing(true);
		setIsChangingPassword(false);
	};

	const handlePassClick = () => {
		setIsChangingPassword(true);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setIsChangingPassword(false);
		setErrors({});
	};

	const validatePassword = () => {
		let tempErrors = {};
		if (!passwordData.oldPassword) tempErrors.oldPassword = "Old password is required";
		if (!passwordData.newPassword) tempErrors.newPassword = "New password is required";
		else if (passwordData.newPassword.length < 6) tempErrors.newPassword = "Password must be at least 6 characters";
		if (!passwordData.confirmPassword) tempErrors.confirmPassword = "Confirm password is required";
		else if (passwordData.newPassword !== passwordData.confirmPassword)
			tempErrors.confirmPassword = "Passwords do not match";

		setErrors(tempErrors);
		return Object.keys(tempErrors).length === 0;
	};

	const changeProfileDetail = async () => {
		const response = await dispatch(updateProfile(userData));

		if (response.payload?.status) {
			dispatch(fetchProfile());
			setIsEditing(false);
		}
	};

	const handlePasswordChange = async () => {
		if (validatePassword()) {
			const response = await dispatch(changePassword(passwordData));

			if (response.payload?.status) {
				dispatch(logout());
				navigate("/login");
				setIsChangingPassword(false);
			}
		}
	};

	const handleShowPassword = (field) => {
		setShowPassword((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};
	const topTitle = isEditing ? "Update Profile" : isChangingPassword ? "Change Password" : "My Profile";

	return (
		<Card className="profile-card">
			<CardContent className="profile-card-content">
				<Box className="profile-header">
					<h2 className="profile-title">{topTitle}</h2>
					{!isEditing && !isChangingPassword && user?.provider === "email" && (
						<Box>
							<IconButton title="Update Profile" className="edit-btn" onClick={handleEditClick}>
								<EditIcon />
							</IconButton>
							{user.role !== "guest" && (
								<IconButton title="Change Password" className="edit-btn" onClick={handlePassClick}>
									<PasswordIcon />
								</IconButton>
							)}
						</Box>
					)}
				</Box>

				{/* Profile Editing Section */}
				{isEditing && (
					<Stack spacing={2} className="profile-form ">
						{["FullName", "Email", "Phone"].map((field) => (
							<Box key={field}>
								<TextField
									label={field.replace(/([A-Z])/g, " $1").trim()}
									variant="outlined"
									fullWidth
									value={userData[field]}
									disabled={field === "Email"}
									onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
								/>
							</Box>
						))}

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="profile-actions">
							<Button variant="contained" color="primary" className="save-btn" onClick={changeProfileDetail}>
								Save Changes
							</Button>
							<Button variant="outlined" className="cancel-btn" onClick={handleCancel}>
								Cancel
							</Button>
						</Stack>
					</Stack>
				)}

				{/* Password Change Section */}
				{isChangingPassword && (
					<Stack spacing={2} className="password-form">
						{["oldPassword", "newPassword", "confirmPassword"].map((field) => (
							<TextField
								key={field}
								label={
									field === "oldPassword"
										? "Old Password"
										: field === "newPassword"
										? "New Password"
										: "Confirm Password"
								}
								type={showPassword[field] ? "text" : "password"}
								variant="outlined"
								fullWidth
								value={passwordData[field]}
								onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
								error={Boolean(errors[field])}
								helperText={errors[field]}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => handleShowPassword(field)}>
												{showPassword[field] ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						))}

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="profile-actions">
							<Button variant="contained" color="primary" className="save-btn" onClick={handlePasswordChange}>
								Change Password
							</Button>
							<Button variant="outlined" className="cancel-btn" onClick={handleCancel}>
								Cancel
							</Button>
						</Stack>
					</Stack>
				)}

				{/* Display Profile Info When Not Editing */}
				{!isEditing && !isChangingPassword && (
					<Stack spacing={2} className="profile-info">
						{["FullName", "Email", "Phone"].map((field) => (
							<Box key={field} className="profile-text">
								<strong>{field.replace(/([A-Z])/g, " $1").trim()}:</strong> {userData[field]}
							</Box>
						))}
					</Stack>
				)}
			</CardContent>
		</Card>
	);
};

export default ProfileEdit;
