import React, { useState, useEffect } from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, useNavigate } from "react-router-dom";
import "./breadcrumb.css";
import { fontSizesMUI } from "../../utils/muiFonts";

const breadcrumbMap = {
	"/": [{ label: "HOME", link: "/" }],
	"/user/how-it-work": [{ label: "HOW IT WORKS", link: "/user/how-it-work" }],
	"/user/about": [{ label: "ABOUT US", link: "/user/about" }],
	"/user/faq": [{ label: "FAQ", link: "/user/faq" }],
	"/user/contact": [{ label: "CONTACT US", link: "/user/contact" }],
	"/user/privacy": [{ label: "PRIVACY POLICY", link: "/user/privacy" }],
	"/user/refund": [{ label: "REFUND POLICY", link: "/user/refund" }],
	"/user/terms": [{ label: "TERMS & CONDITIONS", link: "/user/terms" }],
	"/user/profile/account": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "ACCOUNT", link: "/user/profile/account" },
	],
	"/user/profile/orders": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "ORDERS", link: "/user/profile/orders" },
	],
	"/user/profile/subscription": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "PLANS", link: "/user/profile/subscription" },
	],
	"/user/profile/payments": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "PAYMENT METHOD", link: "/user/profile/payments" },
	],
	"/user/profile/inmates": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "INMATES", link: "/user/profile/inmates" },
	],
	"/user/account/add-inmates": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "ADD INMATE", link: "/user/account/add-inmates" },
	],
	"/user/account/send-to-inmates": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "SEND TO", link: "/user/account/send-to-inmates" },
	],
	"/user/account/fedral-inmates": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "FEDERAL INMATE", link: "/user/account/fedral-inmates" },
	],
	"/user/account/state-inmates": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "STATE INMATE", link: "/user/account/state-inmates" },
	],
	"/user/account/upload-photo": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "UPLOAD PHOTO", link: "/user/account/upload-photo" },
	],
	"/user/account/shipping-info": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "SHIPPING INFO", link: "/user/account/shipping-info" },
	],
	"/user/account/order-confirmed": [
		{ label: "MY ACCOUNT", link: "/user/profile/account" },
		{ label: "ORDER CONFIRMED", link: "/user/account/order-confirmed" },
	],
	"/login": [{ label: "LOGIN", link: "/login" }],
	"/register": [{ label: "REGISTER", link: "/register" }],
	"/forgot-password": [{ label: "FORGOT PASSWORD", link: "/forgot-password" }],
	"/otp-verify": [{ label: "OTP VERIFY", link: "/otp-verify" }],
	"/confirm-password": [{ label: "CONFIRM PASSWORD", link: "/confirm-password" }],
};

const EzBreadcrumbs = () => {
	const [lastScrollYbread, setLastScrollYbread] = useState(0);

	const location = useLocation();
	const navigate = useNavigate();

	const pathnames = location.pathname.split("/").filter((x) => x);
	const breadcrumbList = [];

	useEffect(() => {
		const handleScroll = () => {
			setLastScrollYbread(window.scrollYbread);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollYbread]);

	let currentPath = "";
	pathnames.forEach((path) => {
		currentPath += `/${path}`;
		if (breadcrumbMap[currentPath]) {
			breadcrumbList.push(...breadcrumbMap[currentPath]);
		}
	});

	return (
		<Box className={`breadcrumb-container breadcrumb-container-height-lg`}>
			<Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-item">
				{/* Home Icon */}
				<Link className="breadcrumb-link" onClick={() => navigate("/")}>
					<Typography variant="body1" sx={{ fontSize: fontSizesMUI.body1 }} className="breadcrumbs-home-button">
						<HomeIcon fontSize="small" /> HOME
					</Typography>
				</Link>

				{/* Breadcrumbs from JSON */}
				{breadcrumbList.map((breadcrumb, index) => {
					const isLast = index === breadcrumbList.length - 1;
					return isLast ? (
						<Typography
							key={breadcrumb.link}
							className="breadcrumb-text"
							variant="body1"
							sx={{ fontSize: fontSizesMUI.body1 }}
						>
							{breadcrumb.label}
						</Typography>
					) : (
						<Link key={breadcrumb.link} className="breadcrumb-link" onClick={() => navigate(breadcrumb.link)}>
							<Typography variant="body1" sx={{ fontSize: fontSizesMUI.body1 }}>
								{breadcrumb.label}
							</Typography>
						</Link>
					);
				})}
			</Breadcrumbs>
		</Box>
	);
};

export default EzBreadcrumbs;
