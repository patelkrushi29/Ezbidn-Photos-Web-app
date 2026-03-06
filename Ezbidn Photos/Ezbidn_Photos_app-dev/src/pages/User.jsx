import { Outlet } from "react-router-dom";
import EzBreadcrumbs from "../components/Breadcrumb";

const UserLayout = () => {
	return (
		<>
			<EzBreadcrumbs />
			<Outlet /> {/* This will load the routed component dynamically */}
		</>
	);
};

export default UserLayout;
