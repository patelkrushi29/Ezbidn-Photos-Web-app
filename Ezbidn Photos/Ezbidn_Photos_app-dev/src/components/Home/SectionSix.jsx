import React, { useRef } from "react";
import { Box, Typography, Avatar, IconButton, Divider } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import bgImage from "/assets/png/home/testimonialBg.png";
import "./home.css"; // Import external CSS
import { fontSizesMUI } from "../../utils/muiFonts";

const testimonials = [
	{
		name: "Rebeca Smith",
		location: "California, US",
		image: "https://randomuser.me/api/portraits/women/45.jpg",
		text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
	},
	{
		name: "John Rodriguez",
		location: "California, US",
		image: "https://randomuser.me/api/portraits/men/45.jpg",
		text: "The point of using Ipsum is that it has a more-or-less normal distribution.",
	},
	{
		name: "Sophia Miller",
		location: "New York, US",
		image: "https://randomuser.me/api/portraits/women/50.jpg",
		text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
	},
	{
		name: "James Anderson",
		location: "Texas, US",
		image: "https://randomuser.me/api/portraits/men/50.jpg",
		text: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
	},
];

const SectionSix = () => {
	const swiperRef = useRef(null);

	return (
		<Box
			className="testimonial-container"
			style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
		>
			{/* Title */}
			<Typography variant="h6" className="testimonial-title" sx={{ fontSize: fontSizesMUI.h6 }}>
				— Testimonials
			</Typography>
			<Box className="testimonial-header-container">
				<Typography variant="h4" className="testimonial-heading" sx={{ fontSize: fontSizesMUI.h4 }}>
					What Clients Are Saying About Us...
				</Typography>
				<Box className="testimonial-nav">
					<IconButton className="nav-button prev" onClick={() => swiperRef.current?.slidePrev()}>
						<ArrowBackIcon />
					</IconButton>
					<IconButton className="nav-button next" onClick={() => swiperRef.current?.slideNext()}>
						<ArrowForwardIcon />
					</IconButton>
				</Box>
			</Box>

			<Swiper
				spaceBetween={15}
				slidesPerView={1}
				centeredSlides={true}
				breakpoints={{
					768: { slidesPerView: 1, centeredSlides: false }, // 2 cards for larger screens
					480: { slidesPerView: 1, centeredSlides: true }, // 1 card, centered
				}}
				onSwiper={(swiper) => (swiperRef.current = swiper)}
				modules={[Navigation]}
				className="testimonial-swiper"
			>
				{testimonials.map((testimonial, index) => (
					<SwiperSlide key={"testemonial" + index} className="testimonial-card">
						{/* Quote Icon */}

						<Box className="quote-icon">
							<FormatQuoteIcon className="format-quote-icon" />
						</Box>

						{/* User Info */}
						<Box className="testimonial-user">
							<Avatar src={testimonial.image} className="testimonial-avatar" />
							<Box className="testimonial-user-details">
								<Typography variant="h6" className="testimonial-name" sx={{ fontSize: fontSizesMUI.h6 }}>
									{testimonial.name}
								</Typography>
								<Typography variant="body2" className="testimonial-location" sx={{ fontSize: fontSizesMUI.body2 }}>
									{testimonial.location}
								</Typography>
							</Box>
						</Box>

						{/* Testimonial Text */}
						<Divider sx={{ width: "90%", margin: "1rem auto" }} />
						<Typography className="testimonial-text" sx={{ fontSize: fontSizesMUI.subtitle1 }}>
							{testimonial.text}
						</Typography>
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	);
};

export default SectionSix;
