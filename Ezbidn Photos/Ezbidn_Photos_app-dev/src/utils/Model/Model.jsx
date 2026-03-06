import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "./model.css";
const PopupModel = ({ open, handleClose, title, description, children, showActions = false, actionButtons }) => {
	return (
		<Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
			<Box className="modal-container">
				<Box sx={{ position: "relative" }}>
					{title && (
						<Typography id="modal-title" variant="h6" component="h2">
							{title}
						</Typography>
					)}

					{description && (
						<Typography id="modal-description" sx={{ mt: 2 }}>
							{description}
						</Typography>
					)}

					<Box className="modal-content">{children}</Box>

					{showActions && (
						<Box className="modal-actions">
							{actionButtons || (
								<Button variant="contained" color="primary" onClick={handleClose}>
									Close
								</Button>
							)}
						</Box>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

export default PopupModel;
