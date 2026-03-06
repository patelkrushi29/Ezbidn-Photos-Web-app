import { Button, Typography, Container, Box } from "@mui/material";
import "./home.css";
import bgImage from "/assets/png/home/topBg2.png";
import { fontSizesMUI } from "../../utils/muiFonts";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SectionOne = () => {
	const { isLoggedIn } = useSelector((state) => state.auth);

	return (
		<div
			className="hero-section "
			// style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: "center, bottom" }}
		>
			<div className=" hero-background-img"></div>
			<div className="sec-one-text-side">
				<Container className="text-container">
					<Typography
						variant="h4"
						className="home-highlight-text"
						sx={{
							fontSize: fontSizesMUI.h4,
						}}
					>
						Send Love in a Photo
					</Typography>
					<Typography
						variant="h1"
						className="main-heading"
						sx={{
							fontSize: fontSizesMUI.h1,
						}}
					>
						Deliver Photos <br /> to Any Inmate
					</Typography>
					<Typography
						variant="body1"
						className="sub-text"
						sx={{
							fontSize: fontSizesMUI.body1,
						}}
					>
						Life moves fast, but your loved ones matter most. Take a moment today to reconnect, share a smile, and
						strengthen your bond.
					</Typography>
					{!isLoggedIn && (
						<Link to="/register">
							<Button variant="contained" className="cta-button">
								Get Started →
							</Button>
						</Link>
					)}
				</Container>
			</div>
			{/* <div className="image-side">
					<Box className="image-container" />
				</div> */}
		</div>
	);
};

export default SectionOne;
