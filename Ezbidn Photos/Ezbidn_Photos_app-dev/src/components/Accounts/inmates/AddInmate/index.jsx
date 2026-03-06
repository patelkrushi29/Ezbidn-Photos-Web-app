import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Radio, Box } from "@mui/material";
import "./addinmate.css";
import { useNavigate } from "react-router-dom";
import { fontSizesMUI } from "../../../../utils/muiFonts";
import PopupModel from "../../../../utils/Model/Model";
import UnderConstruction from "../../../InProgress";

const AddInmateSelection = () => {
	const [selectedInmate, setSelectedInmate] = useState("federal");
	const [upcoming, setUpcoming] = useState(false);
	const navigate = useNavigate();
	const nextHandel = () => {
		if (selectedInmate === "federal") {
			navigate("/user/account/fedral-inmates", { state: { type: selectedInmate } });
		} else {
			setUpcoming(true);
			// navigate("/user/account/state-inmates", { state: { type: selectedInmate } });
		}
	};
	return (
		<div className="add-inmate-container">
			<Typography variant="h5" className="add-inmate-title" sx={{ fontSize: fontSizesMUI.h5 }}>
				Add Inmate
			</Typography>
			<Typography variant="body2" className="add-inmate-subtitle" sx={{ fontSize: fontSizesMUI.body2 }}>
				What type of inmate are you trying to add?
			</Typography>

			<div className="add-inmate-options-container">
				<Card
					className={`add-inmate-option-card ${selectedInmate === "federal" ? "selected" : ""}`}
					onClick={() => setSelectedInmate("federal")}
				>
					<CardContent className="add-inmate-card-content">
						<Radio checked={selectedInmate === "federal"} color="warning" />
						<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }}>
							Federal Inmate
						</Typography>
						<img src="/assets/png/inmates/inmateImage.png" alt="Federal Inmate" className="add-inmate-image" />
					</CardContent>
				</Card>

				<Card
					className={`add-inmate-option-card ${selectedInmate === "state" ? "selected" : ""}`}
					onClick={() => setSelectedInmate("state")}
				>
					<CardContent className="add-inmate-card-content">
						<Radio checked={selectedInmate === "state"} color="warning" />
						<Typography variant="h6" sx={{ fontSize: fontSizesMUI.h6 }}>
							State, County, City Or Juvenile Inmate
						</Typography>
						<img src="/assets/png/inmates/inmateImage.png" alt="State Inmate" className="add-inmate-image" />
					</CardContent>
				</Card>
			</div>
			<Box sx={{ width: "100%", display: "flex" }}>
				<Button variant="contained" color="warning" className="add-inmate-next-button" onClick={nextHandel}>
					Next →
				</Button>
			</Box>
			<PopupModel open={upcoming} handleClose={() => setUpcoming(false)}>
				<UnderConstruction />
			</PopupModel>
		</div>
	);
};

export default AddInmateSelection;
