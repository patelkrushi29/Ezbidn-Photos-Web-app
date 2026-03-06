import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
	return (
		<Box sx={{ maxWidth: "100vw" }}>
			<Outlet /> {/* This will load the routed component dynamically */}
		</Box>
	);
};

export default ProfileLayout;
