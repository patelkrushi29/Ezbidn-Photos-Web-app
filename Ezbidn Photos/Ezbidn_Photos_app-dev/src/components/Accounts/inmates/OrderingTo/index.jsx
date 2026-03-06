import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FacilityRulesModal from "../Rules";
import apiHandler from "../../../../utils/API/api";
import apiConfig from "../../../../utils/API/apiConfig";
import "./fedralinmate.css";
import Loader from "../../../../utils/Loader/loader";

const OrderingToList = () => {
	const [showForm, setShowForm] = useState(false);
	const [inmateDetails, setInmateDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleSendTo = () =>
		navigate("/user/profile/subscription", { state: { inmateId: location.state?.inmateId || 0 } });

	let inmateId = location.state?.inmateId;

	useEffect(() => {
		const fetchInmate = async () => {
			try {
				setIsLoading(true);
				const response = await apiHandler.get(apiConfig.user.getInmateDetailById.url, { id: inmateId });

				if (response?.status) {
					setInmateDetails(response.data);
				}
			} catch (e) {
				console.error(e);
				navigate("/user/account/add-inmates");
			} finally {
				setIsLoading(false);
			}
		};

		if (inmateId) {
			fetchInmate();
		} else {
			navigate("/user/account/add-inmates");
		}
	}, [inmateId, navigate]);

	const getReleaseDate = () => {
		const { projRelDate, actRelDate, releaseCode } = inmateDetails?.inamteProfile || {};
		if (projRelDate) {
			return <>Release Date: {projRelDate}</>;
		} else if (releaseCode?.toLowerCase() === "d") {
			return <>Deceased: {actRelDate}</>;
		} else if (releaseCode?.toLowerCase() === "r" || actRelDate) {
			return <>Release Date: {actRelDate}</>;
		}
	};

	return (
		<Box className="inmate-selection">
			<Box className="inmate-list">
				<Typography variant="h4" className="title">
					Send Photos to
				</Typography>
				<Typography className="subtitle">Choose the inmate or add a new one to send photos.</Typography>

				{/* Inmate Card */}

				<Paper elevation={3} className="inmate-card">
					{isLoading ? (
						<Loader position="center" overlay={false} />
					) : (
						<>
							<Typography className="inmate-name">
								{inmateDetails?.inamteProfile?.nameFirst && <span>{inmateDetails.inamteProfile.nameFirst} </span>}
								{inmateDetails?.inamteProfile?.nameMiddle && <span>{inmateDetails.inamteProfile.nameMiddle} </span>}
								{inmateDetails?.inamteProfile?.nameLast && <span>{inmateDetails.inamteProfile.nameLast}</span>}
							</Typography>

							{/* <Typography className="inmate-details">
						{inmateDetails?.inmateLocation?.nameTitle || "Facility not available"}
					</Typography> */}
							<Box sx={{ display: "flex" }}>
								{inmateDetails?.inamteProfile?.sex && (
									<Typography variant="body2" className="inmate-sex">
										<b>Sex:</b> {inmateDetails?.inamteProfile?.sex || "N/A"}
									</Typography>
								)}
								{inmateDetails?.inamteProfile?.age && (
									<Typography variant="body2" className="inmate-age" ml={10}>
										<b>Age:</b> {inmateDetails?.inamteProfile?.age || "N/A"}
									</Typography>
								)}
							</Box>

							<Typography className="inmate-details">
								Register Number: <span className="inmate-id">{inmateDetails?.inamteProfile?.inmateNum}</span>
							</Typography>

							{inmateDetails?.inmateLocation?.city && inmateDetails?.inmateLocation?.state && (
								<Typography className="inmate-details">
									Location: {inmateDetails.inmateLocation.city}, {inmateDetails.inmateLocation.state}
								</Typography>
							)}

							<Typography className="inmate-details"> {getReleaseDate()}</Typography>
						</>
					)}
				</Paper>

				<Box className="button-container">
					<Button variant="contained" className="submit-btn" onClick={() => setShowForm(true)}>
						Next →
					</Button>
					{/* <Button variant="outlined" className="add-inmate-btn" onClick={handleAddInmate}>
						Add New Inmate →
					</Button> */}
				</Box>
			</Box>

			<FacilityRulesModal open={showForm} onClose={() => setShowForm(false)} onConfirm={handleSendTo} />
		</Box>
	);
};

export default OrderingToList;
