import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';
import { useState } from 'react';

// ==============================|| DASHBOARD - USERS CARD ||============================== //

const UsersCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.info.dark,
  color: theme.palette.info.contrastText,
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const UsersCard = ({ isLoading, userCount }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

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
        <UsersCardWrapper>
          <Box sx={{ p: 3 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        width: theme.spacing(7),
                        height: theme.spacing(7),
                      }}
                    >
                      {/* Add an appropriate icon inside the Avatar */}
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
                          <MenuItem onClick={() => { handleClose(); navigate('/user/list'); }}>
                              <PeopleIcon sx={{ mr: 1.75 }} /> View list
                          </MenuItem>
                          <MenuItem onClick={() => { handleClose(); navigate('/entity/user_role'); }}>
                              <AssignmentIndIcon sx={{ mr: 1.75 }} /> View roles
                          </MenuItem>
                          <MenuItem onClick={() => { handleClose(); navigate('/user/privileges'); }}>
                              <LockPersonIcon sx={{ mr: 1.75 }} /> View privileges
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
                  {userCount}
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '2rem', fontWeight: 500, color: theme.palette.grey[50] }}
                >
                  Active Users
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </UsersCardWrapper>
      )}
    </>
  );
};

UsersCard.propTypes = {
  isLoading: PropTypes.bool,
  userCount: PropTypes.number
};

export default UsersCard;
