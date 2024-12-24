import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
//   IconButton,
  Avatar,
//   Modal,
//   Paper,
  Snackbar,
} from '@mui/material';
// import { Edit, Save } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import MainCard from 'ui-component/cards/MainCard';

const AppProfile = () => {
  const [previewLogo, setPreviewLogo] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
  });
  const [appDetails, setAppDetails] = useState({
    name: '',
    description: '',
    industry: '',
    category: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setPreviewLogo(file);
    setPreviewLogo(URL.createObjectURL(file));
  };

  const handleSaveLocation = (newLocation) => {
    setLocation(newLocation);
    setSnackbarOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">App Profile</Typography>
        <Button variant="contained" color="primary" onClick={toggleEditMode}>
          {isEditMode ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* App Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            App Details
          </Typography>
          <TextField
            label="App Name"
            fullWidth
            name="name"
            value={appDetails.name}
            onChange={handleInputChange}
            disabled={!isEditMode}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={appDetails.description}
            onChange={handleInputChange}
            disabled={!isEditMode}
            margin="normal"
          />
          <TextField
            label="Industry"
            fullWidth
            name="industry"
            value={appDetails.industry}
            onChange={handleInputChange}
            disabled={!isEditMode}
            margin="normal"
          />
          <TextField
            label="Category"
            fullWidth
            name="category"
            value={appDetails.category}
            onChange={handleInputChange}
            disabled={!isEditMode}
            margin="normal"
          />
        </Grid>

        {/* Logo */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Logo
          </Typography>
          <Box display="flex" alignItems="center">
            <Avatar src={previewLogo} alt="App Logo" sx={{ width: 100, height: 100, mr: 2 }} />
            {isEditMode && (
              <Button variant="contained" component="label">
                Upload Logo
                <input type="file" hidden onChange={handleLogoChange} />
              </Button>
            )}
          </Box>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={contactInfo.email}
            onChange={handleContactChange}
            disabled={!isEditMode}
            margin="normal"
          />
          <TextField
            label="Phone"
            fullWidth
            name="phone"
            value={contactInfo.phone}
            onChange={handleContactChange}
            disabled={!isEditMode}
            margin="normal"
          />
        </Grid>

        {/* Default Location */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Default Location
          </Typography>
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              center={location}
              zoom={10}
              mapContainerStyle={{ height: '400px', width: '100%' }}
              onClick={(e) =>
                isEditMode && handleSaveLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
              }
            >
              <Marker position={location} />
            </GoogleMap>
          </LoadScript>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Location saved successfully!
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default AppProfile;
