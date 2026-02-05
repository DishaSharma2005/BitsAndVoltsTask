import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  Grid,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { toast } from "react-toastify";

import { getUserById } from "../api/user.api";
import Loader from "../components/Loader";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProfileURL = (profileImage) => {
    if (!profileImage) return "";
    return `http://localhost:8080/uploads/${profileImage}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserById(id);
        setUser(res.data.data);
      } catch (err) {
        toast.error("User not found");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <Box sx={{ bgcolor: "#f4f4f4", minHeight: "100vh", py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Top Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography variant="h5" fontWeight={800}>
            User Details
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="flex-end"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/users")}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Back
            </Button>

            <Button
              component={Link}
              to={`/users/${user._id}/edit`}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Edit
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Section */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "center", sm: "flex-start" }}
          mb={3}
        >
          <Avatar
            src={getProfileURL(user.profileImage)}
            sx={{ width: { xs: 72, sm: 110 }, height: { xs: 72, sm: 110 } }}
          />

          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" fontWeight={800}>
              {user.firstName} {user.lastName}
            </Typography>

            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              <Chip label={`Gender: ${user.gender}`} variant="outlined" />
              <Chip
                label={user.status}
                color={user.status === "Active" ? "success" : "default"}
              />
            </Stack>

            <Typography sx={{ mt: 2 }} color="text.secondary">
              Email: <b>{user.email}</b>
            </Typography>

            <Typography color="text.secondary">
              Mobile: <b>{user.mobile}</b>
            </Typography>

            <Typography color="text.secondary">
              Location: <b>{user.location}</b>
            </Typography>
          </Box>
        </Stack>

        {/* Extra Details Section */}
        <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography fontWeight={700} mb={2}>
            More Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary">Created At</Typography>
              <Typography fontWeight={600}>
                {new Date(user.createdAt).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary">Updated At</Typography>
              <Typography fontWeight={600}>
                {new Date(user.updatedAt).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        </Paper>
      </Container>
    </Box>
  );
}
