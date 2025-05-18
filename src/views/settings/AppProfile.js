import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Avatar,
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect } from 'react';

const AppProfile = () => {
  const [previewLogo, setPreviewLogo] = useState(null);
  const [appDetails, setAppDetails] = useState({
    name: '',
    status: '',
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

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setPreviewLogo(file);
    setPreviewLogo(URL.createObjectURL(file));
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
              <Button variant="contained" component="label">
                Upload Logo
                <input type="file" hidden onChange={handleLogoChange} />
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AppProfile;
