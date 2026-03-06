import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Button,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	Typography,
} from "@mui/material";
import { Close, Money, Block, PanTool, EmojiPeople, Group, Medication } from "@mui/icons-material";
import "./rules.css";
import { fontSizesMUI } from "../../../../utils/muiFonts";
const FacilityRulesModal = ({ open, onClose, onConfirm }) => {
	const rules = [
		{
			icon: <Block fontSize="small" />,
			title: "No Adult Content",
			description: "No penetration, nudity, bikini etc..",
		},
		{ icon: <Group />, title: "No Shirtless Children", description: "No infant nudity." },
		{ icon: <EmojiPeople />, title: "No Gang Sign", description: "No emoji, cover-ups, stickers etc" },
		{ icon: <PanTool />, title: "No Generic Hand Gesture", description: "Peace, victory sign, hand loose etc.." },
		{ icon: <Money />, title: "No Photos with Money", description: "No money photos, credit cards." },
		{ icon: <Medication />, title: "No Prohibited Substances", description: "No prohibited substances accepted." },
	];

	return (
		<Dialog open={open} onClose={onClose} className="facility-rules-modal" fullWidth maxWidth="sm">
			<DialogTitle className="facility-rules-title">
				{/* <Typography variant="body1" sx={{ fontSize: fontSizesMUI.body1 }}> */} Facility Rules {/* </Typography> */}
				<IconButton onClick={onClose} className="close-button">
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent className="facility-rules-content">
				<Typography variant="body2" className="facility-rules-description">
					Most facilities have the following regulations regarding the photos. Please make sure your photos do not
					violate the facility regulations.
				</Typography>

				<List className="facility-rules-list">
					{rules.map((rule, index) => (
						<ListItem key={rule?.title + index} className="facility-rule-item">
							<ListItemAvatar>
								<Avatar className="rule-icon">{rule?.icon}</Avatar>
							</ListItemAvatar>
							<ListItemText primary={rule?.title} secondary={rule?.description} />
						</ListItem>
					))}
				</List>

				<Button variant="contained" className="agree-button" onClick={onConfirm}>
					I Agree & Continue →
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default FacilityRulesModal;
