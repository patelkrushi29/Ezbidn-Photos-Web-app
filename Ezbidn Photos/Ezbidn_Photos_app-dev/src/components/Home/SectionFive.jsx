import React, { useState, useRef } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion, AnimatePresence, useInView } from "framer-motion";
import "./home.css";
import { fontSizesMUI } from "../../utils/muiFonts";

const faqData = [
	{
		question: "How long until the inmate receives the photos?",
		answer:
			"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
	},
	{
		question: "Can I add money to the inmate's photo account?",
		answer: "Yes, you can add money using our secure payment gateway.",
	},
	{ question: "What size prints do you offer?", answer: "We offer various sizes including 4x6, 5x7, and 8x10 prints." },
	{
		question: "Do you offer refunds?",
		answer: "Refunds are processed based on specific conditions. Please check our refund policy.",
	},
];

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
			staggerChildren: 1,
		},
	},
};

const accordionVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

const SectionFive = () => {
	const isSmallScreen = useMediaQuery("(max-width:1080px)");
	const [expandedIndex, setExpandedIndex] = useState(null);
	const sectionRef = useRef(null);

	// Detect if the section is in view
	const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -100px 0px" });

	const toggleAccordion = (index) => {
		setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
	};

	return (
		<Box className="faq-container" ref={sectionRef}>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate={isInView ? "visible" : "hidden"}
				className={`faq-wrapper ${isSmallScreen ? "column" : "row"}`}
			>
				{/* Left Image Section */}
				<Box className="faq-image-section">
					<motion.img
						src="/assets/svgs/home/faq.svg"
						alt="faq"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={isInView ? { scale: 1, opacity: 1 } : {}}
						transition={{ duration: 0.5 }}
					/>
				</Box>

				{/* Right FAQ Section */}
				<Box className="faq-content-section">
					<motion.div variants={accordionVariants}>
						<Typography variant="h6" className="faq-header" fontWeight={900} sx={{ fontSize: fontSizesMUI.h6 }}>
							— Some Faq
						</Typography>
						<Typography variant="h3" fontWeight={700} gutterBottom sx={{ fontSize: fontSizesMUI.h3 }}>
							Quick Answers To Your Questions
						</Typography>
					</motion.div>

					{/* Loop through FAQ data */}
					<motion.div variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
						{faqData.map((faq, index) => (
							<motion.div
								key={"faq" + index}
								variants={accordionVariants}
								initial="hidden"
								animate={isInView ? "visible" : "hidden"}
								transition={{ delay: index * 1 }} // 1-second delay between each accordion
							>
								<Accordion
									className="faq-accordion"
									expanded={expandedIndex === index}
									onChange={() => toggleAccordion(index)}
									sx={{ boxShadow: "none", mb: 2 }}
								>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										className="faq-question-header"
										component={motion.div}
										initial={false}
										animate={{ backgroundColor: expandedIndex === index ? "#f5f5f5" : "#fff" }}
										transition={{ duration: 0.3 }}
									>
										<Typography variant="body1" fontWeight={600} sx={{ fontSize: fontSizesMUI.body1 }}>
											{index + 1}. {faq.question}
										</Typography>
									</AccordionSummary>

									<AnimatePresence>
										{expandedIndex === index && (
											<motion.div
												variants={{
													open: { opacity: 1, height: "auto" },
													closed: { opacity: 0, height: 0 },
												}}
												initial="closed"
												animate="open"
												exit="closed"
												style={{ overflow: "hidden" }}
											>
												<AccordionDetails>
													<Typography variant="body2" sx={{ fontSize: fontSizesMUI.body2 }}>
														{faq.answer}
													</Typography>
												</AccordionDetails>
											</motion.div>
										)}
									</AnimatePresence>
								</Accordion>
							</motion.div>
						))}
					</motion.div>
				</Box>
			</motion.div>
		</Box>
	);
};

export default SectionFive;
