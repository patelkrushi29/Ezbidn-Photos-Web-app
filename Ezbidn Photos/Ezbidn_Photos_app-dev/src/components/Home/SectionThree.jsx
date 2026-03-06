import React from "react";
import { Box, Button, Typography } from "@mui/material";
import bgImage from "/assets/svgs/home/deliveredBg.svg";
import "./home.css"; // Import external CSS
import { fontSizesMUI } from "../../utils/muiFonts";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SectionThree = () => {
	const { isLoggedIn } = useSelector((state) => state.auth);
	return (
		<Box
			className="sec-three-section"
			style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
		>
			{/* Content */}
			<Box className="sec-three-content">
				<Box>
					<Typography variant="subtitle1" className="sec-three-subtitle" sx={{ fontSize: fontSizesMUI.subtitle1 }}>
						— We Delivered
					</Typography>

					<Typography variant="h3" className="sec-three-title" sx={{ fontSize: fontSizesMUI.h3 }}>
						Over <span className="highlight">20 Million</span> Moments
						<br /> Shared through Photos
					</Typography>
				</Box>

				{/* CTA Button */}
				<Box className="sec-three-button-container">
					{!isLoggedIn && (
						<Link to="/register">
							<Button variant="contained" className="sec-three-button">
								Get Started →
							</Button>
						</Link>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default SectionThree;
