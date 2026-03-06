import React, { useState, useEffect, useCallback } from "react";
import { Button, Box, Typography, Avatar, Card, CardMedia, CardActionArea, CircularProgress } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";

// ================================================================
// CONFIGURATION FLAG: Set to true to use dummy data, false for real OAuth
const USE_DUMMY_INSTAGRAM_DATA = true; // <--- SET THIS TO true OR false
// ================================================================

const INSTAGRAM_APP_ID = import.meta.env.VITE_OAUTH_INSTAGRAM_APP_ID;
const INSTAGRAM_REDIRECT_URI = import.meta.env.VITE_OAUTH_INSTAGRAM_REDIRECT_URI;
const INSTAGRAM_SCOPES = "user_profile,user_media";

// --- DUMMY INSTAGRAM PHOTOS DATA ---
const DUMMY_INSTAGRAM_PHOTOS = [
	{
		id: "DUMMY_IG_ID_1",
		baseUrl: "https://picsum.photos/id/112/300/300",
		filename: "dummy_ig_photo_1.jpg",
		media_type: "IMAGE",
		caption: "A vibrant city view (DUMMY IG)",
	},
	{
		id: "DUMMY_IG_ID_2",
		baseUrl: "https://picsum.photos/id/115/300/300",
		filename: "dummy_ig_photo_2.png",
		media_type: "IMAGE",
		caption: "Delicious food flatlay (DUMMY IG)",
	},
	{
		id: "DUMMY_IG_ID_3",
		baseUrl: "https://picsum.photos/id/117/300/300",
		filename: "dummy_ig_video_thumbnail_3.jpg",
		media_type: "CAROUSEL_ALBUM",
		caption: "Travel adventure carousel (DUMMY IG)",
	},
	{
		id: "DUMMY_IG_ID_4",
		baseUrl: "https://picsum.photos/id/110/300/300",
		filename: "dummy_ig_portrait_4.jpeg",
		media_type: "IMAGE",
		caption: "Artistic portrait shot (DUMMY IG)",
	},
];

const InstagramPhotosPicker = ({ selectedImage }) => {
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
		alert("Disconnected from Instagram.");
	}, []);

	const fetchUserProfile = useCallback(async () => {
		setLoading(true);
		setError(null);
		if (USE_DUMMY_INSTAGRAM_DATA) {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 500));
			setUserProfile({
				id: "DUMMY_IG_USER_ID",
				name: "Instagram User",
				username: "dummy_ig_user",
				imageUrl: "https://dummyimage.com/100x100/833AB4/ffffff&text=IG",
			});
			setLoading(false);
		} else {
			// Real API call for user profile, requires accessToken
			if (!accessToken) {
				setError("No access token for profile.");
				setLoading(false);
				return;
			}
			try {
				// Fetch basic user profile from Instagram Graph API
				// This requires a valid access token that has the 'user_profile' scope
				const response = await fetch(
					`https://graph.instagram.com/v19.0/me?fields=id,username,account_type&access_token=${accessToken}`
				);
				const profileData = await response.json();

				if (profileData.error) {
					throw new Error(profileData.error.message);
				}

				// Note: Instagram API does not directly provide a profile picture URL for 'me' endpoint
				// You usually need to use the profile_picture field from a business account or a separate API.
				// For simplicity here, we'll use a placeholder or assume it's set by your backend.
				setUserProfile({
					id: profileData.id,
					name: profileData.username, // Using username as name for display
					username: profileData.username,
					imageUrl: "https://dummyimage.com/100x100/833AB4/ffffff&text=IG", // Placeholder or set from backend
				});
				setLoading(false);
			} catch (err) {
				console.error("Error fetching Instagram profile:", err);
				setError(`Failed to fetch Instagram profile: ${err.message}`);
				setLoading(false);
				setUserProfile(null);
				handleSignOut(); // Sign out on profile fetch error
			}
		}
	}, [accessToken, handleSignOut]); // accessToken is a dependency for the real flow

	// --- Fetch Photos (Conditional: Real API or Simulated) ---
	const handleFetchPhotos = useCallback(
		async (token, userId) => {
			setLoading(true);
			setError(null);
			setPhotos([]); // Clear previous photos for loading indication

			if (USE_DUMMY_INSTAGRAM_DATA) {
				// Simulate API call delay
				await new Promise((resolve) => setTimeout(resolve, 800));
				setPhotos(DUMMY_INSTAGRAM_PHOTOS);
				setLoading(false);
			} else {
				if (!token) {
					setError("No Instagram access token available.");
					setLoading(false);
					return;
				}
				if (!userId) {
					setError("User profile ID not found for Instagram.");
					setLoading(false);
					return;
				}

				try {
					const response = await fetch(
						`https://graph.instagram.com/v19.0/${userId}/media?fields=id,media_type,media_url,thumbnail_url,caption,timestamp&access_token=${token}`
					);
					const data = await response.json();

					if (data.error) {
						throw new Error(data.error.message);
					}

					const fetchedPhotos = data.data
						.filter((item) => item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM")
						.map((item) => ({
							id: item.id,
							// Use media_url for IMAGE, thumbnail_url for CAROUSEL_ALBUM/VIDEO
							baseUrl: item.media_type === "CAROUSEL_ALBUM" ? item.thumbnail_url : item.media_url,
							filename: item.caption || `Instagram Photo ${item.id}`,
							// Add other relevant properties if needed
						}));

					setPhotos(fetchedPhotos);
					setLoading(false);
					if (fetchedPhotos.length === 0) {
						setError("No photos found or 'user_media' permission not granted. Ensure your app is reviewed by Meta.");
					}
				} catch (err) {
					console.error("Error fetching Instagram photos:", err);
					setError(`Failed to fetch Instagram photos: ${err.message}. Check permissions and app review status.`);
					setLoading(false);
				}
			}
		},
		[] // No dependencies for handleFetchPhotos itself other than global flag. token/userId passed as args.
	);

	// --- Step 2 & 3 (Server-Side MANDATORY for Graph API): Exchange Code for Access Token (Conditional) ---
	const handleCodeExchange = useCallback(
		async (code) => {
			setLoading(true);
			setError(null);

			if (USE_DUMMY_INSTAGRAM_DATA) {
				// This path should ideally not be hit in the new "login first" dummy flow,
				// as handleInstagramSignIn directly sets the access token and triggers fetches.
				// However, for robustness, if it were to be called, it simulates success.
				console.warn("handleCodeExchange called in dummy mode unexpectedly.");
				await new Promise((resolve) => setTimeout(resolve, 500));
				const dummyAccessToken = "DUMMY_ACCESS_TOKEN_FROM_CODE";
				const dummyUserId = "DUMMY_IG_USER_ID_AUTH";
				setAccessToken(dummyAccessToken);
				setUserProfile({
					id: dummyUserId,
					name: "Instagram User",
					username: "dummy_ig_user",
					imageUrl: "https://dummyimage.com/100x100/833AB4/ffffff&text=IG",
				});
				await handleFetchPhotos(dummyAccessToken, dummyUserId); // Trigger dummy photos fetch
				setLoading(false);
			} else {
				try {
					console.warn("Instagram token exchange should happen on your backend for security!");
					// This is a placeholder for an API call to YOUR backend endpoint.
					// Your backend will:
					// 1. Exchange the 'code' for a short-lived access token.
					// 2. Exchange the short-lived token for a long-lived access token.
					// 3. (Optional but recommended) Store the long-lived token securely.
					// 4. Use the long-lived token to fetch user profile details.
					// 5. Return the long-lived access token and user profile to the frontend.

					const backendExchangeResponse = await fetch("/api/instagram/exchange-token", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ code, redirectUri: INSTAGRAM_REDIRECT_URI }),
					});

					const data = await backendExchangeResponse.json();
					if (!backendExchangeResponse.ok) {
						throw new Error(data.message || "Failed to exchange Instagram code for token");
					}

					const { accessToken: igAccessToken, userProfile: igUserProfile } = data; // Assuming your backend returns this

					setAccessToken(igAccessToken);
					setUserProfile(igUserProfile); // Set real user profile from backend
					setLoading(false);
					// Now fetch photos with the real token
					handleFetchPhotos(igAccessToken, igUserProfile?.id);
				} catch (err) {
					console.error("Error exchanging code for Instagram token:", err);
					setError(`Failed to sign in with Instagram: ${err.message}`);
					setLoading(false);
					setAccessToken(null);
					setUserProfile(null);
					setPhotos([]); // Clear real photos on error
				}
			}
		},
		[handleFetchPhotos]
	);

	// --- OAuth Flow: Handle Redirect from Instagram / Initial Load (Conditional) ---
	useEffect(() => {
		// This effect only runs for real Instagram OAuth flow to handle redirects.
		// It does NOT perform any initial dummy login.
		if (!USE_DUMMY_INSTAGRAM_DATA) {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");
			const errorParam = urlParams.get("error");

			if (errorParam) {
				setError(`Instagram error: ${urlParams.get("error_description") || errorParam}`);
				setLoading(false);
				window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
				return;
			}

			if (code) {
				window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
				handleCodeExchange(code);
			}
			// If no code and not already logged in, photos state will remain empty initially.
		}
	}, [handleCodeExchange]);

	// --- Step 1: Initiate Instagram Login (Conditional: Real Redirect or Simulated) ---
	const handleInstagramSignIn = () => {
		setError(null);
		setLoading(true);

		if (USE_DUMMY_INSTAGRAM_DATA) {
			// Simulate login process for dummy mode
			const dummyToken = "DUMMY_LOGIN_TOKEN";
			const dummyUserId = "DUMMY_IG_USER_ID_CLICK";
			setAccessToken(dummyToken);
			setUserProfile({
				id: dummyUserId,
				name: "Instagram User",
				username: "dummy_ig_user",
				imageUrl: "https://dummyimage.com/100x100/833AB4/ffffff&text=IG",
			});
			// Simulate fetching photos after "login"
			handleFetchPhotos(dummyToken, dummyUserId);
			setLoading(false);
		} else {
			// Real OAuth flow
			const authUrl =
				`https://api.instagram.com/oauth/authorize?` +
				`client_id=${INSTAGRAM_APP_ID}&` +
				`redirect_uri=${encodeURIComponent(INSTAGRAM_REDIRECT_URI)}&` +
				`scope=${encodeURIComponent(INSTAGRAM_SCOPES)}&` +
				`response_type=code`;

			window.location.href = authUrl;
		}
	};

	// --- Photo Selection ---
	const handlePhotoClick = (photo) => {
		setSelectedPhoto(photo);
	};

	// Determine which photos to display
	// Photos are only displayed if an accessToken and userProfile exist (real or dummy)
	// If USE_DUMMY_INSTAGRAM_DATA is true and accessToken is present, use DUMMY_INSTAGRAM_PHOTOS.
	// Otherwise, use the 'photos' state which holds real fetched photos.
	const photosToDisplay = USE_DUMMY_INSTAGRAM_DATA && accessToken && userProfile ? DUMMY_INSTAGRAM_PHOTOS : photos;

	return (
		<Box sx={{ p: 4, maxWidth: 800, mx: "auto", border: "1px solid #ccc", borderRadius: "8px", mt: 4 }}>
			<Typography variant="h5" gutterBottom>
				Select Photo from Instagram
			</Typography>

			{!accessToken || !userProfile ? (
				// State: Not signed in (initial state in dummy mode, or actual logged out state)
				<Box>
					{/* <Typography variant="body1" sx={{ mb: 2 }}>
						{USE_DUMMY_INSTAGRAM_DATA
							? "Click the button below to simulate connecting your Instagram account and view dummy photos."
							: "Please connect your Instagram account to select photos."}
					</Typography> */}
					<Button variant="contained" startIcon={<InstagramIcon />} onClick={handleInstagramSignIn} disabled={loading}>
						{loading ? (
							<CircularProgress size={24} color="inherit" />
						) : USE_DUMMY_INSTAGRAM_DATA ? (
							"Instagram Login"
						) : (
							"Sign in with Instagram"
						)}
					</Button>
					{error && (
						<Typography color="error" sx={{ mt: 2 }}>
							Error: {error}
						</Typography>
					)}
					{/* The dummy data preview is removed from here. It will appear only after login. */}
				</Box>
			) : (
				// State: Signed in (real or simulated)
				<Box>
					<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
						<Avatar src={userProfile.imageUrl} alt={userProfile.name || userProfile.username} sx={{ mr: 2 }} />
						<Typography variant="subtitle1">{userProfile.name || userProfile.username}</Typography>
						<Button onClick={handleSignOut} sx={{ ml: "auto" }} size="small" color="error">
							{USE_DUMMY_INSTAGRAM_DATA ? "Disconnect" : "Disconnect Instagram"}
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
								{USE_DUMMY_INSTAGRAM_DATA ? "Simulating photo load..." : "Loading photos..."}
							</Typography>
						</Box>
					)}

					{/* Buttons for loading/clearing photos */}
					{!loading && photos.length === 0 && (
						<Button
							variant="contained"
							onClick={() => handleFetchPhotos(accessToken, userProfile.id)}
							disabled={!accessToken || loading}
							sx={{ mt: 2 }}
						>
							{USE_DUMMY_INSTAGRAM_DATA ? "Load Photos" : "Load Photos"}
						</Button>
					)}
					{/* {!loading && photos.length > 0 && (
						<Button variant="outlined" onClick={() => setPhotos([])} sx={{ mt: 2 }}>
							{USE_DUMMY_INSTAGRAM_DATA ? "Clear Photos" : "Clear Photos Display"}
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

export default InstagramPhotosPicker;
