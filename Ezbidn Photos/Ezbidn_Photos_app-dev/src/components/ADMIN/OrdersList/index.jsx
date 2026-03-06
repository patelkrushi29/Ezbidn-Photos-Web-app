import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import apiHandler from "../../../utils/API/api";
import apiConfig from "../../../utils/API/apiConfig";
import "./orderlist.css";

const OrderList = () => {
	const [orders, setOrders] = useState([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [totalRows, setTotalRows] = useState(0);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const userId = queryParams.get("userId");

	const fetchData = async (updatedPage, updatedPageSize) => {
		try {
			setLoading(true);
			const res = await apiHandler.get(apiConfig.admin.listOrders.url, {
				userId: userId ? userId : "null",
				pageNo: updatedPage + 1,
				limit: updatedPageSize,
				searchText: "null",
			});
			if (res?.status) {
				setOrders(res?.data || []);
				setTotalRows(res?.total || 0);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData(page, pageSize);
	}, [page, pageSize]);

	// Open View Page
	const handleView = (order) => {
		navigate(`/admin/orders/${order.id}`);
	};
	const formatDate = (dateString) => {
		// Convert to ISO format and treat as UTC
		const isoString = dateString && dateString.replace(" ", "T") + "Z";
		const date = new Date(isoString); // Converts to local time
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		const yyyy = date.getFullYear();
		// let hours = date.getHours();
		// const minutes = String(date.getMinutes()).padStart(2, "0");
		// const seconds = String(date.getSeconds()).padStart(2, "0");
		// const ampm = hours >= 12 ? "PM" : "AM";
		// hours = hours % 12 || 12; // Convert 0 to 12
		// return `${mm}/${dd}/${yyyy}, ${hours}:${minutes} ${ampm}`;
		return `${mm}/${dd}/${yyyy}`;
	  };
	const columns = [
		{
			field: "srNo",
			headerName: "Sr. No.",
			sortable: false,
			filterable: false,
			flex: 1,
			renderCell: (params) => orders.findIndex((item) => item?.id === params.row?.id) + 1 + page * pageSize,
		},
		{
			field: "id",
			sortable: false,
			filterable: false,
			headerName: "Order Id",
			flex: 1,
			renderCell: (params) => params?.row?.id || "N/A",
		},
		{
			field: "payment_checkout_id",
			sortable: false,
			filterable: false,
			headerName: "Transaction Id",
			flex: 2,
			renderCell: (params) => params?.row?.payment_checkout_id || "N/A",
		},
		{
			field: "user_name",
			sortable: false,
			filterable: false,
			headerName: "User Name",
			flex: 2,
			renderCell: (params) => {
				const name = params.row?.user_name;
				return name ? name.charAt(0).toUpperCase() + name.slice(1) : "N/A";
			},
		},
		{
			field: "inmate_nameFirst",
			sortable: false,
			filterable: false,
			headerName: "Inmate Name",
			flex: 2,

			renderCell: (params) => {
				const first = params.row.inmate_nameFirst?.trim() ?? "";
				const middle = params.row.inmate_nameMiddle?.trim() ?? "";
				const last = params.row.inmate_nameLast?.trim() ?? "";
				const full = [first, middle, last].filter(Boolean).join(" ");
				return full || "N/A";
			},
		},
		{
			field: "inmate_Num",
			sortable: false,
			filterable: false,
			headerName: "Inmate No.",
			flex: 1,
			renderCell: (params) => params?.row?.inmate_Num || "N/A",
		},
		{
			field: "images",
			sortable: false,
			filterable: false,
			headerName: "Photo Count",
			flex: 1.5,
			renderCell: (params) => (params?.row?.images && params?.row?.images.length) || "N/A",
		},
		{
			field: "shipment_status",
			sortable: false,
			filterable: false,
			headerName: "Shipment Status",
			flex: 1.5,
			renderCell: (params) => {
				const name = params.row?.shipment_status;
				return name ? name.charAt(0).toUpperCase() + name.slice(1) : "N/A";
			},
		},
		{
			field: "created_at",
			headerName: "Created Date",
			flex: 1.5,
			renderCell: (params) => {
				const createdAt = params.row?.created_at;
				if (!createdAt) return "N/A";
				return formatDate(createdAt);
			},
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 1.5,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<div className="paginated-table__actions">
					<Tooltip title="View Details" placement="top">
						<IconButton onClick={() => handleView(params.row)} sx={{ color: "#cf5835" }}>
							<VisibilityIcon />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<Box className="admin-order-conatiner">
			<div className="paginated-table__grid">
				<DataGrid
					rows={orders}
					columns={columns}
					pageSize={pageSize}
					initialState={{
						pagination: { paginationModel: { pageSize: pageSize, page: page } },
					}}
					pageSizeOptions={[5, 10, 25, 50, 100]}
					rowCount={totalRows}
					paginationMode="server"
					onPaginationModelChange={(newModel) => {
						setPage(newModel.page);
						setPageSize(newModel.pageSize);
						fetchData(newModel.page, newModel.pageSize);
					}}
					loading={loading}
				/>
			</div>
		</Box>
	);
};

export default OrderList;
