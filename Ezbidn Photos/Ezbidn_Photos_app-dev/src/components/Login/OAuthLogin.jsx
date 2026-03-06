import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Button, IconButton, Typography } from "@mui/material";
import { Facebook } from "@mui/icons-material";
import "./login.css";
import { socialLogin } from "../../redux/slices/authSlice";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_OAUTH_FACEBOOK_APP_ID;

const OAuthLogin = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleGoogleSuccess = (response) => {
		const userInfo = jwtDecode(response.credential);
		const userData = {
			name: userInfo.name,
			email: userInfo.email,
			picture: userInfo.picture,
		};
		handleLogin(response.clientId, userData, "google");
	};

	const handleGoogleFailure = (error) => {
		console.error("Google login failed:", error);
	};

	const handleFacebookResponse = (response) => {
		if (response?.status !== "unknown") {
			if (response.email) {
				handleLogin(
					response.userID,
					{
						name: response.name,
						email: response.email,
						phone: response?.phone || "",
						profile_picture: response?.picture.data?.url ?? "",
					},
					response.graphDomain
				);
			}
		} else {
			console.error("Facebook login failed");
		}
	};

	const handleLogin = async (id, data, provider) => {
		if (id && data && provider) {
			const response = await dispatch(
				socialLogin({
					name: data.name,
					email: data.email,
					provider: provider,
					provider_id: id,
					phone: data?.phone || "",
					profile_picture: data?.picture ?? "",
				})
			);

			if (response.payload?.status) {
				navigate("/user/profile/inmates");
			}
		}
	};

	return (
		<div className="oauth-container">
			<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
				<div className="google-button">
					<GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
				</div>
			</GoogleOAuthProvider>

			<FacebookLogin
				appId={FACEBOOK_APP_ID}
				autoLoad={false}
				fields="name,email,picture"
				// scope="user_photos"
				callback={handleFacebookResponse}
				render={(renderProps) => (
					<Button variant="outlined" className="oauth-btn facebook-btn" fullWidth onClick={renderProps.onClick}>
						<Facebook className="oauth-icon" />
						Continue with Facebook
					</Button>
				)}
			/>
			<IconButton onClick={() => navigate("/guest-user")} className="oauth-btn">
				<PersonOutlineIcon />
				<Typography variant="body2">Guest Login</Typography>
			</IconButton>
			{/* <PopupLogin open={openGuest} onClose={() => setOpenGuest(false)} /> */}
		</div>
	);
};

export default OAuthLogin;
