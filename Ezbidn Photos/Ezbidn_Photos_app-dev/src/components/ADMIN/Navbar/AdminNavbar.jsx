import { useState, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	IconButton,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Container,
	useMediaQuery,
	Avatar,
	Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const AdminNavbar = () => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [showAdminNavbar, setShowAdminNavbar] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const isSmallScreen = useMediaQuery("(max-width:900px)");
	const { isLoggedIn } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	useEffect(() => {
		const handleScroll = () => {
			setShowAdminNavbar(window.scrollY < lastScrollY || window.scrollY < 50);
			setLastScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	const location = useLocation();

	// const navItems = ["Dashboard", "Users", "Pricing", "Messages", "Orders"];
	const navItems = ["Users", "Pricing", "Messages", "Orders"];
	const path = {
		// Dashboard: "/admin",
		Users: "/admin",
		// Users: "/admin/users",
		Orders: "/admin/orders",
		Pricing: "/admin/pricing",
		Messages: "/admin/messages",
		Setting: "/admin/setting",
	};

	return (
		<AppBar
			position="fixed"
			className={`admin-Adminnavbar ${showAdminNavbar ? "admin-visible" : "admin-hidden"}`}
			color="transparent"
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters className="admin-nav-container">
					<Box className="admin-Adminnavbar-start-display">
						<Link to="/admin" className="admin-logo-link">
							<img src="/assets/svgs/ezLogo.svg" alt="logo" height={20} />
						</Link>
					</Box>

					<Box className="admin-nav-links">
						{navItems.map((item) => {
							if (!isLoggedIn && item === "Subscription") {
								return <></>;
							}
							return (
								<Link
									to={path[item]}
									key={"path" + item}
									className={`admin-nav-item ${location.pathname === path[item] ? "admin-nav-active" : ""}`}
								>
									{item}
								</Link>
							);
						})}
					</Box>
					{!isSmallScreen && (
						<Box className="admin-login-details-box">
							<Avatar variant="rounded" className="admin-user-avatar" onClick={() => navigate("/admin/setting")}>
								Admin
							</Avatar>
						</Box>
					)}

					{isSmallScreen && (
						<IconButton className="admin-menu-icon" onClick={handleDrawerToggle}>
							<MenuIcon />
						</IconButton>
					)}
				</Toolbar>
			</Container>

			<Drawer anchor="top" open={mobileOpen} onClose={handleDrawerToggle} className="admin-mobile-drawer">
				<Box className="admin-mobile-drawer-content">
					<Box className="admin-drawer-header">
						<img src="/assets/svgs/ezLogo.svg" alt="logo" height={20} />
						<IconButton onClick={handleDrawerToggle} className="admin-drawer-close">
							<CloseIcon />
						</IconButton>
					</Box>
					<Divider />

					<List className="admin-mobile-menu">
						{navItems.map((item) => (
							<Link to={path[item]} key={item} className="admin-mobile-menu-item">
								<ListItem
									button
									onClick={handleDrawerToggle}
									className={` ${location.pathname === path[item] ? "admin-nav-active" : ""}`}
								>
									<ListItemText primary={item} />
									<ArrowForwardIosIcon />
								</ListItem>
							</Link>
						))}
					</List>
				</Box>
			</Drawer>
		</AppBar>
	);
};

export default AdminNavbar;
