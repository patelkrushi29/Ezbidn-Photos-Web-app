import React from "react";
import { Box, Typography } from "@mui/material";
import "./login.css"; // External CSS for responsiveness

const ImageSection = () => {
	return (
		<Box className="image-section">
			{/* Left Large Image */}
			<img src="/assets/png/login/loginPage.png" alt="login" />
		</Box>
	);
};

export default ImageSection;
