import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { DataGrid } from "@mui/x-data-grid";
import apiHandler from "../../../utils/API/api";
import apiConfig from "../../../utils/API/apiConfig";
import "./userlist.css";

const UserLists = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [userView, setUserView] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchData = async (
    updatedPage,
    updatedPageSize,
    updatedSearchQuery
  ) => {
    try {
      setLoading(true);
      const res = await apiHandler.get(apiConfig.admin.getAllUsers.url, {
        page: updatedPage + 1,
        limit: updatedPageSize,
        query: updatedSearchQuery || "null",
      });
      if (res?.status) {
        setData(res?.users);
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

  // Open View Page
  const handleOrderList = (row) => {
    navigate(`/admin/orders?userId=${row.id}`);
  };

  const handleUserView = (row) => {
    setSelectedRow(row);
    setUserView(true);
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
      headerClassName: "bold-header",
      flex: 0.5,
      renderCell: (params) =>
        data.findIndex((item) => item?.id === params.row?.id) +
        1 +
        page * pageSize,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      renderCell: (params) => {
        const name = params.row?.name;
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : "N/A";
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      renderCell: (params) => params.row?.email || "N/A",
    },
    {
      field: "is_verified",
      headerName: "Status",
      flex: 1.2,
      renderCell: (params) => {
        const verified = params.row?.is_verified;
        return (
          <span
            style={{
              color: verified ? "#4CAF50" : "#FF9800",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {verified ? "VERIFIED" : "NOT VERIFIED"}
          </span>
        );
      },
    },
    {
      field: "provider",
      headerName: "Provider",
      flex: 1.5,
      renderCell: (params) => {
        const provider = params.row?.provider;
        return provider
          ? provider.charAt(0).toUpperCase() + provider.slice(1)
          : "N/A";
      },
    },
    {
      field: "role",
      headerName: "Type",
      flex: 1.2,
      renderCell: (params) => {
        const role = params.row?.role;
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : "N/A";
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
          <Tooltip title="View Details" placement="left">
            <IconButton
              onClick={() => handleUserView(params.row)}
              sx={{ color: "#cf5835" }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Orders" placement="right-start">
            <IconButton
              onClick={() => handleOrderList(params.row)}
              sx={{ color: "#cf5835" }}
            >
              <ShoppingCartCheckoutIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Box className="admin-user-conatiner">
      <Box className="userlist-search-bar">
        <TextField
          className="userlist-search-input"
          variant="outlined"
          size="small"
          placeholder="Search by name or email..."
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
          fetchData(newModel.page, newModel.pageSize, searchQuery);
        }}
        loading={loading}
      />
      <Dialog
        open={userView}
        onClose={() => setUserView(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Name:</Typography>
              <Typography>{selectedRow?.name || "N/A"}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Email:</Typography>
              <Typography>{selectedRow?.email || "N/A"}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Phone:</Typography>
              <Typography>{selectedRow?.phone || "N/A"}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Role:</Typography>
              <Typography>
                {selectedRow?.role
                  ? selectedRow.role.charAt(0).toUpperCase() +
                    selectedRow.role.slice(1)
                  : "N/A"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Provider:</Typography>
              <Typography>
                {selectedRow?.provider
                  ? selectedRow.provider.charAt(0).toUpperCase() +
                    selectedRow.provider.slice(1)
                  : "N/A"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Verified:</Typography>
              <Typography>{selectedRow?.is_verified ? "Yes" : "No"}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Created At:</Typography>
              <Typography>{formatDate(selectedRow?.created_at)}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserView(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserLists;
