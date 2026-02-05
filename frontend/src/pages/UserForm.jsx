import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Avatar,
  Stack,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { userSchema } from "../utils/validators";

import { createUser, getUserById, updateUser } from "../api/user.api";
import Loader from "../components/Loader";

export default function UserForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = useMemo(() => mode === "edit", [mode]);

  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      gender: "",
      status: "Active",
      location: "",
    },
  });

  const getProfileURL = (profileImage) => {
    if (!profileImage) return "";
    return `http://localhost:8080/uploads/${profileImage}`;
  };

  // ✅ If Edit mode → fetch user
  useEffect(() => {
    if (!isEdit) return;
    if (!id) return;

    const fetchUser = async () => {
      try {
        setFetchingUser(true);
        const res = await getUserById(id);
        const u = res.data.data;

        setValue("firstName", u.firstName);
        setValue("lastName", u.lastName);
        setValue("email", u.email);
        setValue("mobile", u.mobile);
        setValue("gender", u.gender);
        setValue("status", u.status);
        setValue("location", u.location);

        // existing profile preview
        setPreviewURL(getProfileURL(u.profileImage));
      } catch (err) {
        toast.error("Failed to load user");
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUser();
  }, [isEdit, id, setValue]);

  // cleanup preview blob
  useEffect(() => {
    return () => {
      if (previewURL?.startsWith("blob:")) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // basic validation
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG/PNG allowed");
      return;
    }

    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("gender", data.gender);
      formData.append("status", data.status);
      formData.append("location", data.location);

      if (selectedFile) formData.append("profileImage", selectedFile);

      if (isEdit) {
        await updateUser(id, formData);
        toast.success("User updated successfully");
      } else {
        await createUser(formData);
        toast.success("User created successfully");
      }

      navigate("/users");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) return <Loader />;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Profile */}
            <Grid item xs={12}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                <Avatar src={previewURL} sx={{ width: { xs: 56, sm: 70 }, height: { xs: 56, sm: 70 } }} />

                <Button
                  variant="outlined"
                  component="label"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Upload Profile
                  <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                </Button>
              </Stack>
            </Grid>

            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isEdit} // optional: keep email fixed
              />
            </Grid>

            {/* Mobile */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                {...register("mobile")}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                {...register("gender")}
                error={!!errors.gender}
                helperText={errors.gender?.message}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </TextField>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                {...register("status")}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                {...register("location")}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Grid>

            {/* Buttons */}
            <Grid item xs={12}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/users")}
                  disabled={loading}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={isEdit ? <SaveIcon /> : null}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {loading ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
