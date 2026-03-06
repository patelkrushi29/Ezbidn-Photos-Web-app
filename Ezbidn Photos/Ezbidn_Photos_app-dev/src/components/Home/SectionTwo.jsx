import React from "react";
import "./home.css";
import { Box, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image"; // Upload Icon
import PrintIcon from "@mui/icons-material/Print"; // Print Icon
import LocalShippingIcon from "@mui/icons-material/LocalShipping"; // Delivery Icon
import { fontSizesMUI } from "../../utils/muiFonts";

const steps = [
	{
		id: 1,
		icon: <ImageIcon className="step-icon" />,
		title: "Choose & Upload Photos",
		description:
			"Select your favorite photos and upload them with ease. Share special moments with your loved ones in just a few clicks!",
	},
	{
		id: 2,
		icon: <PrintIcon className="step-icon" />,
		title: "We Print & Ship For You",
		description:
			"Let us handle the hassle while you share special moments with your loved ones—quick, easy, and delivered with care.",
	},
	{
		id: 3,
		icon: <LocalShippingIcon className="step-icon" />,
		title: "Delivered to Your Loved One",
		description: "All photos are reviewed by facility staff, and approved photos will be delivered to your loved one.",
	},
];

const WorkFlow = () => {
	return (
		<Box className="how-it-works">
			{/* HEADER SECTION */}
			<Box className="header-section">
				<Box className="header-line" />
				<Typography variant="h6" className="sub-heading" sx={{ fontSize: fontSizesMUI.h6 }}>
					How It Works
				</Typography>
				<Box className="header-line" />
			</Box>

			<Typography variant="h4" className="sec-two-main-heading" sx={{ fontSize: fontSizesMUI.h4 }}>
				Send Photos to Inmates with Ease
			</Typography>

			{/* STEPS SECTION */}
			<Box className="steps-container">
				{steps.map((step, index) => (
					<Box key={step.id} className="step-card">
						<Box className="sec-two-icon-container">{step.icon}</Box>
						<Typography variant="h6" className="step-title" sx={{ fontSize: fontSizesMUI.h6 }}>
							{step.title}
						</Typography>
						<Typography variant="body2" className="step-description" sx={{ fontSize: fontSizesMUI.body2 }}>
							{step.description}
						</Typography>
						{index === 0 && <img src="/assets/svgs/curveline.svg" alt="Arrow" className="curve-arrow-zero" />}
						{index === 1 && <img src="/assets/svgs/curveLineDown.svg" alt="Arrow" className="curve-arrow-one" />}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default WorkFlow;
