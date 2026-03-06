import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Radio, Typography, Paper } from "@mui/material";
import "./stateInmate.css";
import { Link, useNavigate } from "react-router-dom";
import { fontSizesMUI } from "../../../../utils/muiFonts";

const StateInmates = () => {
	const [state, setState] = useState("California");
	const [search, setSearch] = useState("");
	const [selectedFacility, setSelectedFacility] = useState(null);
	const facilities = [{ name: "Acton Conservation Camp #11", address: "8800 Soledad Canyon Road, Acton, CA 93510" }];

	const navigate = useNavigate();
	const filteredFacilities = facilities.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

	const handleSendTo = () => {
		navigate("/user/account/upload-photo");
	};

	return (
		<Box className="facility-container" sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
			<Typography variant="h5" className="facility-title" gutterBottom sx={{ fontSize: fontSizesMUI.h5 }}>
				Add State, County, City or Juvenile Inmate
			</Typography>
			<Typography variant="body2" className="facility-subtitle" gutterBottom sx={{ fontSize: fontSizesMUI.body2 }}>
				Use search field to locate an inmate you like to send photos to facility of the inmate.
			</Typography>

			<TextField
				select
				fullWidth
				label="Select the State the Inmate is in"
				value={state}
				onChange={(e) => setState(e.target.value)}
				className="state-dropdown"
				sx={{ mb: 2 }}
			>
				<MenuItem value="California">California</MenuItem>
			</TextField>

			<TextField
				fullWidth
				label="Search the Facility the Inmate is in"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="facility-search"
				sx={{ mb: 2 }}
			/>

			{filteredFacilities.map((facility, index) => (
				<Paper
					key={"facilities" + index}
					className="facility-card"
					sx={{ p: 2, mb: 2, display: "flex", alignItems: "center" }}
				>
					<Radio
						checked={selectedFacility === facility.name}
						onChange={() => setSelectedFacility(facility.name)}
						color="primary"
					/>
					<Box>
						<Typography variant="body1" className="facility-name" sx={{ fontSize: fontSizesMUI.body1 }}>
							{facility.name}
						</Typography>
						<Typography variant="body2" className="facility-address" sx={{ fontSize: fontSizesMUI.body2 }}>
							{facility.address}
						</Typography>
					</Box>
				</Paper>
			))}

			<Box className="button-group" sx={{ display: "flex", gap: 2, mt: 2 }}>
				<Link to={"/user/account/add-inmates-details"}>
					<Button variant="outlined" className="manual-button">
						Enter Address Manually
					</Button>
				</Link>
				<Button onClick={handleSendTo} variant="contained" color="primary" className="use-address-button">
					Use this Address →
				</Button>
			</Box>
		</Box>
	);
};

export default StateInmates;
