import React from "react";
import { Box, Skeleton } from "@mui/material";

const LoadingScreen = ({ width = "100%", height = "100vh", numRows = 4 }) => {
	// Generate random widths for skeleton rows
	const getRandomWidth = () => `${Math.floor(Math.random() * (90 - 60 + 1) + 60)}%`;

	return (
		<Box
			sx={{
				width: width,
				height: height,
				display: "flex",
				flexDirection: "column",
				gap: 2,
				justifyContent: "center",
				alignItems: "center",
				padding: 2,
			}}
		>
			{Array.from({ length: numRows }).map((_, index) => (
				<Skeleton
					key={"array" + index}
					variant="rectangular"
					width={getRandomWidth()}
					height={20}
					animation="wave"
					sx={{
						borderRadius: "8px",
					}}
				/>
			))}
		</Box>
	);
};

export default LoadingScreen;
