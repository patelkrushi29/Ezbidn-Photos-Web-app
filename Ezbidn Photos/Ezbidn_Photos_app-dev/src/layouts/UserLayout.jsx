import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomeLayout = () => {
	const location = useLocation();
	const hideNavbarRoutes = [
		"/login",
		"/register",
		"/forgot-password",
		"/otp-verify",
		"/confirm-password",
		"/guest-user",
	];
	const hideFooterRoutes = [
		"/login",
		"/register",
		"/forgot-password",
		"/otp-verify",
		"/confirm-password",
		"/guest-user",
	];

	const shouldDisplayNavbar = !hideNavbarRoutes.includes(location?.pathname);
	const shouldDisplayFooter = !hideFooterRoutes.includes(location?.pathname);

	return (
		<Box sx={{ maxWidth: "100vw", minHeight: "100vh" }} className="flex flex-col min-h-screen">
			{shouldDisplayNavbar && <Navbar />}
			<main className="flex-grow">
				<Outlet />
			</main>
			{shouldDisplayFooter && <Footer />}
		</Box>
	);
};

export default HomeLayout;
