import React from "react";
import {
	Box,
	Container,
	CardContent,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { fontSizesMUI } from "../../../utils/muiFonts";
import "./dashboard.css";
const DashboardSection = ({ gridColumn, gridRow, children }) => {
	return (
		<Box
			sx={{
				gridColumn: gridColumn,
				gridRow: gridRow,
				backgroundColor: "#f5f5f5",
				border: "1px solid #ddd",
				borderRadius: "8px",
				p: 2,
				boxShadow: 2,
				overflow: "hidden",
			}}
		>
			{children}
		</Box>
	);
};

const latestUsers = [
	{ id: 1, name: "John Doe", email: "john@example.com", joined: "2025-03-15" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", joined: "2025-03-14" },
	{ id: 3, name: "Alex Johnson", email: "alex@example.com", joined: "2025-03-13" },
];

const latestOrders = [
	{ id: 101, orderId: "ORD12345", status: "Processing", amount: "$120.00" },
	{ id: 102, orderId: "ORD12346", status: "Completed", amount: "$85.50" },
	{ id: 103, orderId: "ORD12347", status: "Shipped", amount: "$45.75" },
];

const barChartData = {
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
	datasets: [
		{
			label: "Orders Placed",
			data: [120, 190, 300, 500, 200, 300],
			backgroundColor: "rgba(54, 162, 235, 0.6)",
		},
	],
};

const pieChartData = {
	labels: ["Basics", "Premiunm", "Standard"],
	datasets: [
		{
			data: [300, 200, 150],
			backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
		},
	],
};

// Main Dashboard Layout
const AdminDashboard = () => {
	return (
		<Container
			maxWidth="xl"
			sx={{
				display: "grid",
				gridTemplateColumns: {
					xs: "repeat(4, 1fr)",
					sm: "repeat(6, 1fr)",
					md: "repeat(12, 1fr)",
				},
				gap: 2,
				p: 2,
			}}
			className="dashboard__container"
		>
			<DashboardSection
				gridColumn={{
					xs: "span 12",
					sm: "span 6",
					md: "span 4",
					lg: "span 4",
					xl: "span 4",
				}}
				gridRow="span 3"
			>
				<CardContent>
					<Typography variant="h6">Total Orders Placed</Typography>
					<Typography variant="h4">1,250</Typography>
				</CardContent>
			</DashboardSection>

			<DashboardSection
				gridColumn={{
					xs: "span 12",
					sm: "span 6",
					md: "span 4",
					lg: "span 4",
					xl: "span 4",
				}}
				gridRow="span 3"
			>
				<CardContent>
					<Typography variant="h6">Active Users</Typography>
					<Typography variant="h4">560</Typography>
				</CardContent>
			</DashboardSection>

			<DashboardSection
				gridColumn={{
					xs: "span 12",
					sm: "span 6",
					md: "span 4",
					lg: "span 4",
					xl: "span 4",
				}}
				gridRow="span 3"
			>
				<CardContent>
					<Typography variant="h6">Revenue Generated</Typography>
					<Typography variant="h4">$18,750</Typography>
				</CardContent>
			</DashboardSection>

			<DashboardSection
				gridColumn={{
					xs: "span 12",
					sm: "span 12",
					md: "span 8",
					lg: "span 8",
					xl: "span 8",
				}}
				gridRow="span 4"
			>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Monthly Order Stats
					</Typography>
					<Bar data={barChartData} />
				</CardContent>
			</DashboardSection>

			<DashboardSection
				gridColumn={{
					xs: "span 12",
					sm: "span 12",
					md: "span 4",
					lg: "span 4",
					xl: "span 4",
				}}
				gridRow="span 4"
			>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						User Based on Plan
					</Typography>
					<Pie data={pieChartData} />
				</CardContent>
			</DashboardSection>

			<DashboardSection
				gridColumn={{
					xs: "span 12",
					sm: "span 12",
					md: "span 6",
					lg: "span 6",
					xl: "span 6",
				}}
				gridRow="span 6"
			>
				<CardContent>
					<Typography variant="h6">Latest Users</Typography>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Email</TableCell>
									<TableCell>Joined</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{latestUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.name}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>{user.joined}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</DashboardSection>

			<DashboardSection
				gridColumn={{
					xs: "span 12",
					sm: "span 12",
					md: "span 6",
					lg: "span 6",
					xl: "span 6",
				}}
				gridRow="span 6"
			>
				<CardContent>
					<Typography variant="h6">Latest Orders</Typography>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Order ID</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Amount</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{latestOrders.map((order) => (
									<TableRow key={order.id}>
										<TableCell>{order.orderId}</TableCell>
										<TableCell>{order.status}</TableCell>
										<TableCell>{order.amount}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</DashboardSection>
		</Container>
	);
};

export default AdminDashboard;
