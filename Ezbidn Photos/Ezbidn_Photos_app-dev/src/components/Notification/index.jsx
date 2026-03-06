import React, { useState, useEffect } from "react";
import { Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./notification.css"; // External styling

const NotificationDrawer = ({ showNotification = false, hideNotification }) => {
	if (!showNotification) return null; // Hide when closed

	return (
		<Paper elevation={3} className="notification-panel">
			<div className="panel-header">
				<h2>Notifications</h2>
				<IconButton className="close-btn" onClick={hideNotification}>
					<CloseIcon />
				</IconButton>
			</div>

			<div className="notification-section">
				<h4>Today</h4>
				<p>
					<strong>Rebel</strong> Your 1 Photo to <strong>Rocky Smith</strong> has been Successfully Submitted.
				</p>
				<span className="timestamp">Today at 9:42 PM</span>
			</div>

			<div className="notification-section">
				<h4>Last Week</h4>
				<p>
					<strong>Rebel</strong> The Photo You Sent has been Successfully Delivered to <strong>David Brown</strong>.
				</p>
				<span className="timestamp">25 Feb 2025 at 10:25 AM</span>
			</div>
		</Paper>
	);
};

export default NotificationDrawer;
