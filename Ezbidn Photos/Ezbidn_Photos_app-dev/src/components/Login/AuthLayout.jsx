import React from "react";
import "./login.css";
import ImageSection from "./ImageSection";
import AuthContent from "./AuthContent";

const AuthLayout = () => {
	return (
		<div className="auth-container">
			<div className="login-head-icon">
				<img src="/assets/svgs/ezLogo.svg" alt="logo" height={40} />
			</div>
			<div className="left-section">
				<ImageSection />
			</div>

			<div className="right-section auth-field-conatiner">
				<AuthContent />
			</div>
		</div>
	);
};

export default AuthLayout;
