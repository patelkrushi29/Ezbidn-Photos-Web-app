import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "../utils/Loader";
// import StripeCheckout from "../components/Payments";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const HomeLayout = lazy(() => import("../layouts/UserLayout"));
const UserLayout = lazy(() => import("../pages/User"));
const ProfileLayout = lazy(() => import("../pages/Profille"));
const AccountLayout = lazy(() => import("../pages/Account"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
// const AdminDashboard = lazy(() => import("../components/ADMIN/Dashboard"));
const Faq = lazy(() => import("../components/FAQ"));
const HowItWorks = lazy(() => import("../components/HowItWork"));
const ContactUs = lazy(() => import("../components/ContactUs"));
const AboutUs = lazy(() => import("../components/AboutUs"));
const PrivacyPolicy = lazy(() => import("../components/Policies/Privacy"));
const RefundPolicy = lazy(() => import("../components/Policies/Refund"));
const TermsConditions = lazy(() => import("../components/Policies/Terms"));
const Orders = lazy(() => import("../components/Accounts/orders/Orders"));
const SubscriptionPlans = lazy(() => import("../components/Accounts/subscriptions"));
const PaymentMethod = lazy(() => import("../components/Accounts/payments"));
const ProfileEdit = lazy(() => import("../components/Profile"));
const Inmates = lazy(() => import("../components/Accounts/inmates"));
const AddInmateSelection = lazy(() => import("../components/Accounts/inmates/AddInmate"));
const UploadPhoto = lazy(() => import("../components/Accounts/inmates/uploadImage"));
const ShippingInfo = lazy(() => import("../components/Accounts/inmates/Shipping"));
const OrderConfirmation = lazy(() => import("../components/Accounts/inmates/OrderConfirmed"));
const StateInmates = lazy(() => import("../components/Accounts/inmates/StateInmates"));
const InmateDetailsForm = lazy(() => import("../components/Accounts/inmates/InmateDetails"));
const AddInmateForm = lazy(() => import("../components/Accounts/inmates/FederalInmates"));
const OrderingToList = lazy(() => import("../components/Accounts/inmates/OrderingTo"));
const UserLists = lazy(() => import("../components/ADMIN/UserList"));
const OrderList = lazy(() => import("../components/ADMIN/OrdersList"));
const OrderDetail = lazy(() => import("../components/ADMIN/OrdersList/OrderDetail"));
const PricingList = lazy(() => import("../components/ADMIN/PricingList"));
const MessagesList = lazy(() => import("../components/ADMIN/MessagesList"));
const OrderCancelled = lazy(() => import("../components/Accounts/inmates/OrderFailed"));

const AdminSettingsPage = lazy(() => import("../components/ADMIN/Setting"));

// Scroll to top on route change
const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
};

const AppRoutes = () => {
	const { isLoggedIn, isUserAdmin } = useSelector((state) => state.auth);

	return (
		<BrowserRouter>
			<ScrollToTop />
			<Suspense fallback={<LoadingScreen />}>
				<Routes>
					{/* User Routes */}
					<Route path="/" element={!isUserAdmin ? <HomeLayout /> : <Navigate to="/admin" />}>
						<Route index element={<Home />} />
						<Route path="user/*" element={<UserLayout />}>
							<Route path="how-it-work" element={<HowItWorks />} />
							<Route path="about" element={<AboutUs />} />
							<Route path="faq" element={<Faq />} />
							<Route path="contact" element={<ContactUs />} />
							<Route path="privacy" element={<PrivacyPolicy />} />
							<Route path="refund" element={<RefundPolicy />} />
							<Route path="terms" element={<TermsConditions />} />
							<Route path="profile/*" element={<ProfileLayout />}>
								<Route path="subscription" element={<SubscriptionPlans />} />
							</Route>
							<Route path="profile/*" element={isLoggedIn ? <ProfileLayout /> : <Navigate to="/" />}>
								<Route path="account" element={<ProfileEdit />} />
								<Route path="orders" element={<Orders />} />
								<Route path="payments" element={<PaymentMethod />} />
								<Route path="inmates" element={<Inmates />} />
							</Route>
							<Route path="account/*" element={<AccountLayout />}>
								<Route path="add-inmates" element={<AddInmateSelection />} />
								<Route path="fedral-inmates" element={<AddInmateForm />} />
								<Route path="order-failed" element={<OrderCancelled />} />
								<Route path="order-confirmed" element={<OrderConfirmation />} />
							</Route>
							<Route path="account/*" element={isLoggedIn ? <AccountLayout /> : <Navigate to="/login" />}>
								<Route path="send-to-inmates" element={<OrderingToList />} />
								<Route path="add-inmates-details" element={<InmateDetailsForm />} />
								<Route path="state-inmates" element={<StateInmates />} />
								<Route path="upload-photo" element={<UploadPhoto />} />
								<Route path="shipping-info" element={<ShippingInfo />} />
								{/* <Route path="payment-checkout" element={<StripeCheckout />} /> */}
							</Route>
						</Route>
						<Route path="login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
						<Route path="register" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
						<Route path="forgot-password" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
						<Route path="otp-verify" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
						<Route path="confirm-password" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
						<Route path="guest-user" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
					</Route>

					{/* Admin Routes */}
					<Route path="/admin/*" element={isUserAdmin ? <AdminLayout /> : <Navigate to="/" />}>
						<Route index element={<UserLists />} />
						<Route path="users" element={<UserLists />} />
						<Route path="orders" element={<OrderList />} />
						<Route path="orders/:id" element={<OrderDetail />} />
						<Route path="pricing" element={<PricingList />} />
						<Route path="messages" element={<MessagesList />} />
						<Route path="setting" element={<AdminSettingsPage />} />
					</Route>

					{/* Fallback Route */}
					<Route path="*" element={<Navigate to="/" />} />
					<Route path="/loader" element={<LoadingScreen width="100vw" height="100vh" />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
};

export default AppRoutes;
