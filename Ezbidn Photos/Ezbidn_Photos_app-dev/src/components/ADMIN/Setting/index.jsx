import React, { useState } from "react";
import {
	Box,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Paper,
	Button,
	TextField,
	InputAdornment,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	ListItemIcon,
	Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import "./setting.css";
import UnderConstruction from "../../InProgress";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const AdminSettingsPage = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedSection, setSelectedSection] = useState("General");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [openOtpModal, setOpenOtpModal] = useState(false);
	const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

	const [photoCounts, setPhotoCounts] = useState({
		Basic: 5,
		Standard: 10,
		Premium: 20,
	});

	const [pricing, setPricing] = useState({
		Basic: 50,
		Standard: 100,
		Premium: 150,
	});

	const [photoSettings, setPhotoSettings] = useState({
		maxFileSize: 5,
		storagePath: "/uploads/photos/",
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	const handleSectionChange = (section) => {
		setSelectedSection(section);
		setDrawerOpen(false);
	};

	const handleLogout = () => {
		setOpenLogoutDialog(true);
	};

	const confirmLogout = () => {
		dispatch(logout());
		navigate("/");
		setOpenLogoutDialog(false);
	};

	const handlePasswordUpdate = () => {
		if (password === confirmPassword) {
			setOpenOtpModal(true);
		} else {
			alert("Passwords do not match!");
		}
	};

	const verifyOtp = () => {
		if (otp === "123456") {
			alert("Password updated successfully!");
			setOpenOtpModal(false);
		} else {
			alert("Invalid OTP!");
		}
	};

	const handlePhotoSettingsUpdate = () => {
		alert("Photo Upload Settings updated successfully!");
	};

	const renderContent = () => {
		switch (selectedSection) {
			case "General":
				return <UnderConstruction />;

			case "Account":
				return (
					<Box>
						<Typography variant="h6">Account Settings</Typography>
						<TextField
							label="New Password"
							type={showPassword ? "text" : "password"}
							fullWidth
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							className="settings-input"
						/>
						<TextField
							label="Confirm Password"
							type={showConfirmPassword ? "text" : "password"}
							fullWidth
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
											{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							className="settings-input"
						/>
						<Button variant="contained" color="primary" onClick={handlePasswordUpdate} className="settings-btn">
							Update Password
						</Button>
					</Box>
				);

			case "Subscriptions":
				return (
					<Box>
						<Typography variant="h6">Update Subscription Plans</Typography>
						{["Basic", "Standard", "Premium"].map((plan) => (
							<Box key={plan} className="subscription-input">
								<TextField
									label={`Photo Count for ${plan}`}
									fullWidth
									value={photoCounts[plan]}
									onChange={(e) => setPhotoCounts({ ...photoCounts, [plan]: e.target.value })}
								/>
								<TextField
									label={`Price for ${plan}`}
									fullWidth
									value={pricing[plan]}
									onChange={(e) => setPricing({ ...pricing, [plan]: e.target.value })}
								/>
							</Box>
						))}
						<Button variant="contained" color="primary" className="settings-btn">
							Update Plans
						</Button>
					</Box>
				);

			case "Photo Upload":
				return (
					<Box>
						<Typography variant="h6">Photo Upload Settings</Typography>
						<TextField
							label="Max File Size (MB)"
							fullWidth
							type="number"
							value={photoSettings.maxFileSize}
							onChange={(e) => setPhotoSettings({ ...photoSettings, maxFileSize: e.target.value })}
							className="settings-input"
						/>
						<TextField
							label="Storage Path"
							fullWidth
							value={photoSettings.storagePath}
							onChange={(e) => setPhotoSettings({ ...photoSettings, storagePath: e.target.value })}
							className="settings-input"
						/>
						<Button variant="contained" color="primary" onClick={handlePhotoSettingsUpdate} className="settings-btn">
							Update Photo Settings
						</Button>
					</Box>
				);

			default:
				return <Typography variant="h6">Select a setting from the menu.</Typography>;
		}
	};

	return (
		<Box className="admin-settings-container">
			<IconButton className="menu-icon" onClick={handleDrawerToggle} sx={{ display: { xs: "block", md: "none" } }}>
				<MenuIcon />
			</IconButton>
			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={handleDrawerToggle}
				variant="temporary"
				className="settings-drawer"
			>
				<List>
					{[
						{ name: "General", icon: <SettingsIcon /> },
						{ name: "Account", icon: <LockIcon /> },
						// { name: "Subscriptions", icon: <CreditCardIcon /> },
						// { name: "Photo Upload", icon: <PhotoLibraryIcon /> },
					].map((item) => (
						<ListItem
							button
							key={item.name}
							onClick={() => handleSectionChange(item.name)}
							className={selectedSection === item.name ? "selected-section" : ""}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItem>
					))}
				</List>
			</Drawer>

			<Box className="settings-flex-container">
				<Box className="settings-sidebar" sx={{ display: { xs: "none", md: "block" } }}>
					<List>
						{[
							{ name: "General", icon: <SettingsIcon /> },
							{ name: "Account", icon: <LockIcon /> },
							// { name: "Subscriptions", icon: <CreditCardIcon /> },
							// { name: "Photo Upload", icon: <PhotoLibraryIcon /> },
						].map((item) => (
							<ListItem
								button
								key={item.name}
								onClick={() => handleSectionChange(item.name)}
								className={selectedSection === item.name ? "selected-section" : ""}
							>
								<ListItemIcon>{item.icon}</ListItemIcon>
								<ListItemText primary={item.name} />
							</ListItem>
						))}
					</List>
					<Divider />
					<Button
						variant="contained"
						// color="secondary"
						onClick={handleLogout}
						startIcon={<ExitToAppIcon />}
						className="logout-btn"
					>
						Logout
					</Button>
				</Box>

				<Paper elevation={3} className="settings-content">
					{renderContent()}
				</Paper>
			</Box>

			{/* Logout Confirmation Dialog */}
			<Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
				<DialogTitle>Logout Confirmation</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure you want to log out?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenLogoutDialog(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={confirmLogout} color="red">
						Logout
					</Button>
				</DialogActions>
			</Dialog>

			{/* OTP Modal for Password Change */}
			<Dialog open={openOtpModal} onClose={() => setOpenOtpModal(false)}>
				<DialogTitle>Verify OTP</DialogTitle>
				<DialogContent>
					<DialogContentText>Please enter the OTP sent to your registered email.</DialogContentText>
					<TextField
						label="OTP"
						fullWidth
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						className="settings-input"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenOtpModal(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={verifyOtp} color="primary">
						Verify
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AdminSettingsPage;
