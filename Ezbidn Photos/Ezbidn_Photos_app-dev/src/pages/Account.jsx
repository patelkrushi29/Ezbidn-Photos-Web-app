import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AccountLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const backHandle = () => {
		navigate(-1);
	};
	const backDisabled = () =>
		["/user/account/order-confirmed", "/user/account/order-failed"].includes(location.pathname);

	return (
		<Box
			sx={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				backgroundImage: "linear-gradient(to bottom, #ffffff, #fef8f3)",
				padding: "2rem",
				borderRadius: "10px",
				width: "80%",
				maxWidth: "800px",
				margin: "5rem auto",
				minHeight: "50vh",
				boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
			}}
		>
			{!backDisabled && (
				<IconButton
					onClick={backHandle}
					sx={{
						position: "absolute",
						top: { md: "2rem", sm: "16px", xs: "8px" },
						left: { md: "2rem", sm: "16px", xs: "8px" },
						backgroundColor: "white",
						boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
						borderRadius: "10px",
					}}
				>
					<ArrowBackIcon />
				</IconButton>
			)}
			<Outlet />
		</Box>
	);
};

export default AccountLayout;
