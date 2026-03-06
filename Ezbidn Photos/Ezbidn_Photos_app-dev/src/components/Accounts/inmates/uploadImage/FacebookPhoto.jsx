// FacebookPhotosPicker.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Button, Box, Typography, Avatar, Card, CardMedia, CardActionArea, CircularProgress } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

// ================================================================
// CONFIGURATION FLAG: Set to true to use dummy data, false for real OAuth
const USE_DUMMY_FACEBOOK_DATA = true; // <--- SET THIS TO true OR false
// ================================================================

// Replace with your actual Facebook App ID (only used if USE_DUMMY_FACEBOOK_DATA is false)
const FACEBOOK_APP_ID = import.meta.env.VITE_OAUTH_FACEBOOK_APP_ID;
// This should be your backend endpoint that handles the OAuth exchange (only used if USE_DUMMY_FACEBOOK_DATA is false)
const FACEBOOK_REDIRECT_URI = import.meta.env.VITE_OAUTH_FACEBOOK_REDIRECT_URI;
// Permissions your app needs. 'user_photos' typically requires App Review. (only used if USE_DUMMY_FACEBOOK_DATA is false)
const FACEBOOK_SCOPES = "public_profile,email,user_photos";

// --- DUMMY FACEBOOK PHOTOS DATA ---
const DUMMY_FACEBOOK_PHOTOS = [
	{
		id: "DUMMY_FB_ID_1",
		baseUrl: "https://picsum.photos/id/111/300/300",
		filename: "dummy_fb_album_photo_1.jpg",
	},
	{
		id: "DUMMY_FB_ID_2",
		baseUrl: "https://picsum.photos/id/112/300/300",
		filename: "dummy_fb_profile_pic_2.png",
	},
	{
		id: "DUMMY_FB_ID_3",
		baseUrl: "https://picsum.photos/id/23/300/300",
		filename: "dummy_fb_event_photo_3.jpeg",
	},
	{
		id: "DUMMY_FB_ID_4",
		baseUrl: "https://picsum.photos/id/237/300/300",
		filename: "dummy_fb_timeline_photo_4.jpg",
	},
];
// --- END DUMMY DATA ---

const FacebookPhotosPicker = ({ selectedImage }) => {
	const [accessToken, setAccessToken] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	// Photos start empty, populated only after login click (in dummy mode)
	const [photos, setPhotos] = useState([]);
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// --- Sign Out (Memoized with useCallback) ---
	const handleSignOut = useCallback(() => {
		setAccessToken(null);
		setUserProfile(null);
		setSelectedPhoto(null);
		setError(null);
		setPhotos([]); // Clear photos on sign out
		alert("Disconnected from Facebook.");
	}, []);

	// --- Fetch User Profile (Conditional: Real API or Simulated) ---
	const fetchUserProfile = useCallback(
		async (token) => {
			setLoading(true);
			setError(null);
			if (USE_DUMMY_FACEBOOK_DATA) {
				// Simulate API call delay
				await new Promise((resolve) => setTimeout(resolve, 500));
				setUserProfile({
					id: "DUMMY_FB_USER_ID",
					name: "Facebook User",
					email: "dummy@facebook.com",
					imageUrl: "https://dummyimage.com/100x100/3b5998/ffffff&text=FB", // Generic Facebook-like avatar
				});
				setLoading(false);
			} else {
				try {
					const response = await fetch(
						`https://graph.facebook.com/v19.0/me?fields=id,name,email,picture&access_token=${token}`
					);
					const profileData = await response.json();
					if (profileData.error) {
						throw new Error(profileData.error.message);
					}
					setUserProfile({
						id: profileData.id,
						name: profileData.name,
						email: profileData.email,
						imageUrl: profileData.picture?.data?.url,
					});
					setLoading(false);
				} catch (err) {
					console.error("Error fetching Facebook profile:", err);
					setError(`Failed to fetch Facebook profile: ${err.message}`);
					setLoading(false);
					setUserProfile(null);
					handleSignOut();
				}
			}
		},
		[handleSignOut]
	);

	// --- Fetch Photos (Conditional: Real API or Simulated) ---
	const handleFetchPhotos = useCallback(async () => {
		setLoading(true);
		setError(null);
		setPhotos([]); // Clear previous photos for loading indication

		if (USE_DUMMY_FACEBOOK_DATA) {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 800));
			setPhotos(DUMMY_FACEBOOK_PHOTOS);
			setLoading(false);
		} else {
			if (!accessToken) {
				setError("No Facebook access token available.");
				setLoading(false);
				return;
			}
			try {
				const response = await fetch(
					`https://graph.facebook.com/v19.0/me/photos?fields=id,images,name,created_time&access_token=${accessToken}`
				);
				const data = await response.json();

				if (data.error) {
					throw new Error(data.error.message);
				}

				const fetchedPhotos = data.data.map((photo) => {
					const largestImage = photo.images.reduce((prev, current) =>
						prev.width * prev.height > current.width * current.height ? prev : current
					);
					return {
						id: photo.id,
						baseUrl: largestImage.source,
						filename: photo.name || `Photo ${photo.id}`,
					};
				});
				setPhotos(fetchedPhotos);
				setLoading(false);
				if (fetchedPhotos.length === 0) {
					setError(
						"No photos found or permission not granted. Ensure 'user_photos' permission is approved and your app is reviewed by Meta."
					);
				}
			} catch (err) {
				console.error("Error fetching Facebook photos:", err);
				setError(`Failed to fetch Facebook photos: ${err.message}. Check permissions and app review status.`);
				setLoading(false);
			}
		}
	}, [accessToken]); // accessToken is a dependency for the real flow

	// --- Exchange Code for Access Token (Conditional: Real API or Simulated) ---
	const handleCodeExchange = useCallback(
		async (code) => {
			setLoading(true);
			setError(null);

			if (USE_DUMMY_FACEBOOK_DATA) {
				// In dummy mode, this function shouldn't be called directly by the OAuth flow.
				// It's part of the real flow. For dummy, we handle login via handleFacebookSignIn
				// that directly sets access token and calls fetchUserProfile/handleFetchPhotos.
				// This branch should ideally not be reached if USE_DUMMY_FACEBOOK_DATA is true and
				// handleFacebookSignIn is the only entry point.
				console.warn("handleCodeExchange called in dummy mode, this is unexpected for login flow.");
				await new Promise((resolve) => setTimeout(resolve, 500));
				setAccessToken("DUMMY_ACCESS_TOKEN_FROM_CODE");
				await fetchUserProfile("DUMMY_ACCESS_TOKEN_FROM_CODE");
				await handleFetchPhotos();
				setLoading(false);
			} else {
				const storedState = localStorage.getItem("facebook_oauth_state");
				const urlParams = new URLSearchParams(window.location.search);
				const receivedState = urlParams.get("state");

				if (!storedState || storedState !== receivedState) {
					setError("CSRF attack detected or state mismatch. Please try again.");
					setLoading(false);
					localStorage.removeItem("facebook_oauth_state");
					return;
				}
				localStorage.removeItem("facebook_oauth_state");

				try {
					// *** IMPORTANT: This token exchange should ideally happen on your backend ***
					const response = await fetch(
						`https://graph.facebook.com/v19.0/oauth/access_token?` +
							`client_id=${FACEBOOK_APP_ID}&` +
							`redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&` +
							`client_secret=${import.meta.env.VITE_OAUTH_FACEBOOK_APP_SECRET}&` + // DANGER: EXPOSES SECRET
							`code=${code}`
					);

					const data = await response.json();

					if (data.error) {
						throw new Error(data.error.message);
					}

					setAccessToken(data.access_token);
					await fetchUserProfile(data.access_token);
					setLoading(false);
				} catch (err) {
					console.error("Error exchanging code for token:", err);
					setError(`Failed to sign in with Facebook: ${err.message}`);
					setLoading(false);
					setAccessToken(null);
					setUserProfile(null);
				}
			}
		},
		[fetchUserProfile, handleFetchPhotos]
	);

	// --- OAuth Flow: Handle Redirect from Facebook / Initial Load (Conditional) ---
	useEffect(() => {
		if (!USE_DUMMY_FACEBOOK_DATA) {
			// Only run this effect for real Facebook OAuth
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");
			const errorParam = urlParams.get("error");

			if (errorParam) {
				setError(`Facebook error: ${urlParams.get("error_description") || errorParam}`);
				setLoading(false);
				window.history.replaceState({}, document.title, window.location.pathname);
				return;
			}

			if (code) {
				// Clear the URL to prevent re-exchange on refresh
				window.history.replaceState({}, document.title, window.location.pathname);
				handleCodeExchange(code);
			}
		}
		// No initial dummy login here. Dummy login happens on button click.
	}, [handleCodeExchange]); // Only dependency is handleCodeExchange

	// --- Step 1: Initiate Facebook Login (Conditional: Real Redirect or Simulated) ---
	const handleFacebookSignIn = () => {
		setError(null);
		setLoading(true);

		if (USE_DUMMY_FACEBOOK_DATA) {
			// Simulate login
			setAccessToken("DUMMY_LOGIN_TOKEN"); // Set a dummy token
			fetchUserProfile("DUMMY_LOGIN_TOKEN"); // Simulate fetching user profile
			handleFetchPhotos(); // Simulate fetching photos
			setLoading(false); // Clear loading state after simulation
		} else {
			// Real OAuth flow
			const csrfState = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			localStorage.setItem("facebook_oauth_state", csrfState);

			const authUrl =
				`https://www.facebook.com/v19.0/dialog/oauth?` +
				`client_id=${FACEBOOK_APP_ID}&` +
				`redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&` +
				`scope=${encodeURIComponent(FACEBOOK_SCOPES)}&` +
				`state=${csrfState}&` +
				`response_type=code`;

			window.location.href = authUrl;
		}
	};

	// --- Photo Selection ---
	const handlePhotoClick = (photo) => {
		setSelectedPhoto(photo);
	};

	// Determine which photos to display
	// Only display DUMMY_FACEBOOK_PHOTOS if we are in dummy mode AND logged in (have an accessToken)
	const photosToDisplay = USE_DUMMY_FACEBOOK_DATA && accessToken ? DUMMY_FACEBOOK_PHOTOS : photos;

	return (
		<Box sx={{ p: 4, maxWidth: 800, mx: "auto", border: "1px solid #ccc", borderRadius: "8px", mt: 4 }}>
			<Typography variant="h5" gutterBottom>
				Select Photo from Facebook
			</Typography>

			{!accessToken || !userProfile ? (
				// State: Not signed in (initial state in dummy mode, or actual logged out state)
				<Box>
					<Button variant="contained" startIcon={<FacebookIcon />} onClick={handleFacebookSignIn} disabled={loading}>
						{loading ? (
							<CircularProgress size={24} color="inherit" />
						) : USE_DUMMY_FACEBOOK_DATA ? (
							"Facebook Login"
						) : (
							"Sign in with Facebook"
						)}
					</Button>
					{error && (
						<Typography color="error" sx={{ mt: 2 }}>
							Error: {error}
						</Typography>
					)}
				</Box>
			) : (
				// State: Signed in (real or simulated)
				<Box>
					<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
						<Avatar src={userProfile.imageUrl} alt={userProfile.name} sx={{ mr: 2 }} />
						<Typography variant="subtitle1">{userProfile.name}</Typography>
						<Button onClick={handleSignOut} sx={{ ml: "auto" }} size="small" color="error">
							{USE_DUMMY_FACEBOOK_DATA ? "Disconnect" : "Disconnect Facebook"}
						</Button>
					</Box>

					{error && (
						<Typography color="error" sx={{ mt: 2 }}>
							Error: {error}
						</Typography>
					)}

					{/* Show loading spinner if photos are being fetched */}
					{loading && (
						<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
							<CircularProgress />
							<Typography sx={{ ml: 2 }}>
								{USE_DUMMY_FACEBOOK_DATA ? "Simulating photo load..." : "Loading photos..."}
							</Typography>
						</Box>
					)}

					{/* Buttons for loading/clearing photos */}
					{!loading && photos.length === 0 && (
						<Button variant="contained" onClick={handleFetchPhotos} disabled={!accessToken || loading} sx={{ mt: 2 }}>
							{USE_DUMMY_FACEBOOK_DATA ? "Load Photos" : "Load Photos"}
						</Button>
					)}
					{/* {!loading && photos.length > 0 && (
						<Button variant="outlined" onClick={() => setPhotos([])} sx={{ mt: 2 }}>
							{USE_DUMMY_FACEBOOK_DATA ? "Clear Photos" : "Clear Photos Display"}
						</Button>
					)} */}

					{selectedPhoto && (
						<Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: "8px", textAlign: "center" }}>
							<Typography variant="h6" gutterBottom>
								Selected Photo:
							</Typography>
							<img
								src={selectedPhoto.baseUrl}
								alt={selectedPhoto.filename}
								style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", objectFit: "contain" }}
							/>
							<Typography variant="body2">{selectedPhoto.filename}</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => selectedImage(selectedPhoto?.baseUrl)}
								sx={{ mt: 2 }}
							>
								Confirm Selection
							</Button>
						</Box>
					)}

					{/* Photo display grid */}
					{photosToDisplay.length > 0 ? (
						<Box
							sx={{
								mt: 2,
								display: "grid",
								gap: 2,
								gridTemplateColumns: {
									xs: "repeat(2, 1fr)",
									sm: "repeat(3, 1fr)",
									md: "repeat(4, 1fr)",
								},
							}}
						>
							{photosToDisplay.map((photo) => (
								<Card
									raised={selectedPhoto && selectedPhoto.id === photo.id}
									sx={{
										border:
											selectedPhoto && selectedPhoto.id === photo.id ? "2px solid primary.main" : "1px solid #eee",
										transition: "border 0.2s",
										height: "100%",
										display: "flex",
										flexDirection: "column",
									}}
									key={photo.id}
								>
									<CardActionArea onClick={() => handlePhotoClick(photo)} sx={{ flexGrow: 1 }}>
										<CardMedia
											component="img"
											image={`${photo.baseUrl}`}
											alt={photo.filename}
											sx={{
												width: "100%",
												height: 120,
												objectFit: "cover",
											}}
										/>
									</CardActionArea>
								</Card>
							))}
						</Box>
					) : (
						!loading && <Typography sx={{ mt: 2 }}>No photos available.</Typography>
					)}
				</Box>
			)}
		</Box>
	);
};

export default FacebookPhotosPicker;
