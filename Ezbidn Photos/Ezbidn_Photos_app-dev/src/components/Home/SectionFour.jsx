import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import "./home.css"; // External CSS file
import { fontSizesMUI } from "../../utils/muiFonts";

const SectionFour = () => {
	const isSmallScreen = useMediaQuery("(max-width:768px)");

	return (
		<Box className="home-about-container">
			<Box className="home-about-content">
				{/* Left Content - Text and Button */}
				<Box className="about-text">
					<Typography variant="h6" className="about-subtitle" sx={{ fontSize: fontSizesMUI.h6 }}>
						— About Us
					</Typography>
					<Typography variant="h3" className="about-title" sx={{ fontSize: fontSizesMUI.h3 }}>
						We Understand that a Simple Photo can mean the World to Someone in Prison.
					</Typography>
					<Typography variant="body1" className="about-description" sx={{ fontSize: fontSizesMUI.body1 }}>
						We make it easy to send good-quality postcards to your loved ones because a single photo can bring joy,
						comfort, and connection to someone in prison. We understand its importance and make it easy for you to send
						meaningful moments to your loved one.
					</Typography>

					{isSmallScreen && (
						<Box className="about-small-images">
							{/* <Box className="home-image-container"> */}
							<img src="/assets/png/home/aboutUs.png" alt="Inmate holding photo" className="home-small-main-image" />
							{/* </Box> */}
						</Box>
					)}
					<Box className="about-stats">
						<Box className="stat-card">
							<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }}>
								20M+
							</Typography>
							<Typography variant="body2" sx={{ fontSize: fontSizesMUI.body2 }}>
								Postcards Shared
							</Typography>
						</Box>
						<Box className="stat-card">
							<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }}>
								10+
							</Typography>
							<Typography variant="body2" sx={{ fontSize: fontSizesMUI.body2 }}>
								Years of Experience
							</Typography>
						</Box>
					</Box>
				</Box>

				{/* Right Content - Images */}
				{!isSmallScreen && (
					<Box className="about-images">
						<Box className="home-image-container">
							<img src="/assets/png/home/aboutUs.png" alt="Inmate holding photo" className="home-main-image" />
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default SectionFour;
