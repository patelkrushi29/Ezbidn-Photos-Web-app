import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./faq.css";
import { fontSizesMUI } from "../../utils/muiFonts";

const faqData = [
	{
		id: "panel1",
		question: "How long until the inmate receives the photos?",
		answer:
			"It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. Lorem Ipsum is simply dummy text.",
	},
	{
		id: "panel2",
		question: "Can I add money to the inmate's photo account?",
		answer: "Yes, you can add money through our secure payment portal.",
	},
	{
		id: "panel3",
		question: "What size prints do you offer?",
		answer: "We offer 4x6, 5x7, and 8x10 prints for high-quality images.",
	},
	{
		id: "panel4",
		question: "Do you offer refunds?",
		answer: "We offer refunds only if the order is canceled within 24 hours of placement.",
	},
];

const FAQ = () => {
	const [expanded, setExpanded] = useState(faqData[0].id);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<div className="faq-container">
			<Typography variant="h4" className="faq-heading" sx={{ fontSize: fontSizesMUI.h4 }}>
				Frequently Asked Questions
			</Typography>

			{faqData.map((faq, index) => (
				<Accordion
					key={faq.id}
					expanded={expanded === faq.id}
					onChange={handleChange(faq.id)}
					className="faq-accordion"
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						className={`faq-question ${expanded === faq.id ? "faq-active" : ""}`}
					>
						<Typography className="faq-question-text" variant="h6" sx={{ fontSize: fontSizesMUI.h6 }}>{`${index + 1}. ${
							faq.question
						}`}</Typography>
					</AccordionSummary>
					<AccordionDetails className="faq-answer">
						<Typography variant="body1" sx={{ fontSize: fontSizesMUI.body1 }}>
							{faq.answer}
						</Typography>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
};

export default FAQ;
