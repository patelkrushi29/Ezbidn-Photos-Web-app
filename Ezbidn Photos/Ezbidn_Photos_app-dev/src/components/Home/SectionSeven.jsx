import React from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import "./home.css";
import { fontSizesMUI } from "../../utils/muiFonts";
// import GooglePlayIcon from "./assets/google-play.png"; // Replace with actual path
// import AppleStoreIcon from "./assets/apple-store.png"; // Replace with actual path
// import MobileImage from ""; // Replace with actual path

const SectionSeven = () => {
	const isSmallScreen = useMediaQuery("(max-width:768px)");

	return (
		<Box className="download-sub-container">
			<Box className="download-container">
				{/* Left Section */}
				<Box className="text-section">
					<Typography variant="h4" className="title" sx={{ fontSize: fontSizesMUI.h4 }}>
						Download ezbidn app
					</Typography>
					<Typography variant="body1" className="description" sx={{ fontSize: fontSizesMUI.body1 }}>
						Download the app now to easily send photos and postcards to your loved ones. Stay connected with just a few
						taps!
					</Typography>

					{/* Download Buttons */}
					<Box className="button-group">
						<Button className="download-button" href="#">
							<img src="/assets/svgs/googlePlay.svg" alt="Google Play" className="app-download-icon" />
							<Box>
								<Typography variant="caption" sx={{ fontSize: fontSizesMUI.caption }}>
									Get it on
								</Typography>
								<Typography variant="body1" sx={{ fontSize: fontSizesMUI.body1 }}>
									<b>Google Play</b>
								</Typography>
							</Box>
						</Button>
						<Button className="download-button" href="#">
							<img src="/assets/svgs/appleIcon.svg" alt="Apple Store" className="app-download-icon" />
							<Box>
								<Typography variant="caption" sx={{ fontSize: fontSizesMUI.caption }}>
									Download on the
								</Typography>
								<Typography variant="body1" sx={{ fontSize: fontSizesMUI.body1 }}>
									<b> Apple Store</b>
								</Typography>
							</Box>
						</Button>
					</Box>
				</Box>

				{/* Right Section (Mobile Image) */}
				{!isSmallScreen && (
					<Box className="download-image-section">
						<img src={"assets/svgs/mobileIcon.svg"} alt="Ezbidn Mobile App" className="mobile-image" />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default SectionSeven;
