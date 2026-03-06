import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminNavbar from "../components/ADMIN/Navbar/AdminNavbar";

const AdminLayout = () => (
	<>
		{/* <Navbar />{" "} */}
		<AdminNavbar />
		<main style={{ marginTop: "5rem" }}>
			<Outlet />
		</main>
	</>
);

export default AdminLayout;
