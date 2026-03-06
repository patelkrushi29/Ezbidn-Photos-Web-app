import React from "react";
import { Box, Typography } from "@mui/material";
import "./policies.css"; // External CSS file

const TermsConditions = () => {
	return (
		<Box className="privacy-container">
			<Typography variant="h4" className="privacy-title">
				Terms & Conditions
			</Typography>

			<Typography variant="h6" className="privacy-subtitle">
				Basic Terms
			</Typography>
			<Typography variant="body1" className="privacy-text">
				It is a long established fact that a reader will be distracted by the readable content of a page when looking at
				its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
				opposed to using 'Content here, content here', making it look like readable English.
			</Typography>
			<Typography variant="h6" className="privacy-subtitle">
				Our Services
			</Typography>
			<Typography variant="body1" className="privacy-text">
				There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
				some form, by injected humour, or randomised words which don't look even slightly believable. If you are going
				to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of
				text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this
				the first true generator on the Internet. It uses a dictionary of over 200 Latin words
			</Typography>
			<Typography variant="body1" className="privacy-text">
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
				standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
				a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
				remaining essentially unchanged. It was popularised in the 1960s
			</Typography>
			<Typography variant="h6" className="privacy-subtitle">
				Intellectual Property Rights
			</Typography>

			<Typography variant="body1" className="privacy-text">
				It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
				unchanged. It was popularized in the 1960s with the release of Letterset sheets containing Lorem Ipsum passages,
				and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
			</Typography>
		</Box>
	);
};

export default TermsConditions;
