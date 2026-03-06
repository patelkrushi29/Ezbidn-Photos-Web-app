import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Typography, Box, Paper, Radio, Avatar } from "@mui/material";
import "./fedralinmate.css";
import { useNavigate } from "react-router-dom";
import apiHandler from "../../../../utils/API/api";
import apiConfig from "../../../../utils/API/apiConfig";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
	// inmateId: yup.string().matches(/d{8}$/, "Inmate ID must be exactly 8 digits").required("Inmate ID is required"),
});

const AddInmateForm = () => {
	const [formData, setFormData] = useState({ inmateId: "" });
	const [isInmate, setIsInmate] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { isLoggedIn } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const fetchInmateDetail = async () => {
		setIsLoading(true);
		try {
			const response = await apiHandler.get(apiConfig.user.findFederalInmate.url, { inmateId: formData.inmateId });
			if (response?.status === true) {
				setIsInmate(response.data);
			} else {
				setIsInmate(null);
			}
		} catch (error) {
			setIsInmate(null);
			console.error(error);
		}
		setIsLoading(false);
	};

	const onSubmit = async () => {
		console.info("Form Data:", isInmate);
		try {
			if (!isLoggedIn) {
				navigate("/login");
				return;
			}
			if (isInmate && formData.inmateId) {
				const {
					nameFirst,
					nameMiddle,
					nameLast,
					inmateNum,
					faclCode,
					faclName,
					faclType,
					faclURL,
					releaseCode,
					projRelDate,
					actRelDate,
				} = isInmate.inamteProfile;
				const response = await apiHandler.post(
					apiConfig.user.saveInmate.url,
					{},
					{
						nameFirst,
						nameMiddle,
						nameLast,
						inmateNum,
						faclCode,
						faclName,
						faclType,
						faclURL,
						releaseCode,
						projRelDate,
						actRelDate,
					}
				);
				if (response?.status || response?.customcode === 207) {
					navigate("/user/account/send-to-inmates", { state: { inmateId: response.data?.id || 0 } });
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fullName = `${isInmate?.inamteProfile?.nameFirst || ""} ${
		isInmate?.inamteProfile?.nameMiddle ? isInmate?.inamteProfile?.nameMiddle + " " : ""
	}${isInmate?.inamteProfile?.nameLast || ""}`.trim();

	return (
		<Box className="add-inmate-form">
			<Typography variant="h4" className="add-inmate-form__title">
				Add Federal Inmate
			</Typography>
			<Typography className="add-inmate-form__subtitle">
				Use the search field to locate a Federal Inmate you'd like to send photos to using their registered number.
			</Typography>

			<form onSubmit={handleSubmit(onSubmit)} className="add-inmate-form__container">
				<Box className="add-inmate-form__field">
					<Typography className="add-inmate-form__label">
						Inmate 8 Digit Registered Number <span>*</span>
					</Typography>
					<TextField
						fullWidth
						placeholder="Enter Inmate ID or Registered Number"
						{...register("inmateId")}
						value={formData.inmateId}
						onChange={handleInputChange}
						error={!!errors.inmateId}
						helperText={errors.inmateId?.message}
					/>
				</Box>

				{isInmate && (
					<Paper className="inmate-card" sx={{ p: 2, mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
						<Radio checked={true} color="primary" />
						{isInmate.inmateLocation?.imageSmall ? (
							<Avatar src={isInmate?.inmateLocation?.imageSmall} alt={fullName} sx={{ width: 56, height: 56 }} />
						) : (
							<Avatar sx={{ width: 56, height: 56 }}>{fullName.charAt(0)}</Avatar>
						)}
						<Box>
							<Typography variant="h6" className="inmate-name">
								{fullName || "Unknown Name"}
							</Typography>
							<Typography variant="body2" className="inmate-number">
								<b>Inmate Number:</b> {isInmate?.inamteProfile?.inmateNum || "N/A"}
							</Typography>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="body2" className="inmate-sex">
									<b>Sex:</b> {isInmate?.inamteProfile?.sex || "N/A"}
								</Typography>
								<Typography variant="body2" className="inmate-age">
									<b>Age:</b> {isInmate?.inamteProfile?.age || "N/A"}
								</Typography>
							</Box>
						</Box>
					</Paper>
				)}

				<Box className="add-inmate-form__buttons">
					<Button
						variant="outlined"
						className="add-inmate-form__save-btn"
						onClick={fetchInmateDetail}
						disabled={isLoading}
					>
						{"Search Inmate"}
					</Button>
					<Button
						disabled={!isInmate || isLoading}
						variant="contained"
						className="add-inmate-form__next-btn"
						type="submit"
					>
						{"Save & Next →"}
					</Button>
				</Box>
			</form>
		</Box>
	);
};

export default AddInmateForm;
