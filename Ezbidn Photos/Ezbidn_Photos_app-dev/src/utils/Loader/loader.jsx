import React from "react";
import { Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const Loader = ({ position = "center", overlay = true, size = 60 }) => {
	const getPositionStyle = () => {
		switch (position) {
			case "top":
				return { justifyContent: "flex-start", alignItems: "center" };
			case "bottom":
				return { justifyContent: "flex-end", alignItems: "center" };
			case "left":
				return { justifyContent: "center", alignItems: "flex-start" };
			case "right":
				return { justifyContent: "center", alignItems: "flex-end" };
			case "center":
			default:
				return { justifyContent: "center", alignItems: "center" };
		}
	};

	return (
		<Box
			sx={{
				position: overlay ? "absolute" : "relative",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 9999,
				display: "flex",
				backgroundColor: overlay ? "rgba(255,255,255,0.6)" : "transparent",
				backdropFilter: overlay ? "blur(3px)" : "none",
				...getPositionStyle(),
			}}
		>
			<CircularProgress size={size} color="primary" sx={{ padding: "1rem" }} />
		</Box>
	);
};

Loader.propTypes = {
	position: PropTypes.oneOf(["top", "bottom", "left", "right", "center"]),
	overlay: PropTypes.bool,
	size: PropTypes.number,
};

export default Loader;
