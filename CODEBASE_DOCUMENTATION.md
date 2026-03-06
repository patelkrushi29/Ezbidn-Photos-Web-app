# EzBidn Photos — Codebase Documentation

**Last Updated:** March 2026
**Repo Contents:** Web App + Mobile App (iOS & Android)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Web Application](#3-web-application)
4. [Mobile Application](#4-mobile-application)
5. [API Reference](#5-api-reference)
6. [Feature Coverage Map (vs. Estimation Plan)](#6-feature-coverage-map-vs-estimation-plan)
7. [Tech Stack Summary](#7-tech-stack-summary)
8. [Deployment](#8-deployment)

---

## 1. Project Overview

EzBidn Photos is a multi-platform service that lets users send printed photos to incarcerated individuals. The system consists of:

- **Web App** — React/Vite SPA with an admin dashboard
- **Mobile App** — React Native app targeting iOS and Android
- **Backend API** — External REST API at `https://api.ezbidn.com/api/v1`

Core user flow: Register → Add inmate → Upload photos → Pay → Order printed & shipped.

---

## 2. Repository Structure

```
Ezbidn Photos-20260113T022527Z-3-001/
├── Ezbidn_Photos_app-dev/          # Web application (React + Vite)
├── Ezbidn_Photos_Mobile_App-main/  # Mobile app (React Native)
└── EzBidn Mobile App - Estimation.xlsx  # Original project plan (reference only)
```

---

## 3. Web Application

**Path:** `Ezbidn_Photos_app-dev/`
**Framework:** React 19 + Vite 6
**Deployed to:** AWS Elastic Beanstalk (via GitHub Actions on `dev` branch push)

### 3.1 Directory Layout

```
Ezbidn_Photos_app-dev/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Root component
│   ├── routes/
│   │   └── AppRoutes.jsx           # All route definitions (lazy-loaded)
│   ├── pages/                      # Top-level page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── User.jsx
│   │   ├── Account.jsx
│   │   ├── Profille.jsx
│   │   ├── Contact.jsx
│   │   ├── Faq.jsx
│   │   ├── About.jsx
│   │   └── Work.jsx
│   ├── components/                 # Feature components
│   │   ├── Home/                   # Landing page sections (SectionOne–Seven)
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── Login/                  # Auth flow
│   │   ├── Accounts/inmates/       # Inmate management & ordering
│   │   ├── Accounts/orders/
│   │   ├── Accounts/payments/
│   │   ├── Accounts/subscriptions/
│   │   ├── ADMIN/                  # Admin dashboard
│   │   ├── Profile/
│   │   ├── Payments/
│   │   ├── Policies/               # Privacy, Refund, Terms
│   │   ├── ContactUs/
│   │   ├── AboutUs/
│   │   ├── FAQ/
│   │   └── HowItWork/
│   ├── layouts/
│   │   ├── UserLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── profileSlice.js
│   │       └── Admin/userSlice.js
│   ├── utils/
│   │   ├── API/api.js              # Axios instance
│   │   ├── API/apiConfig.js        # Endpoint constants
│   │   ├── browserStorage.js       # Encrypted localStorage
│   │   └── Loader/
│   └── api/
│       └── apiHandler.js           # Axios with error handling
├── public/assets/                  # Static images and SVGs
├── server.js                       # Express server (production)
├── vite.config.js
├── tailwind.config.js
└── .github/workflows/deploy-react-eb.yml
```

### 3.2 Authentication Components

Location: `src/components/Login/`

| File | Purpose |
|------|---------|
| `LoginForm.jsx` | Email/password login form |
| `Register.jsx` | New user registration |
| `ForgotPassword.jsx` | Request password reset |
| `ConfirmPassword.jsx` | Enter new password |
| `OAuthLogin.jsx` | Google + Facebook OAuth buttons |
| `GuestLogin.jsx` | Guest access flow |
| `Otp.jsx` | OTP entry screen |

### 3.3 Inmate & Order Flow

Location: `src/components/Accounts/inmates/`

| Folder/File | Purpose |
|-------------|---------|
| `AddInmate/` | Add a new inmate (federal or state) |
| `FederalInmates/` | Federal inmate search |
| `StateInmates/` | State inmate search |
| `InmateDetails/` | View inmate details |
| `InmateAddCard/` | Select inmate for an order |
| `OrderingTo/` | Confirm who order is going to |
| `Shipping/` | Shipping info display |
| `Rules/` | Content/shipping policy rules |
| `OrderConfirmed/` | Success screen |
| `OrderFailed/` | Failure screen |
| `uploadImage/` | Photo upload (includes Facebook, Google, Instagram photo pickers) |

### 3.4 Admin Dashboard

Location: `src/components/ADMIN/`

| Folder | Purpose |
|--------|---------|
| `Dashboard/` | Overview stats and charts |
| `UserList/` | View / enable / disable users |
| `OrdersList/` | All orders; drill into `OrderDetail/` |
| `PricingList/` | Set price-per-photo, shipping rates |
| `MessagesList/` | Contact/support messages |
| `Setting/` | Admin settings panel |
| `Navbar/AdminNavbar.jsx` | Admin navigation bar |

### 3.5 State Management (Redux)

| Slice | File | Manages |
|-------|------|---------|
| Auth | `redux/slices/authSlice.js` | Login, register, OTP, password reset, token storage |
| Profile | `redux/slices/profileSlice.js` | User profile data |
| Admin Users | `redux/slices/Admin/userSlice.js` | Admin user list, enable/disable |

---

## 4. Mobile Application

**Path:** `Ezbidn_Photos_Mobile_App-main/`
**Framework:** React Native 0.78 + React 19
**Platforms:** iOS (Swift AppDelegate, CocoaPods) + Android (Gradle)
**API Base URL:** `https://api.ezbidn.com/api/v1`

### 4.1 Directory Layout

```
Ezbidn_Photos_Mobile_App-main/
├── src/                          # All JS/TS screen and logic files
│   ├── services/
│   │   └── apiService.js         # Centralized API calls
│   ├── utils/
│   │   └── storage.js            # AsyncStorage + Keychain
│   └── NetworkUtils/
│       └── NetworkUtils.js       # Connectivity checks
├── android/                      # Android native project
├── ios/                          # iOS native project (Xcode + CocoaPods)
├── assets/                       # Images and media
├── __tests__/                    # Jest test files
├── App.js                        # Root component + navigation setup
└── index.js                      # Native entry point
```

### 4.2 Screen Inventory

#### Auth Screens

| File | Screen |
|------|--------|
| `SplashScreen.js` | Animated launch/splash |
| `WelcomeScreen.js` | Onboarding / welcome |
| `LoginScreen.js` | Email login |
| `SignupScreen.js` | Registration |
| `VerifyScreen.js` | OTP / email verification |
| `ForgotScreen.js` | Forgot password request |
| `ResetPassScreen.js` | Enter new password (via reset link) |
| `ChangePassScreen.js` | Change password (authenticated) |

#### Profile Screens

| File | Screen |
|------|--------|
| `ProfileScreen.js` | View profile |
| `SideProfileScreen.js` | Account settings / side menu |
| `EditProfile.js` | Edit name, image, info |

#### Inmate Screens

| File | Screen |
|------|--------|
| `InmatesScreen.js` | Inmate management home |
| `InmatesListScreen.js` | User's saved inmates |
| `AllInmatesList.js` | Search results view |
| `AddFederal.js` | Add federal inmate (BOP API lookup) |
| `StateInmateScreen.js` | Add/search state inmate |
| `InmateDetailsScreen.js` | Individual inmate details |
| `ConfirmationInmate.js` | Confirm inmate addition |

#### Order / Photo Screens

| File | Screen |
|------|--------|
| `ImportPhotosScreen.js` | Pick photos from device |
| `SendPhotosScreen.js` | Review selected photos before submitting |
| `OrdersScreen.js` | Order history list |
| `OrderDetailsView.js` | Single order detail |
| `SuccessOrderView.js` | Order placed confirmation |
| `FailedOrderView.js` | Order failure message |

#### Payment Screens

| File | Screen |
|------|--------|
| `PaymentMethodScreen.js` | List / select saved cards |
| `StripeCheckoutScreen.js` | Stripe payment form |
| `SubscriptionScreen.js` | View subscription plans |

#### Support / Info Screens

| File | Screen |
|------|--------|
| `NotificationAlertScreen.js` | In-app notifications |
| `FAQScreen.js` | Frequently asked questions |
| `SupportCenterScreen.js` | Help center |
| `AboutUsScreen.js` | About EzBidn |
| `PrivacyPolicyScreen.js` | Privacy policy |
| `TermPolicyScreen.js` | Terms of service |
| `RefundScreen.js` | Refund policy |

### 4.3 Shared Utilities

| File | Purpose |
|------|---------|
| `CustomHeader.js` | Reusable navigation header |
| `LoadingIndicator.js` | Spinner component |
| `LoadingContext.js` | Context provider for loading state |
| `NetworkUtils/NetworkUtils.js` | Detect online/offline status |
| `utils/storage.js` | AsyncStorage reads/writes + Keychain for secure data |
| `services/apiService.js` | All API calls: auth, inmates, orders, payments, uploads |

### 4.4 Native Platform Files

**iOS** (`ios/EzbidnApp/`)
- `AppDelegate.swift` — App lifecycle
- `Info.plist` — App permissions and metadata
- `EzbidnApp.entitlements.xml` — Capabilities (e.g., Keychain)
- `PrivacyInfo.xcprivacy.xml` — Privacy manifest (required by Apple)
- `Podfile` — CocoaPods dependency declarations

**Android** (`android/app/`)
- `build.gradle` — App-level build config
- `proguard-rules.pro` — Release build obfuscation

---

## 5. API Reference

**Base URL:** `https://api.ezbidn.com/api/v1`
**Auth header:** `x-auth-token: <JWT>`
**Device tracking:** UUID sent with each request

### Endpoints

| Group | Endpoint | Method | Description |
|-------|----------|--------|-------------|
| Auth | `/user/login` | POST | Email + password login |
| Auth | `/user/register` | POST | New account registration |
| Auth | `/user/socialLogin` | POST | Google / Facebook OAuth login |
| Auth | `/user/guestLogin` | POST | Guest session |
| Auth | `/user/verifyOtp` | POST | Verify OTP code |
| Auth | `/user/forgotPassword` | POST | Request password reset |
| Auth | `/user/resetPassword` | POST | Submit new password |
| Profile | `/user/profile` | GET | Fetch user profile |
| Profile | `/user/profile` | PUT | Update profile |
| Inmates | `/inmate/findFederalInmate/:id` | GET | BOP federal inmate lookup |
| Inmates | `/inmate/saveInmate` | POST | Save inmate to user account |
| Inmates | `/inmate/inmateList` | GET | List user's inmates |
| Orders | `/user/checkoutOrder` | POST | Submit order + photos |
| Orders | `/user/getAllOrders` | GET | Order history |
| Orders | `/user/getOrderDetailsById/:id` | GET | Single order details |
| Payments | `/user/pricingTiers` | GET | Pricing info |
| Media | `/user/imageUpload` | POST | Upload photo(s) |

**External inmate lookup (BOP):**
- By register number: `https://www.bop.gov/PublicInfo/execute/inmateloc?todo=query&output=json&inmateNumType=IRN&inmateNum=<NUMBER>`
- By name: `https://www.bop.gov/PublicInfo/execute/inmateloc?todo=query&output=json&nameFirst=<FIRST>&nameLast=<LAST>`

---

## 6. Feature Coverage Map (vs. Estimation Plan)

The Excel file `EzBidn Mobile App - Estimation.xlsx` defines the planned scope. The table below maps each planned item to its implementation in the codebase.

**Status key:**
`DONE` — Feature exists in codebase
`PARTIAL` — Partially implemented or exists in one platform only
`NOT FOUND` — No matching code located

---

### Module 1 — UI Designs & Navigation

| Planned Task | Status | Location |
|-------------|--------|----------|
| Design creation (Figma) | — | External asset, not in repo |
| Design slicing / integration | DONE | All components in `src/components/` (web) and `src/*.js` (mobile) |
| Basic navigational flow | DONE | Web: `src/routes/AppRoutes.jsx` · Mobile: `App.js` (React Navigation stack) |
| Screen compatibility (multiple sizes) | DONE | Web: `src/hooks/ScreenSize.js` + Tailwind responsive classes · Mobile: `SafeAreaContext`, `react-native-screens` |

---

### Module 2 — Web Services / API

| Planned Task | Status | Location |
|-------------|--------|----------|
| API creation / integration | DONE | Web: `src/utils/API/api.js`, `src/api/apiHandler.js` · Mobile: `src/services/apiService.js` |

---

### Module 3 — Auth Module

| Planned Task | Status | Location |
|-------------|--------|----------|
| Onboarding / welcome screens | DONE | Mobile: `WelcomeScreen.js`, `SplashScreen.js` · Web: `Home.jsx` landing sections |
| Registration (email + verification) | DONE | Web: `components/Login/Register.jsx`, `Otp.jsx` · Mobile: `SignupScreen.js`, `VerifyScreen.js` |
| Login (email) | DONE | Web: `components/Login/LoginForm.jsx` · Mobile: `LoginScreen.js` |
| Forgot password | DONE | Web: `components/Login/ForgotPassword.jsx` · Mobile: `ForgotScreen.js` |
| Guest / explore app | DONE | Web: `components/Login/GuestLogin.jsx` · Mobile: `LoginScreen.js` (guest path) |
| Login with Apple | PARTIAL | Mobile: dependency `@react-native-google-signin` present; no dedicated `AppleLoginScreen` found — may be inside `LoginScreen.js` |
| Login with Google | DONE | Web: `components/Login/OAuthLogin.jsx` + `@react-oauth/google` · Mobile: `apiService.js` socialLogin + `@react-native-google-signin/google-signin` |
| Login with Facebook | DONE | Web: `react-facebook-login` package + `OAuthLogin.jsx` · Mobile: `react-native-fbsdk-next` |

---

### Module 4 — Profile Module

| Planned Task | Status | Location |
|-------------|--------|----------|
| View profile | DONE | Web: `components/Profile/index.jsx` · Mobile: `ProfileScreen.js` |
| Update profile | DONE | Web: `components/Profile/index.jsx` · Mobile: `EditProfile.js` |
| Delete account | PARTIAL | Not explicitly found as a standalone screen; may need verification |
| Change password | DONE | Web: `components/Login/ConfirmPassword.jsx` · Mobile: `ChangePassScreen.js` |

---

### Module 5 — Inmate Module

| Planned Task | Status | Location |
|-------------|--------|----------|
| Add inmate (federal API lookup) | DONE | Web: `components/Accounts/inmates/AddInmate/`, `FederalInmates/` · Mobile: `AddFederal.js`, BOP API in `apiService.js` |
| Facility / state inmate search | DONE | Web: `components/Accounts/inmates/StateInmates/` · Mobile: `StateInmateScreen.js` |
| List of inmates | DONE | Web: `components/Accounts/inmates/index.jsx` · Mobile: `InmatesListScreen.js`, `AllInmatesList.js` |
| Manage inmate profile (edit/delete) | DONE | Web: `components/Accounts/inmates/InmateDetails/` · Mobile: `InmateDetailsScreen.js` |

---

### Module 6 — Order Module

| Planned Task | Status | Location |
|-------------|--------|----------|
| Add / import photos | DONE | Web: `components/Accounts/inmates/uploadImage/` (Facebook, Google, Instagram pickers) · Mobile: `ImportPhotosScreen.js` |
| Show selected photos (grid preview) | DONE | Web: `uploadImage/PhotoPreview.jsx` · Mobile: `SendPhotosScreen.js` |
| Add captions | NOT FOUND | Removed from scope per estimation notes |
| Submit photos (upload to cloud) | DONE | Web: upload components + `apiConfig.js` `/user/imageUpload` · Mobile: `apiService.js` imageUpload |
| Select inmate for order | DONE | Web: `components/Accounts/inmates/InmateAddCard/`, `OrderingTo/` · Mobile: inmate selection in order flow |
| Review order (photo count, cost breakdown) | DONE | Web: `components/Accounts/inmates/Shipping/` · Mobile: `SendPhotosScreen.js` order summary |
| Payment / checkout + confirmation | DONE | Web: `components/Payments/index.jsx`, `Accounts/payments/` · Mobile: `StripeCheckoutScreen.js`, `SuccessOrderView.js` |
| Order history | DONE | Web: `components/Accounts/orders/Orders.jsx` · Mobile: `OrdersScreen.js` |
| Order detail view | DONE | Web: `components/Accounts/OrderStatus/OrderConfirmation.jsx` · Mobile: `OrderDetailsView.js` |
| Order confirmed / failed screens | DONE | Web: `Accounts/inmates/OrderConfirmed/`, `OrderFailed/` · Mobile: `SuccessOrderView.js`, `FailedOrderView.js` |
| Content / shipping rules | DONE | Web: `components/Accounts/inmates/Rules/` |
| Performance / load time management | PARTIAL | Web: `react-lazy-load-image-component`, lazy route loading · Mobile: no explicit performance monitoring found |

---

### Module 7 — Payment Module

| Planned Task | Status | Location |
|-------------|--------|----------|
| Stripe library integration | DONE | Web: `@stripe/react-stripe-js`, `@stripe/stripe-js` · Mobile: Stripe in `StripeCheckoutScreen.js` |
| List saved cards | DONE | Web: `components/Accounts/payments/index.jsx` · Mobile: `PaymentMethodScreen.js` |
| Add card | DONE | Web + Mobile: handled via Stripe secure elements |
| Delete card | PARTIAL | UI present; verify API endpoint in `apiService.js` |
| Google Pay | PARTIAL | Android-only per plan; not explicitly confirmed in `StripeCheckoutScreen.js` |
| Apple Pay | PARTIAL | iOS-only per plan; not explicitly confirmed in `StripeCheckoutScreen.js` |
| Subscription management | DONE | Web: `components/Accounts/subscriptions/index.jsx` · Mobile: `SubscriptionScreen.js` |

---

### Module 8 — Notifications

| Planned Task | Status | Location |
|-------------|--------|----------|
| Firebase push notifications | PARTIAL | Mobile: `NotificationAlertScreen.js` present; Firebase dependency not confirmed in `package.json` |
| Order update notifications | DONE | Web: `components/Notification/index.jsx` · Mobile: `NotificationAlertScreen.js` |
| Email notifications | DONE | Handled by backend API on order events |

---

### Module 9 — Testing

| Planned Task | Status | Location |
|-------------|--------|----------|
| Manual / Jest test setup | DONE | Web: ESLint + Vite test-ready · Mobile: `jest.config.js`, `__tests__/` directory, Jest 29 |

---

### Module 10–15 — Admin Panel

| Planned Task | Status | Location |
|-------------|--------|----------|
| Admin login + theme setup | DONE | Web: `src/layouts/AdminLayout.jsx`, `components/ADMIN/Navbar/AdminNavbar.jsx` |
| User management (enable/disable) | DONE | Web: `components/ADMIN/UserList/index.jsx` + `redux/slices/Admin/userSlice.js` |
| Analytics / revenue reports | DONE | Web: `components/ADMIN/Dashboard/index.jsx` (Chart.js + MUI DataGrid) |
| Pricing management | DONE | Web: `components/ADMIN/PricingList/index.jsx` |
| Order management | DONE | Web: `components/ADMIN/OrdersList/index.jsx` + `OrderDetail/index.jsx` |
| Messages / support | DONE | Web: `components/ADMIN/MessagesList/index.jsx` |
| Admin settings | DONE | Web: `components/ADMIN/Setting/index.jsx` |
| Facility management | NOT FOUND | No `FacilityManagement` component in admin panel (replaced by analytics in revised estimate) |
| Admin panel testing | DONE | Covered by Jest setup |

---

### Module 16 — Landing Page

| Planned Task | Status | Location |
|-------------|--------|----------|
| Landing page (app workflow explanation) | DONE | Web: `src/pages/Home.jsx` + `components/Home/SectionOne.jsx` through `SectionSeven.jsx`, `components/HowItWork/index.jsx` |

---

### Items Noted as Out-of-Scope in Estimation (confirmed absent)

| Item | Notes |
|------|-------|
| PayPal integration | Not present — Stripe only |
| Subscription billing (recurring) | Basic subscription UI exists; recurring payment backend not confirmed |
| Tablet layout | Not implemented — portrait phone only |
| Dark mode | Not implemented |
| Web app login/register on landing page | Login is a separate route, not embedded in landing page |
| Caption feature | Explicitly removed from scope |

---

## 7. Tech Stack Summary

| Layer | Web App | Mobile App |
|-------|---------|-----------|
| UI Framework | React 19 + Vite 6 | React Native 0.78 |
| Styling | Tailwind CSS + MUI 6 + Emotion | React Native Paper + RN StyleSheet |
| Navigation | React Router DOM 7 | React Navigation 7 |
| State | Redux Toolkit 2 | React Context + AsyncStorage |
| Forms | React Hook Form + Yup | Custom + Dropdown Picker |
| Payments | Stripe (react-stripe-js) | Stripe (StripeCheckoutScreen) |
| Auth (OAuth) | Google OAuth + Facebook Login | Google Sign-In SDK + FBSDK Next |
| HTTP | Axios 1.8 | Axios 1.8 |
| Secure Storage | crypto-js (encrypted localStorage) | React Native Keychain + AsyncStorage |
| Animation | Framer Motion 12 | React Native Reanimated 3 |
| File Upload | react-dropzone | react-native-image-picker + RN FS |
| Charts / Tables | Chart.js + MUI DataGrid | — |
| Testing | Jest (Vite-compatible) | Jest 29 + RN test renderer |
| CI/CD | GitHub Actions → AWS Elastic Beanstalk | Manual (Xcode / Gradle) |

---

## 8. Deployment

### Web App

**Trigger:** Push to `dev` branch
**Pipeline:** `.github/workflows/deploy-react-eb.yml`

```
Push to dev
  → Install Node 20
  → npm run build  (Vite → dist/)
  → Zip: dist/ + node_modules/ + Procfile + server.js
  → Deploy zip to AWS Elastic Beanstalk
```

**Runtime:** Express (`server.js`) serves the built React SPA on Elastic Beanstalk.
**Port:** 8080 (configured in `vite.config.js` preview)

### Mobile App

**iOS:**
1. `cd ios && pod install`
2. Open `ios/EzbidnApp.xcworkspace` in Xcode
3. Set signing team in project settings
4. Archive → Distribute (App Store or TestFlight)

**Android:**
1. `cd android && ./gradlew assembleRelease`
2. APK/AAB output in `android/app/build/outputs/`
3. Upload to Google Play Console

### Environment Variables

Web app reads from `.env` (not committed). Required keys should include:
- Stripe publishable key
- Google OAuth client ID
- Facebook App ID
- API base URL

---

## Notes & Known Gaps

1. **Web API base URL** is set to `https://api.example.com` placeholder in `src/api/apiHandler.js`. Production URL (`https://api.ezbidn.com/api/v1`) is only confirmed in the mobile `apiService.js`.
2. **Delete account** screen (required by Apple) — not found as an explicit standalone screen; confirm it is present within `SideProfileScreen.js` or `EditProfile.js`.
3. **Firebase (push notifications)** — `NotificationAlertScreen.js` exists but Firebase SDK (`@react-native-firebase/*`) was not confirmed in `package.json`. Verify if Firebase is configured.
4. **Apple Pay / Google Pay** — Payment screens use Stripe; native wallet integrations were planned but not explicitly confirmed in source.
5. **Facility Management (Admin)** — The initial estimate included this; the revised estimate replaced it with an analytics dashboard. No facility admin component exists, which matches the revised scope.
6. **Caption feature** — Deliberately excluded per revised scope.
