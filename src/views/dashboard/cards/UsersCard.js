import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';


import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';



// ==============================|| DASHBOARD - USERS CARD ||============================== //
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: theme.palette.secondary[800],
      borderRadius: '50%',
      top: -85,
      right: -95,
      [theme.breakpoints.down('sm')]: {
        top: -105,
        right: -140
      }
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: theme.palette.secondary[800],
      borderRadius: '50%',
      top: -125,
      right: -15,
      opacity: 0.5,
      [theme.breakpoints.down('sm')]: {
        top: -155,
        right: -70
      }
    }
  }));

const UsersCard = ({ isLoading }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    return (
        <>
          {isLoading ? (
            <DefaultCard />
          ) : (
            <CardWrapper border={false} content={false}>
                 <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                        <Grid item>
                            <Grid container justifyContent="space-between">
                            <Grid item>
                                <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.largeAvatar,
                                    backgroundColor: theme.palette.secondary[800],
                                    mt: 1
                                }}
                                >
                                {/* TODO: Add proper icon */}
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
                                <MenuItem onClick={handleClose}>
                                    <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File
                                </MenuItem>
                                </Menu>
                            </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center">
                            <Grid item>
                                <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>...</Typography>
                            </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ mb: 1.25 }}>
                            <Typography
                            sx={{
                                fontSize: '2rem',
                                fontWeight: 500,
                                color: theme.palette.secondary[200]
                            }}
                            >
                            Users
                            </Typography>
                        </Grid>
                        </Grid>
                    </Box>
            </CardWrapper>
          )}
        </>
      );
};

UsersCard.propTypes = {
  isLoading: PropTypes.bool
};

export default UsersCard;
