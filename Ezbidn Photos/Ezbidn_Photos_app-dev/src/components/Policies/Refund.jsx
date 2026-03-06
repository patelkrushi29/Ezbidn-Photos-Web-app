import React from "react";
import { Box, Typography } from "@mui/material";
import "./policies.css"; // External CSS file

const RefundPolicy = () => {
	return (
		<Box className="privacy-container">
			<Typography variant="h4" className="privacy-title">
				Refund Policy
			</Typography>
			<Typography variant="h6" className="privacy-subtitle">
				Cancellations/Modifications
			</Typography>
			<Typography variant="body1" className="privacy-text">
				It is a long established fact that a reader will be distracted by the readable content of a page when looking at
				its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
				opposed to using 'Content here, content here', making it look like readable English.
			</Typography>
			<Typography variant="body1" className="privacy-text">
				There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
				some form, by injected humour, or randomised words which don't look even slightly believable. If you are going
				to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of
				text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this
				the first true generator on the Internet. It uses a dictionary of over 200 Latin words
			</Typography>
			<Typography variant="body1" className="privacy-text">
				It is a long established fact that a reader will be distracted by the readable content of a page when looking at
				its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
				opposed to using 'Content here, content here', making it look like readable English.
			</Typography>

			<Typography variant="h6" className="privacy-subtitle">
				Damaged Photos{" "}
			</Typography>
			<Typography variant="body1" className="privacy-text">
				There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
				some form, by injected humour, or randomised words which don't look even slightly believable. If you are going
				to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of
				text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this
				the first true generator on the Internet. It uses a dictionary of over 200 Latin words
			</Typography>
			<Typography variant="body1" className="privacy-text">
				It is a long established fact that a reader will be distracted by the readable content of a page when looking at
				its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
				opposed to using 'Content here, content here', making it look like readable English.
			</Typography>
		</Box>
	);
};

export default RefundPolicy;
