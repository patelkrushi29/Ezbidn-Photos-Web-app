import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	Avatar,
	Typography,
	Stack,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/CameraAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import SupportIcon from "@mui/icons-material/Support";
import QuestionMarkIcon from "@mui/icons-material/HelpOutline";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import RefundIcon from "@mui/icons-material/MonetizationOn";
import GavelIcon from "@mui/icons-material/Gavel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LogoutIcon from "@mui/icons-material/Logout";
import "./account.css";
import { logout } from "../../redux/slices/authSlice";
import { Close } from "@mui/icons-material";

const Account = ({ closeDrawer }) => {
	const location = useLocation();
	const dispatch = useDispatch();
	const { user, isLoggedIn } = useSelector((state) => state.auth);
	const [accountOpen, setAccountOpen] = useState(true);
	const [supportOpen, setSupportOpen] = useState(true);
	// State for logout confirmation modal
	const [openLogoutModal, setOpenLogoutModal] = useState(false);
	const navigate = useNavigate();

	// State for profile picture selection and preview modal
	const [openImageModal, setOpenImageModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [profileImage, setProfileImage] = useState(user?.avatar || "https://via.placeholder.com/60");

	const handleLogout = () => {
		dispatch(logout());
		navigate("/");
		setOpenLogoutModal(false);
		closeDrawer();
	};
	const toggleAccountSection = () => setAccountOpen(!accountOpen);
	const toggleSupportSection = () => setSupportOpen(!supportOpen);
	// Handle image selection
	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setSelectedImage(imageUrl);
			setOpenImageModal(true);
		}
	};

	// Confirm image selection
	const handleConfirmImage = () => {
		setProfileImage(selectedImage);
		setOpenImageModal(false);
	};

	// Cancel image selection
	const handleCancelImage = () => {
		setSelectedImage(null);
		setOpenImageModal(false);
	};

	const menuItems = [
		{ text: "My Orders", icon: <AccountBoxIcon />, link: "/user/profile/orders" },
		{ text: "Inmates", icon: <AccountBoxIcon />, link: "/user/profile/inmates" },
		{ text: "Plans", icon: <SubscriptionsIcon />, link: "/user/profile/subscription" },
		// { text: "Payment Methods", icon: <PaymentIcon />, link: "/user/profile/payments" },
	];

	const supportItems = [
		{ text: "About Us", icon: <SupportIcon />, link: "/user/about" },
		{ text: "Support Center", icon: <SupportIcon />, link: "/user/contact" },
		{ text: "FAQ", icon: <QuestionMarkIcon />, link: "/user/faq" },
		{ text: "Privacy Policy", icon: <PrivacyTipIcon />, link: "/user/privacy" },
		{ text: "Refund Policy", icon: <RefundIcon />, link: "/user/refund" },
		{ text: "Terms & Conditions", icon: <GavelIcon />, link: "/user/terms" },
	];

	return (
		<Box className="account-container">
			<Box className="account-header-box">
				<img src="/assets/svgs/ezLogo.svg" alt="logo" className="account-logo" />
				<IconButton className="account-close" onClick={closeDrawer}>
					{" "}
					<Close />
				</IconButton>
			</Box>
			{/* Profile Card */}
			{isLoggedIn && (
				<Box className="acc-profile-card">
					<Box className="profile-avatar">
						<Avatar
							src={profileImage}
							className="capitalize"
							alt={user?.name || "User"}
							sx={{ height: "60px", width: "60px" }}
						/>
						<Box className="edit-icon">
							<label htmlFor="file-input">
								<EditIcon fontSize="small" color="primary" style={{ cursor: "pointer" }} />
							</label>
							<input
								id="file-input"
								type="file"
								accept="image/*"
								style={{ display: "none" }}
								onChange={handleImageChange}
							/>
						</Box>
					</Box>
					<Box>
						<Link to={"/user/profile/account"} onClick={closeDrawer}>
							<Typography variant="h6" className="capitalize">
								{user?.name || "Alex Smith"}
							</Typography>
							<Typography variant="body2">My Profile →</Typography>
						</Link>
					</Box>
				</Box>
			)}

			{/* My Account Section - Visible Only If Logged In */}
			{isLoggedIn && (
				<Box>
					<Box className="section-header" onClick={toggleAccountSection}>
						<Typography className="section-title">My Account</Typography>
						{accountOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					</Box>
					{accountOpen && (
						<Stack spacing={1} className="slide-in">
							{menuItems.map((item, index) => (
								<Link key={"account" + index} to={item.link} onClick={closeDrawer}>
									<Box className={`menu-item ${location.pathname === item.link ? "active-item" : ""}`}>
										{item.icon}
										<Typography>{item.text}</Typography>
									</Box>
								</Link>
							))}
						</Stack>
					)}
					<hr className="divider" />
				</Box>
			)}

			<Box>
				<Box className="section-header" onClick={toggleSupportSection}>
					<Typography className="section-title">Help & Support</Typography>
					{supportOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</Box>
				{supportOpen && (
					<Stack spacing={1} className="slide-in">
						{supportItems.map((item, index) => (
							<Link key={"support" + index} to={item.link} onClick={closeDrawer}>
								<Box className={`menu-item ${location.pathname === item.link ? "active-item" : ""}`}>
									{item.icon}
									<Typography>{item.text}</Typography>
								</Box>
							</Link>
						))}
					</Stack>
				)}
			</Box>
			{isLoggedIn && (
				<Box className="menu-item logout-item" onClick={() => setOpenLogoutModal(true)}>
					<Box display="flex">
						<LogoutIcon />
						<Typography>Logout</Typography>
					</Box>
					<ArrowForwardIosIcon fontSize="small" />
				</Box>
			)}

			{/* Logout Confirmation Modal */}
			<Dialog open={openLogoutModal} onClose={() => setOpenLogoutModal(false)}>
				<Box className="logout-dialog">
					<DialogTitle className="logout-dialog-title">Confirm Logout</DialogTitle>
					<DialogContent className="logout-dialog-content">
						<Typography>Are you sure you want to log out?</Typography>
					</DialogContent>
					<DialogActions className="logout-dialog-actions">
						<Button onClick={() => setOpenLogoutModal(false)} color="primary">
							Cancel
						</Button>
						<Button onClick={handleLogout} color="error" variant="contained">
							Logout
						</Button>
					</DialogActions>
				</Box>
			</Dialog>

			{/* Image Preview Modal */}
			<Dialog open={openImageModal} onClose={handleCancelImage}>
				<Box className="image-preview-dialog">
					<DialogTitle className="image-preview-title">Confirm Profile Picture</DialogTitle>
					<DialogContent className="image-preview-content">
						{selectedImage && (
							<Avatar src={selectedImage} alt="Preview" sx={{ width: 120, height: 120, margin: "auto" }} />
						)}
					</DialogContent>
					<DialogActions className="image-preview-actions">
						<Button onClick={handleCancelImage} color="primary">
							Cancel
						</Button>
						<Button onClick={handleConfirmImage} color="success" variant="contained">
							Confirm
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
		</Box>
	);
};

export default Account;
