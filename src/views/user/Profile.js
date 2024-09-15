import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import MainCard from "ui-component/cards/MainCard";
import { fetchUserProfile } from "utils/userApi";

const UserProfilePage = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const fetchData = async () => {
      const response = await fetchUserProfile(userData, activeAppApiKey);
      setProfile(response);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography variant="body2">Loading user profile...</Typography>;
  }

  const { first_name, last_name, email, phone_number, address } = profile || 'No data';

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">User Profile</Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              textAlign: "center",
              p: 3,
            }}
          >
            <Avatar
              alt={`${first_name} ${last_name}`}
              src="" // Placeholder for profile picture
              sx={{ width: 120, height: 120, margin: "0 auto", mb: 2 }}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{ mt: 1 }}
            >
              <input hidden accept="image/*" type="file" />
              <PhotoCamera />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              {first_name} {last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {email}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">Contact Information</Typography>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">{phone_number}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{address}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>This feature is under development and will be available soon.</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default UserProfilePage;
