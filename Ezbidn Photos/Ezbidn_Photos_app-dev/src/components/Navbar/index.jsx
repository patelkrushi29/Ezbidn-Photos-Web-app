import { useState, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	Button,
	IconButton,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Container,
	useMediaQuery,
	Divider,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TocTwoToneIcon from "@mui/icons-material/TocTwoTone";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Account from "../Accounts";
import NotificationDrawer from "../Notification";

const Navbar = () => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
	const [showNavbar, setShowNavbar] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [showNotification, setShowNotification] = useState(false);
	const isSmallScreen = useMediaQuery("(max-width:900px)");
	const { isLoggedIn } = useSelector((state) => state.auth);

	const location = useLocation();

	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
	const handleLeftDrawerToggle = () => setLeftDrawerOpen(!leftDrawerOpen);
	useEffect(() => {
		const handleScroll = () => {
			setShowNavbar(window.scrollY < lastScrollY || window.scrollY < 50);
			setLastScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	const toggleNotfication = () => {
		setShowNotification(!showNotification);
	};

	const navItems = ["How It Works", "About Us", "FAQ", "Plans", "Contact"];
	const path = {
		"How It Works": "/user/how-it-work",
		"About Us": "/user/about",
		FAQ: "/user/faq",
		Plans: "/user/profile/subscription",
		Contact: "/user/contact",
	};
	const hamMenu = isLoggedIn || isSmallScreen;

	return (
		<Box className="navbar-container">
			<AppBar position="fixed" className={`navbar ${showNavbar ? "visible" : "hidden"}`} color="transparent">
				<Container maxWidth="xl">
					<Toolbar disableGutters className="nav-container">
						<Box className="navbar-start-display">
							{hamMenu && (
								<Box>
									<IconButton
										className="nav-menu-icon"
										onClick={isLoggedIn ? handleLeftDrawerToggle : handleDrawerToggle}
									>
										<TocTwoToneIcon />
									</IconButton>
								</Box>
							)}
							{/* Logo */}
							<Box>
								<Link to="/" className="logo-link">
									<img src="/assets/svgs/ezLogo.svg" alt="logo" height={20} />
								</Link>
							</Box>
							{isSmallScreen && (
								<Box className="notification-nav-end">
									<IconButton onClick={toggleNotfication}>
										<img src="/assets/svgs/navbar/notification.svg" alt="notification" />
									</IconButton>
								</Box>
							)}
						</Box>

						{/* Center: Navigation Links */}
						{!isSmallScreen && (
							<Box className="nav-links">
								{navItems.map((item) => (
									<Link
										to={path[item]}
										key={item}
										className={`nav-item ${location.pathname === path[item] ? "nav-active" : ""}`}
									>
										{item}
									</Link>
								))}
							</Box>
						)}

						{/* Right-side Buttons */}
						{!isSmallScreen && (
							<Box className="nav-buttons">
								{isLoggedIn ? (
									<Box className="login-details-box">
										<IconButton onClick={toggleNotfication}>
											<img src="/assets/svgs/navbar/notification.svg" alt="notification" />
										</IconButton>
										{/* <Avatar variant="rounded" className="user-avatar capitalize" onClick={handleLeftDrawerToggle}>
										{user?.name[0]}
									</Avatar> */}
									</Box>
								) : (
									<>
										<Link to="/login">
											<Button variant="outlined" className="login-btn">
												Login →
											</Button>
										</Link>
										<Link to="/register">
											<Button variant="contained" className="get-started-btn">
												Get Started →
											</Button>
										</Link>
									</>
								)}
							</Box>
						)}
					</Toolbar>
				</Container>

				{/* Left Drawer */}
				{isLoggedIn && (
					<Drawer anchor="left" open={leftDrawerOpen} onClose={handleLeftDrawerToggle}>
						<Account closeDrawer={handleLeftDrawerToggle} />
					</Drawer>
				)}

				{/* Mobile Drawer */}
				<Drawer anchor="top" open={mobileOpen} onClose={handleDrawerToggle} className="mobile-drawer">
					<Box className="mobile-drawer-content">
						<Box className="drawer-header">
							<img src="/assets/svgs/ezLogo.svg" alt="logo" height={20} />
							<IconButton onClick={handleDrawerToggle} className="drawer-close">
								<CloseIcon />
							</IconButton>
						</Box>
						<Divider />

						<List className="mobile-menu">
							{navItems.map((item) => (
								<Link
									to={path[item]}
									key={item}
									className={`mobile-menu-item ${location.pathname === path[item] ? "nav-active" : ""}`}
								>
									<ListItem button onClick={handleDrawerToggle}>
										<ListItemText primary={item} />
										<ArrowForwardIosIcon />
									</ListItem>
								</Link>
							))}
							<Box className="nav-mobile-buttons">
								{isLoggedIn ? (
									<Box className="login-mobile-details-box" onClick={handleDrawerToggle}>
										<Button variant="outline" onClick={toggleNotfication} className="mobile-notification-button">
											{/* <Box className="mobile-notification-icons"> */}
											<img src="/assets/svgs/navbar/notification.svg" alt="notification" />
											<Typography variant="" ml="10px">
												Notification
											</Typography>
											{/* </Box> */}
											<ArrowForwardIosIcon />
										</Button>
										{/* <Avatar variant="square" className="user-avatar" onClick={() => navigate("/user/profile/account")}>
									User
								</Avatar> */}
									</Box>
								) : (
									<>
										<Link to="/login">
											<Button variant="outlined" className="login-mobile-btn">
												<span>Login</span>
												<span> →</span>
											</Button>
										</Link>
										<Link to="/register">
											<Button variant="contained" className="get-started-mobile-btn">
												<span>Get Started</span>
												<span> →</span>
											</Button>
										</Link>
									</>
								)}
							</Box>
						</List>
					</Box>
				</Drawer>

				<div className="nav-spacer"></div>
				<NotificationDrawer showNotification={showNotification} hideNotification={toggleNotfication} />
			</AppBar>
		</Box>
	);
};

export default Navbar;
