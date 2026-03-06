import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Box, Typography, Avatar, Card, CardMedia, CardActionArea, CircularProgress } from "@mui/material";
import { Google } from "@mui/icons-material";

// ================================================================
// CONFIGURATION FLAG: Set to true to use dummy data, false for real OAuth
const USE_DUMMY_GOOGLE_DATA = true; // <--- SET THIS TO true OR false
// ================================================================

const CLIENT_ID = import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID;

const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly";
const PROFILE_SCOPES = "email profile openid";

// --- DUMMY GOOGLE PHOTOS DATA ---
const DUMMY_GOOGLE_PHOTOS = [
	{
		id: "DUMMY_ID_1",
		description: "A beautiful sunset over the mountains (DUMMY).",
		productUrl: "https://picsum.photos/id/11/300/300.jpg",
		baseUrl: "https://picsum.photos/id/11/300/300.jpg", // baseUrl for thumbnail
		mimeType: "image/jpeg",
		mediaMetadata: {
			creationTime: "2024-03-15T18:30:00Z",
			width: "600",
			height: "400",
			photo: {},
		},
		filename: "dummy_sunset.jpg",
	},
	{
		id: "DUMMY_ID_2",
		description: "Family picnic in the park (DUMMY).",
		productUrl: "https://picsum.photos/id/19/300/300.jpg",
		baseUrl: "https://picsum.photos/id/19/300/300.jpg",
		mimeType: "image/png",
		mediaMetadata: {
			creationTime: "2024-06-01T14:15:00Z",
			width: "600",
			height: "400",
			photo: {},
		},
		filename: "dummy_picnic.png",
	},
	{
		id: "DUMMY_ID_3",
		description: "A vibrant street art mural (DUMMY).",
		productUrl: "https://picsum.photos/id/89/300/300.jpg",
		baseUrl: "https://picsum.photos/id/89/300/300.jpg",
		mimeType: "image/gif",
		mediaMetadata: {
			creationTime: "2023-11-20T10:00:00Z",
			width: "600",
			height: "400",
			photo: {},
		},
		filename: "dummy_mural.gif",
	},
];
// --- END DUMMY DATA ---

const GooglePhotosPicker = ({ selectedImage }) => {
	const [gapiClientLoaded, setGapiClientLoaded] = useState(false);
	const [accessToken, setAccessToken] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	// Initialize photos as an empty array, regardless of dummy flag initially.
	// Dummy photos will be set only AFTER login click.
	const [photos, setPhotos] = useState([]);
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const [isGapiLoading, setIsGapiLoading] = useState(true);
	const [isGisLoading, setIsGisLoading] = useState(true);
	const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
	const [hasPhotosScope, setHasPhotosScope] = useState(false); // Indicates if 'photoslibrary.readonly' scope was granted

	// The useDummyData state will be implicitly controlled by USE_DUMMY_GOOGLE_DATA
	// or set internally if real authentication fails.
	// It's crucial this defaults to USE_DUMMY_GOOGLE_DATA but can be changed by user interaction.
	const [currentModeIsDummy, setCurrentModeIsDummy] = useState(USE_DUMMY_GOOGLE_DATA);

	const tokenClient = useRef(null);

	// Use useCallback for memoizing functions that depend on state and props
	const handleSignOut = useCallback(() => {
		if (!currentModeIsDummy && window.google && window.google.accounts && window.google.accounts.id) {
			// For real sign-out, disable auto-select
			window.google.accounts.id.disableAutoSelect();
		}

		setAccessToken(null);
		setUserProfile(null);
		setSelectedPhoto(null);
		setHasPhotosScope(false);
		setPhotos([]); // Clear photos on sign out
		setCurrentModeIsDummy(USE_DUMMY_GOOGLE_DATA); // Revert to initial dummy mode state
		alert("You have been disconnected from Google Photos.");
	}, [currentModeIsDummy]);

	const getUserProfileFromAccessToken = useCallback(
		async (token) => {
			if (currentModeIsDummy) {
				// Simulate profile fetch
				await new Promise((resolve) => setTimeout(resolve, 300));
				return {
					name: "Google User",
					imageUrl: "https://dummyimage.com/100x100/DB4437/fff&text=G", // Generic Google-like avatar
					email: "dummy@google.com",
				};
			} else {
				try {
					const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (!response.ok) {
						throw new Error(`Failed to fetch user info: ${response.status} - ${response.statusText}`);
					}
					const profileData = await response.json();
					return {
						name: profileData.name,
						imageUrl: profileData.picture,
						email: profileData.email,
					};
				} catch (error) {
					console.error("Error fetching user profile from token:", error);
					throw error;
				}
			}
		},
		[currentModeIsDummy]
	);

	const handleFetchPhotos = useCallback(
		async (token) => {
			if (currentModeIsDummy) {
				// Simulate photo fetch
				setIsLoadingPhotos(true);
				await new Promise((resolve) => setTimeout(resolve, 800));
				setPhotos(DUMMY_GOOGLE_PHOTOS);
				setIsLoadingPhotos(false);
				return;
			}

			if (!token) {
				console.error("No access token available to fetch photos.");
				return;
			}
			if (!hasPhotosScope) {
				console.warn("Photos scope not granted. Cannot fetch photos.");
				alert("Permission to access Google Photos was not granted. Please sign in again and approve it.");
				return;
			}

			setIsLoadingPhotos(true);
			try {
				const response = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=25", {
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("Failed to fetch photos:", errorData);
					alert(`Error: ${errorData.error.message}`);
					return;
				}

				const data = await response.json();
				setPhotos(data.mediaItems || []);
				console.log("Photos fetched:", data.mediaItems);
				if (!data.mediaItems || data.mediaItems.length === 0) {
					alert("No photos found in your Google Photos library.");
				}
			} catch (err) {
				console.error("Network error fetching photos:", err);
				alert("Something went wrong while fetching your photos.");
			} finally {
				setIsLoadingPhotos(false);
			}
		},
		[currentModeIsDummy, hasPhotosScope] // Removed handleSignOut from dependency as it's not directly used for fetching logic itself.
	);

	const handleAccessTokenResponse = useCallback(
		async (response) => {
			if (currentModeIsDummy) {
				// In dummy mode, this callback means we're simulating a successful auth
				setAccessToken("DUMMY_ACCESS_TOKEN");
				setHasPhotosScope(true); // Assume scope granted for dummy mode
				const profileData = await getUserProfileFromAccessToken("DUMMY_ACCESS_TOKEN");
				setUserProfile(profileData);
				await handleFetchPhotos("DUMMY_ACCESS_TOKEN");
				setIsLoadingPhotos(false);
				return;
			}

			// Real Google OAuth logic
			if (response.error) {
				console.error("Google Token Client Error:", response.error);
				alert(
					`Google Sign-In failed: ${
						response.error_description || response.error
					}. Please ensure pop-ups are allowed and origin is configured.`
				);
				// On real error, revert to dummy mode
				setCurrentModeIsDummy(true);
				setPhotos([]); // Clear real photos on error
				return;
			}

			console.log("Google Token Client Response:", response);

			const newAccessToken = response.access_token;
			const grantedScopesArray = (response.scope || "").split(" ").filter(Boolean);

			const isPhotosScopeGranted = grantedScopesArray.includes(SCOPES);
			setHasPhotosScope(isPhotosScopeGranted);

			if (newAccessToken) {
				setAccessToken(newAccessToken);
				setCurrentModeIsDummy(false); // Successfully signed in, disable dummy mode

				try {
					if (grantedScopesArray.includes("email") || grantedScopesArray.includes("profile")) {
						const profileData = await getUserProfileFromAccessToken(newAccessToken);
						if (profileData) {
							setUserProfile(profileData);
							console.log("User signed in via Token Client. Profile:", profileData);
						} else {
							console.warn("Could not retrieve user profile data.");
							setUserProfile({ name: "Google User", imageUrl: "" });
						}
					} else {
						console.warn("Profile/email scopes not granted. Cannot fetch user profile.");
						setUserProfile({ name: "Google User", imageUrl: "" });
					}

					if (isPhotosScopeGranted) {
						handleFetchPhotos(newAccessToken);
					} else {
						alert("Google Photos access was not granted. Please approve the permission to use this feature.");
						// If photos scope not granted, revert to dummy mode for photos display
						setCurrentModeIsDummy(true);
						setPhotos([]); // Clear real photos
					}
				} catch (profileError) {
					console.error("Failed to get user profile after token acquisition:", profileError);
					alert("Signed in but couldn't get user profile. Try again.");
					setCurrentModeIsDummy(true); // Revert to dummy mode on profile fetch failure
					setPhotos([]); // Clear real photos
				}
			} else {
				console.error("No access token received from Token Client callback.");
				alert("Failed to get access token from Google. Please try again.");
				setCurrentModeIsDummy(true); // Revert to dummy mode on no token
				setPhotos([]); // Clear real photos
			}
		},
		[currentModeIsDummy, getUserProfileFromAccessToken, handleFetchPhotos]
	);

	const initGapiClient = useCallback(() => {
		if (currentModeIsDummy) {
			setGapiClientLoaded(true);
			setIsGapiLoading(false);
			console.log("GAPI client (for Photos API calls) init skipped/simulated in dummy mode.");
			return;
		}

		window.gapi.client
			.init({})
			.then(() => {
				setGapiClientLoaded(true);
				setIsGapiLoading(false);
				console.log("GAPI client (for Photos API calls) initialized.");
				if (accessToken && hasPhotosScope) {
					handleFetchPhotos(accessToken);
				}
			})
			.catch((error) => {
				console.error("Error initializing GAPI client for Photos API calls:", error);
				alert("Failed to initialize Google API client. Please check your network or try again.");
				setCurrentModeIsDummy(true); // Revert to dummy mode on GAPI init failure
				setPhotos([]); // Clear real photos
			});
	}, [accessToken, hasPhotosScope, currentModeIsDummy, handleFetchPhotos]);

	useEffect(() => {
		// Load scripts only if not in the initial dummy mode (which implies we are waiting for a real login, or will trigger a dummy login)
		// If USE_DUMMY_GOOGLE_DATA is true, we want scripts NOT to load initially to prevent accidental real GAuth prompts
		// We only load scripts if currentModeIsDummy is false, which means we're in real mode OR have transitioned to real mode.
		if (!USE_DUMMY_GOOGLE_DATA || (USE_DUMMY_GOOGLE_DATA && !currentModeIsDummy)) {
			const loadScripts = () => {
				// Prevent loading if already loaded by other component or a previous run
				if (document.querySelector(`script[src="https://accounts.google.com/gsi/client"]`)) {
					setIsGisLoading(false);
				} else {
					const gisScript = document.createElement("script");
					gisScript.src = "https://accounts.google.com/gsi/client";
					gisScript.async = true;
					gisScript.defer = true;
					gisScript.onload = () => {
						setIsGisLoading(false);
						if (typeof window.google?.accounts?.oauth2?.initTokenClient === "function" && !tokenClient.current) {
							tokenClient.current = window.google.accounts.oauth2.initTokenClient({
								client_id: CLIENT_ID,
								scope: `${PROFILE_SCOPES} ${SCOPES}`,
								prompt: "consent",
								enable_granular_consent: true,
								callback: handleAccessTokenResponse,
							});
							console.log("Google Token Client initialized successfully with granular consent enabled.");
						}
					};
					gisScript.onerror = (e) => {
						console.error("Failed to load GIS script:", e);
						setIsGisLoading(false);
						setCurrentModeIsDummy(true); // Fallback to dummy mode on script load failure
						setPhotos([]); // Clear any real photos on error
					};
					document.body.appendChild(gisScript);
				}

				if (document.querySelector(`script[src="https://apis.google.com/js/api.js"]`)) {
					setIsGapiLoading(false);
					window.gapi.load("client", initGapiClient); // Ensure gapi client is initialized if script already present
				} else {
					const gapiScript = document.createElement("script");
					gapiScript.src = "https://apis.google.com/js/api.js";
					gapiScript.onload = () => {
						setIsGapiLoading(false);
						window.gapi.load("client", initGapiClient);
					};
					gapiScript.onerror = (e) => {
						console.error("Failed to load GAPI script:", e);
						setIsGapiLoading(false);
						setCurrentModeIsDummy(true); // Fallback to dummy mode on script load failure
						setPhotos([]); // Clear any real photos on error
					};
					document.body.appendChild(gapiScript);
				}
			};
			loadScripts();
		} else if (USE_DUMMY_GOOGLE_DATA && !accessToken) {
			// In initial dummy mode, ensure loading indicators are off until user clicks login
			setIsGisLoading(false);
			setIsGapiLoading(false);
			setGapiClientLoaded(false); // Explicitly false initially for dummy mode
			setPhotos([]); // Ensure no photos are displayed initially
		}

		// Cleanup function for scripts (only for real mode where they are appended)
		return () => {
			// If the component is unmounting, ensure scripts are removed only if they were added by THIS component
			// This is a bit tricky with shared scripts, so a simple check is usually sufficient.
			// For a production app, you might manage script loading globally or via a dedicated hook.
			const existingGisScript = document.querySelector(`script[src="https://accounts.google.com/gsi/client"]`);
			const existingGapiScript = document.querySelector(`script[src="https://apis.google.com/js/api.js"]`);
			if (existingGisScript) existingGisScript.remove(); // Use .remove() for modern browsers
			if (existingGapiScript) existingGapiScript.remove();
		};
	}, [
		accessToken,
		userProfile,
		currentModeIsDummy, // Dependency for re-running effect on mode change
		initGapiClient,
		handleAccessTokenResponse,
		getUserProfileFromAccessToken,
		handleFetchPhotos,
	]);

	const handleGoogleSignIn = () => {
		if (USE_DUMMY_GOOGLE_DATA) {
			// This condition specifically uses the global flag
			// Simulate login process for dummy mode
			setIsLoadingPhotos(true);
			setAccessToken("DUMMY_CLICK_TOKEN");
			setHasPhotosScope(true);
			setCurrentModeIsDummy(true); // Explicitly set to dummy mode

			// Simulate profile and photo fetch
			getUserProfileFromAccessToken("DUMMY_CLICK_TOKEN").then((profile) => {
				setUserProfile(profile);
				handleFetchPhotos("DUMMY_CLICK_TOKEN");
			});
			return;
		}

		// Real Google OAuth logic
		if (tokenClient.current) {
			// Ensure currentModeIsDummy is set to false as we are attempting real login
			setCurrentModeIsDummy(false);
			tokenClient.current.requestAccessToken();
		} else {
			console.error("Google Token Client not initialized. Are scripts loaded?");
			alert("Google services are still loading. Please try again in a moment.");
		}
	};

	const handlePhotoClick = (photo) => {
		setSelectedPhoto(photo);
	};

	// Determine which photos to display.
	// If not logged in (and in dummy mode), photosToDisplay should be empty initially.
	// Only show DUMMY_GOOGLE_PHOTOS if accessToken is present (meaning logged in, even if dummy)
	const photosToDisplay = accessToken && currentModeIsDummy ? DUMMY_GOOGLE_PHOTOS : photos;

	console.log(
		"Google Photos Picker Component Rendered. Current Mode is Dummy:",
		currentModeIsDummy,
		"AccessToken:",
		!!accessToken,
		"Photos Count:",
		photos.length
	);

	return (
		<Box sx={{ p: 4, maxWidth: 800, mx: "auto", border: "1px solid #ccc", borderRadius: "8px", mt: 4 }}>
			<Typography variant="h5" gutterBottom>
				Select Photo from Google Photos
			</Typography>

			{!accessToken || !userProfile ? (
				// State: Not signed in
				<Box>
					<Button
						variant="contained"
						startIcon={<Google />}
						onClick={handleGoogleSignIn}
						// Disable if loading scripts (for real mode) or if tokenClient not ready
						disabled={
							(!USE_DUMMY_GOOGLE_DATA && (isGapiLoading || isGisLoading || !tokenClient.current)) ||
							(USE_DUMMY_GOOGLE_DATA && isLoadingPhotos)
						}
					>
						{isLoadingPhotos ? (
							<CircularProgress size={24} color="inherit" />
						) : USE_DUMMY_GOOGLE_DATA ? (
							" Google Photos Login"
						) : (
							"Sign in with Google Photos"
						)}
					</Button>
					{!USE_DUMMY_GOOGLE_DATA &&
						(isGapiLoading || isGisLoading) && ( // Show loading message only for real mode
							<Typography sx={{ mt: 2, color: "text.secondary" }}>Loading Google services...</Typography>
						)}
					{/* No dummy data preview here initially */}
				</Box>
			) : (
				// State: Signed in (real or simulated)
				<Box>
					<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
						<Avatar src={userProfile?.imageUrl} alt={userProfile?.name} sx={{ mr: 2 }} />
						<Typography variant="subtitle1">{userProfile?.name}</Typography>
						<Button onClick={handleSignOut} sx={{ ml: "auto" }} size="small" color="error">
							{currentModeIsDummy ? "Disconnect" : "Disconnect Google Photos"}
						</Button>
					</Box>

					{isLoadingPhotos ? (
						<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
							<CircularProgress />
							<Typography sx={{ ml: 2 }}>Loading photos...</Typography>
						</Box>
					) : photos.length === 0 && !currentModeIsDummy ? (
						<Box sx={{ mt: 2 }}>
							<Typography variant="body1">
								No photos found in your Google Photos library or none have been loaded yet.
							</Typography>
							<Button
								variant="contained"
								onClick={() => handleFetchPhotos(accessToken)}
								disabled={!accessToken || !gapiClientLoaded || isLoadingPhotos}
								sx={{ mt: 2 }}
							>
								Load Photos
							</Button>
						</Box>
					) : (
						<></>
						// photos.length > 0 && (
						// 	<Button variant="outlined" onClick={() => setPhotos([])} sx={{ mt: 2 }}>
						// 		{currentModeIsDummy ? " Clear Photos" : "Clear Photos Display"}
						// 	</Button>
						// )
					)}

					{selectedPhoto && (
						<Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: "8px", textAlign: "center" }}>
							<Typography variant="h6" gutterBottom>
								Selected Photo:
							</Typography>
							<img
								src={selectedPhoto?.productUrl}
								alt={selectedPhoto.filename}
								style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", objectFit: "contain" }}
							/>
							<Typography variant="body2">{selectedPhoto.filename}</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => selectedImage(selectedPhoto.productUrl)}
								sx={{ mt: 2 }}
							>
								Confirm Selection
							</Button>
						</Box>
					)}

					{/* Photo display grid */}
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
									border: selectedPhoto && selectedPhoto.id === photo.id ? "2px solid primary.main" : "1px solid #eee",
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
										image={currentModeIsDummy ? photo.baseUrl : `${photo.baseUrl}=w120-h120-c`}
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
				</Box>
			)}
		</Box>
	);
};

export default GooglePhotosPicker;
