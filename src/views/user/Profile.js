import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { fetchUserProfile, saveUserProfile } from "utils/userApi";
import TableLoadingState from "views/utilities/TableLoadingState";

const UserProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem("user"));
  const [userProfile, setUserProfile] = useState({
      id: null,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
    });
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenSnackbar = (message, status) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(status);
    setSnackbarOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetchUserProfile();
        if (response) setUserProfile(response);
      }catch(error){
        handleOpenSnackbar(error.message, 'error');
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const isActionEdit = userProfile.id !== null;
      await saveUserProfile(isActionEdit, userProfile);
      handleOpenSnackbar('Saved successfully.', 'success');
    } catch (error) {
      handleOpenSnackbar(error.message || 'An error occurred while deleting the entity.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEditMode = () => {
    if(isEditMode){
      handleSubmit();
    }
    setIsEditMode((prev) => !prev);
  };

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <TableLoadingState />;
  }

  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              textAlign: "left",
              p: 3,
            }}
          >
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h5">Account Details</Typography>
                <Box>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Username: </strong>{userData.username}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="textSecondary">
                    <strong>User Type: </strong>{userData.type}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Role: </strong>{userData.role}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Status: </strong>{userData.status}
                  </Typography>
                </Box>
              </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
            }}
          >
            <MainCard>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">User Profile</Typography>
                <Button disabled={submitting} variant="contained" color="primary" onClick={toggleEditMode}>
                  {isEditMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>
              <Grid container spacing={3}>
                {/* App Details */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    fullWidth
                    name="first_name"
                    value={userProfile.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    margin="normal"
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    name="last_name"
                    value={userProfile.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    value={userProfile.email}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    margin="normal"
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    name="phone_number"
                    value={userProfile.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    margin="normal"
                  />
                  <TextField
                    label="Address"
                    fullWidth
                    name="address"
                    value={userProfile.address}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </MainCard>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default UserProfilePage;
