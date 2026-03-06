import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import "./footer.css";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Footer = () => {
	const { isLoggedIn } = useSelector((state) => state.auth);
	return (
		<footer className="custom-footer">
			<Box className="footer-container">
				<Stack
					direction="row"
					flexWrap="wrap"
					spacing={3}
					justifyContent={{ xs: "center", sm: "space-between" }}
					className="footer-stack"
				>
					<div className="footer-section brand-section">
						<Link to="/">
							<img src="/assets/svgs/logoWhite.svg" alt="ezbidn" height={"20px"} />
						</Link>
						<Typography variant="body2" className="brand-text">
							It is a long established fact that a reader will be distracted by the readable content of a page when
							looking at its layout.
						</Typography>
						<div className="social-icons">
							<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
								<Facebook className="icon" />
							</a>
							<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
								<Instagram className="icon" />
							</a>
							<a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
								<Twitter className="icon" />
							</a>
							<a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
								<LinkedIn className="icon" />
							</a>
						</div>
					</div>

					<div className="footer-section contact-section">
						<Typography variant="h6">Contact</Typography>
						<a href="tel:+16291230123">
							<Typography variant="body2">(629) 123-0123</Typography>
						</a>
						<a href="mailto:info@example.com">
							<Typography variant="body2">info@example.com</Typography>
						</a>
						<Typography variant="body2">1234 Elgin St.</Typography>
						<Typography variant="body2">California, 10299</Typography>
					</div>

					<div className="footer-section links-section">
						<Typography variant="h6">Quick Links</Typography>
						{isLoggedIn && (
							<Link to="/user/profile/inmates">
								<Typography variant="body2">Inmates</Typography>
							</Link>
						)}
						<Link to="/user/faq">
							<Typography variant="body2">FAQ</Typography>
						</Link>
						<Link to="/user/profile/subscription">
							<Typography variant="body2">Plans</Typography>
						</Link>
						<Link to="/user/about">
							<Typography variant="body2">About Us</Typography>
						</Link>
					</div>

					<div className="footer-section links-section">
						<Typography variant="h6">Other Links</Typography>
						<Link to="/user/terms">
							<Typography variant="body2">Terms and Conditions</Typography>
						</Link>
						<Link to="/user/privacy">
							<Typography variant="body2">Privacy Policy</Typography>
						</Link>
						<Link to="/user/refund">
							<Typography variant="body2">Refund Policy</Typography>
						</Link>
						<Link to="/user/contact">
							<Typography variant="body2">Support Center</Typography>
						</Link>
					</div>
				</Stack>

				<Divider sx={{ marginY: 2 }} />
			</Box>
			<Typography variant="body2" className="footer-bottom">
				&copy;ezbidn2025 All Rights Reserved
			</Typography>
		</footer>
	);
};

export default Footer;
