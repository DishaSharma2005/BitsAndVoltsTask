import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Stack,
  Pagination,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

import { toast } from "react-toastify";

import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  getUsers,
  searchUsers,
  deleteUser,
  exportUsersCSV,
} from "../api/user.api";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [totalPages, setTotalPages] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await getUsers(pageNo, limit);

      setUsers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearch = async (q, pageNo = 1) => {
    try {
      setLoading(true);
      const res = await searchUsers(q, pageNo, limit);

      setUsers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // only react to page changes; searches are triggered explicitly via the Search button
    if (searchMode) {
      const q = searchText.trim();
      if (!q) {
        // fallback to listing when query is empty
        setSearchMode(false);
        fetchUsers(page);
      } else {
        fetchSearch(q, page);
      }
    } else {
      fetchUsers(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // 🔥 Search trigger (explicit only on button/Enter)
  const handleSearch = () => {
    const q = searchText.trim();

    if (!q) {
      // clear search and show list
      setSearchMode(false);
      if (page === 1) fetchUsers(1);
      else setPage(1);
      return;
    }

    // enable search mode and ensure page is 1
    setSearchMode(true);
    if (page === 1) {
      // already on page 1 — trigger search immediately
      fetchSearch(q, 1);
    } else {
      // change page to 1; effect will perform search
      setPage(1);
    }
  };

  // 🔥 Enter key search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // 🔥 Delete flow
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedUser(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedUser?._id) return;

    try {
      await deleteUser(selectedUser._id);
      toast.success("User deleted");

      closeDeleteDialog();

      // refresh list
      if (searchMode) fetchSearch(searchText, page);
      else fetchUsers(page);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  // 🔥 Export CSV
  const handleExport = async () => {
    try {
      const res = await exportUsersCSV();

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();

      window.URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  const renderStatus = (status) => {
    if (status === "Active") return <Chip label="Active" color="success" size="small" />;
    return <Chip label="Inactive" color="default" size="small" />;
  };

  const getProfileURL = (profileImage) => {
    if (!profileImage) return "";
    return `http://localhost:8080/uploads/${profileImage}`;
  };

  return (
  <Box sx={{ bgcolor: "#f4f4f4", minHeight: "100vh", py: { xs: 2, sm: 4 } }}>
    <Container maxWidth="lg">
      {/* Top Row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={2}
      >
        <Typography variant="h6" fontWeight={800}>
          Users List
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{
              bgcolor: "#7A2D2D",
              "&:hover": { bgcolor: "#5f2222" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Export To CSV
          </Button>

          <Button
            component={Link}
            to="/users/new"
            variant="contained"
            sx={{
              bgcolor: "#7A2D2D",
              "&:hover": { bgcolor: "#5f2222" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            + Add User
          </Button>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              bgcolor: "#7A2D2D",
              "&:hover": { bgcolor: "#5f2222" },
              width: { xs: "100%", sm: 140 },
            }}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setSearchText("");
              setSearchMode(false);
              if (page === 1) fetchUsers(1);
              else setPage(1);
            }}
            sx={{
              width: { xs: "100%", sm: 120 },
              borderColor: "#7A2D2D",
              color: "#7A2D2D",
              "&:hover": { borderColor: "#5f2222" },
            }}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Loader />
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#2a2a2a" }}>
                  {["ID", "FullName", "Email", "Gender", "Status", "Profile", "Action"].map(
                    (h) => (
                      <TableCell key={h} sx={{ color: "white", fontWeight: 700 }}>
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box sx={{ py: 4, textAlign: "center" }}>
                        <Typography>No users found</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, index) => (
                    <TableRow key={u._id} hover>
                      <TableCell>{index + 1 + (page - 1) * limit}</TableCell>

                      <TableCell>
                        {u.firstName} {u.lastName}
                      </TableCell>

                      <TableCell>{u.email}</TableCell>

                      <TableCell>{u.gender === "M" ? "Male" : "Female"}</TableCell>

                      <TableCell>{renderStatus(u.status)}</TableCell>

                      <TableCell>
                        <Avatar
                          src={getProfileURL(u.profileImage)}
                          alt={u.firstName}
                          sx={{ width: 34, height: 34 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View">
                            <Button
                              component={Link}
                              to={`/users/${u._id}`}
                              variant="outlined"
                              size="small"
                              sx={{ minWidth: 40 }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </Button>
                          </Tooltip>

                          <Tooltip title="Edit">
                            <Button
                              component={Link}
                              to={`/users/${u._id}/edit`}
                              variant="outlined"
                              size="small"
                              sx={{ minWidth: 40 }}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <Button
                              onClick={() => openDeleteDialog(u)}
                              variant="outlined"
                              color="error"
                              size="small"
                              sx={{ minWidth: 40 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{
            "& .Mui-selected": {
              bgcolor: "#7A2D2D !important",
              color: "white",
            },
          }}
        />
      </Box>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.firstName || ""} ${
          selectedUser?.lastName || ""
        }?`}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </Container>
  </Box>
);

}
