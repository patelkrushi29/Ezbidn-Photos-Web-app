import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WorkFlow from "../Home/SectionTwo";

export default function HowItWorks() {
	const steps = [
		{ title: "Step 1: Sign Up", description: "Create an account to get started with our service." },
		{ title: "Step 2: Choose a Plan", description: "Select a plan that suits your needs." },
		{ title: "Step 3: Start Using", description: "Access all features and enjoy our service." },
	];

	return (
		<WorkFlow />
		// <div className="min-h-screen flex flex-col items-center justify-center p-6 ">
		// 	<h1 className="text-3xl font-semibold mb-6">How It Works</h1>
		// 	<div className="w-full max-w-2xl">
		// 		{steps.map((step, index) => (
		// 			<Accordion key={index} className="mb-2">
		// 				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
		// 					<p className="font-medium">{step.title}</p>
		// 				</AccordionSummary>
		// 				<AccordionDetails>
		// 					<p>{step.description}</p>
		// 				</AccordionDetails>
		// 			</Accordion>
		// 		))}
		// 	</div>
		// </div>
	);
}
