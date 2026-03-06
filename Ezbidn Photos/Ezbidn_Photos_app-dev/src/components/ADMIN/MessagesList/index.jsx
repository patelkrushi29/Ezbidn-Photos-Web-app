import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Tooltip,
	IconButton,
	MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import apiHandler from "../../../utils/API/api";
import apiConfig from "../../../utils/API/apiConfig";
import "./contactlist.css";

const ContactedMessageList = () => {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [totalRows, setTotalRows] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [replyModalOpen, setReplyModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const fetchData = async (updatedPage, updatedPageSize, updatedSearchQuery) => {
		try {
			setLoading(true);
			const res = await apiHandler.get(apiConfig.admin.listContactUsers.url, {
				pageNo: updatedPage + 1,
				limit: updatedPageSize,
				searchText: updatedSearchQuery || "null",
			});
			if (res?.status) {
				setData(res?.users || []);
				setTotalRows(res?.total || 0);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData(page, pageSize, searchQuery);
	}, [page, pageSize]);

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

	const handleReplyStatus = (row) => {
		setSelectedRow(row);
		setReplyModalOpen(true);
	};

	const handleClose = () => {
		setSelectedRow(null);
		setReplyModalOpen(false);
	};

	const handleUpdate = async () => {
		try {
			setLoadingUpdate(true);
			const payload = {
				is_replied: selectedRow?.is_replied,
			};
			const response = await apiHandler.put(apiConfig.admin.updateContactUsFlag.url, { id: selectedRow?.id }, payload);

			if (response.status) {
				await fetchData(page, pageSize, searchQuery);
				handleClose();
				setLoadingUpdate(false);
				enqueueSnackbar(response.message, { variant: "success" });
			} else {
				setLoadingUpdate(false);
				enqueueSnackbar(response.message, { variant: "error" });
			}
		} catch (err) {
			setLoadingUpdate(false);
			console.error(err);
			enqueueSnackbar("Something went wrong.", { variant: "error" });
		}
	};

	const handleInputChange = (value) => {
		setSearchQuery(value);
		if (value.trim() === "") {
			fetchData(page, pageSize, "");
		}
	};

	const columns = [
		{
			field: "srNo",
			headerName: "Sr. No.",
			width: 100,
			sortable: false,
			filterable: false,
			renderCell: (params) => data.findIndex((item) => item?.id === params.row?.id) + 1 + page * pageSize,
		},
		{
			field: "email",
			headerName: "Email",
			flex: 2,
			renderCell: (params) => params?.row?.email || "N/A",
		},
		{
			field: "description",
			headerName: "Message",
			flex: 3,
			renderCell: (params) => params?.row?.description || "N/A",
		},
		{
			field: "device_type",
			headerName: "Device",
			flex: 1,
			renderCell: (params) => {
				const value = params?.row?.device_type;
				return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "N/A";
			},
		},
		{
			field: "is_replied",
			headerName: "Replied",
			flex: 1,
			renderCell: (params) => {
				const replied = params?.row?.is_replied;
				return (
					<span
						style={{
							color: replied ? "#4CAF50" : "#FF9800",
							fontWeight: "bold",
						}}
					>
						{replied ? "YES" : "NO"}
					</span>
				);
			},
		},
		{
			field: "created_at",
			headerName: "Created At",
			flex: 2,
			renderCell: (params) => {
				const createdAt = params?.row?.created_at;
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
					<Tooltip title="Change Reply Status" placement="right">
						<IconButton onClick={() => handleReplyStatus(params.row)} sx={{ color: "#cf5835" }}>
							<EditIcon />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<Box className="admin-message-conatiner">
			<Box className="userlist-search-bar">
				<TextField
					className="userlist-search-input"
					variant="outlined"
					size="small"
					placeholder="Search by email or message..."
					value={searchQuery}
					onChange={(e) => handleInputChange(e.target.value)}
				/>
				<Button
					className="userlist-search-button"
					variant="contained"
					onClick={() => fetchData(page, pageSize, searchQuery.trim())}
					disabled={searchQuery.trim().length < 2}
				>
					Search
				</Button>
			</Box>
			<DataGrid
				rows={data}
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

			<Dialog open={replyModalOpen} onClose={() => handleClose()} maxWidth="sm" fullWidth>
				<DialogTitle>Change Reply Status</DialogTitle>
				<DialogContent>
					<TextField
						disabled={loadingUpdate}
						select
						label="Reply Status"
						value={selectedRow?.is_replied ?? ""}
						onChange={(e) =>
							setSelectedRow({
								...selectedRow,
								is_replied: Number(e.target.value),
							})
						}
						fullWidth
						margin="normal"
					>
						<MenuItem value={1}>Yes</MenuItem>
						<MenuItem value={0}>No</MenuItem>
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose()} variant="outlined" color="secondary">
						Cancel
					</Button>
					<Button onClick={() => handleUpdate()} disabled={loadingUpdate} variant="contained" color="primary">
						{loadingUpdate ? "Updating..." : "Update"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default ContactedMessageList;
