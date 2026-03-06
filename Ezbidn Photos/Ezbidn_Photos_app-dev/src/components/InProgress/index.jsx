import React from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import SendIcon from "@mui/icons-material/Send";

const UnderConstruction = () => {
	return (
		<Box
			className="under-construction-container"
			sx={{
				minHeight: "50vh",
				height: "100%",
				background: "linear-gradient(to bottom, #a8c0ff, #3f2b96)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				overflow: "hidden",
				position: "relative",
			}}
		>
			{/* Floating Clouds */}
			<CloudQueueIcon
				className="cloud-left"
				sx={{
					fontSize: { xs: 40, sm: 60, md: 80 },
					color: "#fff",
					position: "absolute",
					top: "20%",
					left: "10%",
					animation: "moveLeft 15s linear infinite",
				}}
			/>
			<CloudQueueIcon
				className="cloud-right"
				sx={{
					fontSize: { xs: 40, sm: 60, md: 80 },
					color: "#fff",
					position: "absolute",
					top: "30%",
					right: "10%",
					animation: "moveRight 12s linear infinite",
				}}
			/>

			{/* Header */}
			<Typography
				variant="h3"
				className="coming-soon-title"
				sx={{
					fontFamily: "'Pacifico', cursive",
					color: "#fff",
					mb: 2,
					textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
				}}
			>
				Coming Soon
			</Typography>

			{/* Floating Icon Animation */}
			<Box
				className="hot-air-balloon"
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#ff6f61",
					width: { xs: 70, sm: 90, md: 120 },
					height: { xs: 70, sm: 90, md: 120 },
					borderRadius: "50%",
					boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
					animation: "float 3s ease-in-out infinite",
				}}
			>
				<FlightTakeoffIcon
					sx={{
						fontSize: { xs: 40, sm: 60, md: 80 },
						color: "#fff",
					}}
				/>
			</Box>

			{/* Subheading */}
			<Typography
				variant="h5"
				className="website-under-construction"
				sx={{
					fontFamily: "'Quicksand', sans-serif",
					color: "#fff",
					mt: 2,
					mb: 4,
					textShadow: "1px 1px 8px rgba(0,0,0,0.3)",
				}}
			>
				Website under construction
			</Typography>

			{/* Email Subscription */}

			{/* Footer */}
			{/* <Typography
				variant="body2"
				className="notify-text"
				sx={{
					color: "#fff",
					mt: 2,
					fontStyle: "italic",
				}}
			>
				Notify me when it’s ready
			</Typography> */}

			{/* Animations */}
			<style>
				{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }

          @keyframes moveLeft {
            0% { transform: translateX(0); }
            50% { transform: translateX(-30px); }
            100% { transform: translateX(0); }
          }

          @keyframes moveRight {
            0% { transform: translateX(0); }
            50% { transform: translateX(30px); }
            100% { transform: translateX(0); }
          }
        `}
			</style>
		</Box>
	);
};

export default UnderConstruction;
