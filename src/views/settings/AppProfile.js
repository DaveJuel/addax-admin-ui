import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect } from 'react';
import { uploadFile } from 'utils/entityApi';
import { apiUrl } from 'utils/httpclient-handler';

const AppProfile = () => {
  const [previewLogo, setPreviewLogo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [appDetails, setAppDetails] = useState({
    name: '',
    status: '',
    logo_url: null,
    added_by: '',
    added_on: '',
    api_key: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(()=>{
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeApp = localStorage.getItem("activeApp");
    const appList = userData?.app_list || [];
    setAppDetails(appList.find((app)=>app.api_key === activeApp));
  }, []);

  useEffect(()=>{
    setPreviewLogo(appDetails?.logo_url)
  }, [appDetails?.logo_url]);

  const updateAppLogo = async (logoUrl) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";

    const path = `${apiUrl}/app/logo`;
    const response = await fetch(path, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "token": userData.login_token,
        "api_key": activeAppApiKey,
      },
      body: JSON.stringify({...appDetails, app_name: appDetails.name, app_logo: logoUrl}),
    });

    const jsonBody = await response.json();

    if (!response.ok) {
      throw new Error(jsonBody.result);
    }

    return jsonBody.result;
  };

  const handleLogoChange = async (event) => {
    setUploading(true);
    try{
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeApp = localStorage.getItem("activeApp");
      const file = event.target.files[0];
      const fileUrl = await uploadFile(userData, activeApp, file);
      await updateAppLogo(fileUrl);
      setPreviewLogo(file);
      setPreviewLogo(fileUrl);
    }catch(error){
      handleOpenSnackbar(error.message || 'Error occured uploading logo', 'error')
    }finally{
      setUploading(false);
    }
  };

  const handleOpenSnackbar = (message, status) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(status);
    setSnackbarOpen(true);
  }

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
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
            label="Created At"
            fullWidth
            name="added_on"
            value={appDetails.added_on}
            onChange={handleInputChange}
            disabled={true}
            margin="normal"
          />
          <TextField
            label="Owner's Email"
            fullWidth
            name="added_by"
            value={appDetails.added_by}
            onChange={handleInputChange}
            disabled={true}
            margin="normal"
          />
          <TextField
            label="Status"
            fullWidth
            name="status"
            value={appDetails.status}
            onChange={handleInputChange}
            disabled={true}
            margin="normal"
          />
          <TextField
            label="API Key"
            fullWidth
            name="api_key"
            value={appDetails.api_key}
            onChange={handleInputChange}
            disabled={true}
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
              <Button variant="contained" component="label" disabled={uploading}>
                Upload Logo
                <input type="file" hidden onChange={handleLogoChange} />
              </Button>
            )}
          </Box>
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

export default AppProfile;
