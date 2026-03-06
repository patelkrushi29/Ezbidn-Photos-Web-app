import React, { useState, useRef, useEffect } from "react";
import { IconButton, Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import "./inmateCard.css";
import { fontSizesMUI } from "../../../../utils/muiFonts";
import apiHandler from "../../../../utils/API/api";
import apiConfig from "../../../../utils/API/apiConfig";
import { useSelector } from "react-redux";

const InmateSlider = () => {
	const [inmates, setInmates] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { isLoggedIn } = useSelector((state) => state.auth);

	const navigate = useNavigate();
	const swiperRef = useRef(null);
	const fetchInmateList = async () => {
		setIsLoading(true);
		try {
			const response = await apiHandler.get(apiConfig.user.inmateList.url);
			if (response?.status) {
				setInmates(response.data || []);
			}
		} catch (err) {
			console.error("Inmate fetch error:", err);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (isLoggedIn) {
			fetchInmateList();
		} else {
			setInmates([]);
		}
	}, [isLoggedIn]);

	const addInmate = () => {
		navigate("/user/account/add-inmates");
	};

	const getReleaseDate = (inmate) => {
		const { projRelDate, actRelDate, releaseCode } = inmate || {};
		if (projRelDate) {
			return (
				<>
					<span>Release Date:</span> {projRelDate}
				</>
			);
		} else if (releaseCode.toLowerCase() === "d") {
			return (
				<>
					<span>Deceased:</span> {actRelDate}
				</>
			);
		} else if (releaseCode.toLowerCase() === "r" || actRelDate) {
			return (
				<>
					<span>Release Date:</span> {actRelDate}
				</>
			);
		}
	};

	return (
		<div className="inmate-slider-container">
			<Typography variant="h1" sx={{ fontSize: fontSizesMUI.h6 }} className="slider-title">
				Connect With Your Loved Ones Today
			</Typography>

			{/* Navigation Arrows */}
			<Box className="swiper-nav-buttons">
				<IconButton className="nav-button prev" onClick={() => swiperRef.current?.slidePrev()}>
					<ArrowBackIcon />
				</IconButton>
				<IconButton className="nav-button next" onClick={() => swiperRef.current?.slideNext()}>
					<ArrowForwardIcon />
				</IconButton>
			</Box>

			<Swiper
				spaceBetween={20}
				slidesPerView={3}
				breakpoints={{
					0: { slidesPerView: 1 },
					600: { slidesPerView: 2 },
					960: { slidesPerView: 3 },
				}}
				onSwiper={(swiper) => (swiperRef.current = swiper)}
				modules={[Navigation]}
				className="inmate-swiper"
			>
				{!isLoading &&
					inmates?.map((inmate) => (
						<SwiperSlide key={inmate.id}>
							<Box className="inmate-card">
								<div className="inmate-image">
									<img src="/assets/png/inmates/icon.png" alt="inamtes" />
								</div>
								<Box className="card-details-box">
									<Typography variant="body2" sx={{ fontSize: fontSizesMUI.body2 }}>
										{inmate.nameFirst + " " + inmate.nameLast}
									</Typography>
									<Typography variant="body2" sx={{ fontSize: fontSizesMUI.body2 }}>
										ID: {inmate.inmateNum}
									</Typography>
									<Typography variant="overline" sx={{ fontSize: fontSizesMUI.overline }}>
										{getReleaseDate(inmate)}
									</Typography>
								</Box>
							</Box>
						</SwiperSlide>
					))}

				{/* Add Inmate Card */}
				<SwiperSlide className="inmateAddCard-container">
					<Box className="inmate-card inmate-add-card">
						<div className="inmate-image">
							<img src="/assets/png/inmates/icon.png" alt="inamtes" />
						</div>
						<Box className="card-details-box inmate-card-add" onClick={addInmate}>
							<img src="/assets/png/inmates/addIcon.svg" alt="Add Icon" />
							<Typography variant="h6"> + Add Inmates </Typography>
						</Box>
					</Box>
				</SwiperSlide>
			</Swiper>
		</div>
	);
};

export default InmateSlider;
