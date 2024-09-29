import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import StorageIcon from '@mui/icons-material/Storage';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';
import { Avatar, Box, Grid, Typography, Menu, MenuItem } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useState } from 'react';
import { apiUrl } from 'utils/httpclient-handler';

// ==============================|| DASHBOARD - FILE STORAGE CARD ||============================== //

const FileStorageCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.success.dark,
  color: theme.palette.success.contrastText,
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const FileStorageCard = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [usedSize, setUsedSize ] = useState(0);
  const [usedUnit, setUsedUnit] = useState('KB');
  
  const loadStorageMeasurements = async() => {
    try{
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";

      const requestData = {
        username: userData.username,
        login_token: userData.login_token,
        api_key: activeAppApiKey,
      };
      const response = await fetch(`${apiUrl}/upload/used-space`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setLoading(false);
      setUsedSize(data.result.value);
      setUsedUnit(data.result.unit);
    }catch(error){
      console.error('Failed loading used storage', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStorageMeasurements();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  return (
    <>
      {isLoading ? (
        <DefaultCard />
      ) : (
        <FileStorageCardWrapper>
          <Box sx={{ p: 3 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.secondary[700],
                        width: theme.spacing(7),
                        height: theme.spacing(7),
                      }}
                    >
                      <StorageIcon fontSize="large" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                        <Avatar
                          variant="rounded"
                          sx={{
                              ...theme.typography.commonAvatar,
                              ...theme.typography.mediumAvatar,
                              backgroundColor: theme.palette.secondary.dark,
                              color: theme.palette.secondary[200],
                              zIndex: 1
                          }}
                          aria-controls="menu-users-card"
                          aria-haspopup="true"
                          onClick={handleClick}
                          >
                              <MoreHorizIcon fontSize="inherit" />
                        </Avatar>
                      <Menu
                          id="menu-users-card"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                          variant="selectedMenu"
                          anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right'
                          }}
                          transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right'
                          }}
                          >
                          <MenuItem onClick={() => { handleClose(); navigate('/files'); }}>
                              <ViewListIcon sx={{ mr: 1.75 }} /> View list
                          </MenuItem>
                      </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mt: 2 }}>
                <Typography
                  variant="h4"
                  sx={{ fontSize: '1.5rem', fontWeight: 500, mt: 1.75, mb: 0.75 }}
                >
                  {usedSize} {usedUnit}
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '2rem', fontWeight: 500, color: theme.palette.primary.light }}
                >
                  Used Storage
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </FileStorageCardWrapper>
      )}
    </>
  );
};

FileStorageCard.propTypes = {
  isLoading: PropTypes.bool
};

export default FileStorageCard;
