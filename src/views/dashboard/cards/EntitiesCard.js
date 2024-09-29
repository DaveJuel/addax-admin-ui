import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import { styled, useTheme } from '@mui/material/styles';
import TableChartIcon from '@mui/icons-material/TableChart';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';
import { Avatar, Box, Grid, Typography, Menu, MenuItem } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEntityList } from 'utils/entityApi';


// ==============================|| DASHBOARD - ENTITIES CARD ||============================== //

const EntitiesCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const EntitiesCard = () => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [totalEntities, setTotalEntities] = useState(0);

  const loadEntitiesList = async ()=>{
    try{
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await fetchEntityList(userData, activeAppApiKey);
      setTotalEntities(response.result_count);
      setLoading(false);
    }catch(error){
      console.error('Failed to load entities');
      setLoading(false);
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect (() => {
    loadEntitiesList();
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
        <EntitiesCardWrapper>
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
                      <TableChartIcon fontSize="large" />
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
                          <MenuItem onClick={() => { handleClose(); navigate('/create/entity'); }}>
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
                  {totalEntities}
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '2rem', fontWeight: 500, color: theme.palette.primary.light }}
                >
                  Total Entities
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </EntitiesCardWrapper>
      )}
    </>
  );
};

EntitiesCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EntitiesCard;
