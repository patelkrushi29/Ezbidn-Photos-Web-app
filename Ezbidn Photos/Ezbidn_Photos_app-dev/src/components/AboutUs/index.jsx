import React from "react";
import "./about.css";
import { Typography, Container, Box } from "@mui/material";
import { fontSizesMUI } from "../../utils/muiFonts";

const AboutUs = () => {
	return (
		<Container className="about-us-container">
			<Box className="about-us-content">
				<Typography variant="h4" className="about-head-title" sx={{ fontSize: fontSizesMUI.h4 }}>
					About Us
				</Typography>
				<Typography variant="h6" className="about-head-subtitle" sx={{ fontSize: fontSizesMUI.h6 }}>
					Our Vision
				</Typography>
				<Typography variant="body1" className="about-text" sx={{ fontSize: fontSizesMUI.body1 }}>
					It is a long established fact that a reader will be distracted by the readable content of a page when looking
					at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,
					making it look like readable English.
				</Typography>

				<Box className="about-image-container">
					<img src="/assets/png/about/aboutus.png" alt="About Us" className="about-image" />
				</Box>

				<Typography variant="body1" className="about-text" sx={{ fontSize: fontSizesMUI.body1 }}>
					There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
					some form, by injected humour, or randomised words which don’t look even slightly believable.
				</Typography>
			</Box>
		</Container>
	);
};

export default AboutUs;
