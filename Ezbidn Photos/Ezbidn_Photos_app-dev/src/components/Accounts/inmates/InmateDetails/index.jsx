import { useState } from "react";
import { Box, TextField, Checkbox, Button, Typography, Stack } from "@mui/material";
import "./inmateDetails.css";
import { Link } from "react-router-dom";

const InmateDetailsForm = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		inmateID: "",
		relation: "",
		confirmAddress: false,
		facility: "Acton Conservation Camp #11",
		address1: "8800 Soledad Canyon Road",
		address2: "",
		city: "Acton",
		state: "California",
		zip: "93510",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const validateForm = () => {
		let newErrors = {};
		["firstName", "lastName", "inmateID", "relation", "facility", "address1", "city", "state", "zip"].forEach(
			(field) => {
				if (!formData[field].trim()) newErrors[field] = "This field is required";
			}
		);
		if (!/^[0-9]{5}(-[0-9]{4})?$/.test(formData.zip)) {
			newErrors.zip = "Invalid ZIP Code";
		}
		if (!/^[0-9]+$/.test(formData.inmateID)) {
			newErrors.inmateID = "Inmate ID must be numeric";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			console.info("Form Submitted", formData);
		}
	};

	return (
		<Box className="inmate-form">
			<Typography variant="h5" align="center" gutterBottom>
				Inmate Details
			</Typography>
			<Typography
				variant="body2"
				className="inmate-form-subtitle"
				align="justify"
				sx={{ mb: 2, fontSize: 14, color: "gray" }}
			>
				Ensure accurate delivery by confirming the inmate’s name, ID number, and facility details before sending{" "}
			</Typography>

			<Stack spacing={2}>
				<Stack direction={{ sm: "column", md: "row" }} spacing={2}>
					<Box sx={{ width: "100%" }}>
						<Typography className="form-label">
							First Name
							<span className="required"> *</span>
						</Typography>
						<TextField
							className="input-field"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							error={!!errors.firstName}
							helperText={errors.firstName}
							fullWidth
						/>
					</Box>
					<Box sx={{ width: "100%" }}>
						<Typography className="form-label">
							Last Name
							<span className="required"> *</span>
						</Typography>
						<TextField
							className="input-field"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							error={!!errors.lastName}
							helperText={errors.lastName}
							fullWidth
						/>
					</Box>
				</Stack>

				{[
					{ label: "Inmate ID", name: "inmateID", required: true },
					{ label: "Your Relation to the Inmate", name: "relation", required: true },
					{ label: "Facility Name", name: "facility", required: true },
					{ label: "Address Line 1", name: "address1", required: true },
					{ label: "Address Line 2 (Optional)", name: "address2", required: false },
					{ label: "City", name: "city", required: true },
					{ label: "State", name: "state", required: true },
					{ label: "ZIP Code", name: "zip", required: true },
				].map((field) => (
					<Box key={field.name}>
						<Typography className="form-label">
							{field.label}
							{field.required && <span className="required"> *</span>}{" "}
						</Typography>
						<TextField
							className="input-field"
							name={field.name}
							value={formData[field.name]}
							onChange={handleChange}
							error={!!errors[field.name]}
							helperText={errors[field.name]}
							fullWidth
						/>
					</Box>
				))}

				<Box display="flex" alignItems="center">
					<Checkbox
						name="confirmAddress"
						checked={formData.confirmAddress}
						onChange={handleChange}
						className="confirmAddress"
					/>
					<Typography>I Confirm the Mailing Address</Typography>
				</Box>
			</Stack>

			<Stack direction="row" spacing={2} justifyContent="center" className="inmate-form-buttom-group">
				<Button className="save-btn" variant="outlined" color="primary" onClick={() => console.info("Saved", formData)}>
					Save Inmate
				</Button>
				<Link to={"/user/account/send-to-inmates"}>
					<Button className="next-btn" variant="contained" color="primary" onClick={handleSubmit}>
						Next →
					</Button>
				</Link>
			</Stack>
		</Box>
	);
};

export default InmateDetailsForm;
