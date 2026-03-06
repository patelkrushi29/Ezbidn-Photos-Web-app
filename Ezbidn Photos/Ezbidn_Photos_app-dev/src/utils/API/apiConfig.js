const apiConfig = {
	auth: {
		login: { method: "POST", url: "/api/v1/user/login" },
		register: { method: "POST", url: "/api/v1/user/register" },
		resendOTP: { method: "POST", url: "/api/v1/user/resendOtp" },
		forgotPassword: { method: "POST", url: "/api/v1/user/forgotPassword" },
		verifyOtp: { method: "POST", url: "/api/v1/user/verifyOtp" },
		socialLogin: { method: "POST", url: "/api/v1/user/socialLogin" },
		verifyPasswordOtp: { method: "POST", url: "/api/v1/user/verifyPassOtp" },
		resetPassword: { method: "POST", url: "/api/v1/user/resetPassword" },
		guestLogin: { method: "POST", url: "/api/v1/user/guestLogin" },
	},

	user: {
		getProfile: { method: "GET", url: "/api/v1/user/viewProfile" },
		updateProfile: { method: "PUT", url: "/api/v1/user/editProfile" },
		changePassword: { method: "PUT", url: "/api/v1/user/changePassword" },
		findFederalInmate: { method: "GET", url: "/api/v1/inmate/findFederalInmate/:inmateId" },
		saveInmate: { method: "POST", url: "/api/v1/inmate/saveInmate" },
		inmateList: { method: "GET", url: "/api/v1/inmate/inmateList" },
		getInmateDetailById: { method: "GET", url: "/api/v1/inmate/getInmateDetailById/:id" },
		removeInmate: { method: "PUT", url: "/api/v1/inmate/removeInmate/:id" },
		contactUsForm: { method: "POST", url: "/api/v1/user/contactUsForm" },
		pricingTiers: { method: "GET", url: "/api/v1/user/pricingTiers" },
		imageUpload: { method: "POST", url: "/api/v1/user/imageUpload" },
		deleteUploadedImage: { method: "PUT", url: "/api/v1/user/deleteUploadedImage/:imageId" },
		imageUploadedList: { method: "GET", url: "/api/v1/user/imageUploadedList/:inmateId" },
		orderList: { method: "GET", url: "/api/v1/user/getAllOrders" },
		checkoutOrder: { method: "POST", url: "/api/v1/user/checkoutOrder" },
	},

	admin: {
		getAllUsers: { method: "GET", url: "/api/v1/admin/listUsers/:page/:limit/:query" },
		listPricingTier: { method: "GET", url: "/api/v1/admin/listPricingTier" },
		getPricingTierById: { method: "GET", url: "/api/v1/admin/getPricingTierById/:tierId" },
		updatePricingTier: { method: "GET", url: "/api/v1/admin/updatePricingTier/:tierId" },
		putUpdatePricingTier: { method: "PUT", url: "/api/v1/admin/updatePricingTier/:tierId" },
		listContactUsers: { method: "GET", url: "/api/v1/admin/listContactUsers/:pageNo/:limit/:searchText" },
		updateContactUsFlag: { method: "PUT", url: "/api/v1/admin/updateContactUsFlag/:id" },
		listOrders: { method: "GET", url: "/api/v1/admin/listOrders/:userId/:pageNo/:limit/:searchText" },
		getOrderDetailsById: { method: "GET", url: "/api/v1/admin/getOrderDetailsById/:orderId" },
		updateOrder: { method: "PUT", url: "/api/v1/admin/updateOrder/:id" },
	},
};

export default apiConfig;
