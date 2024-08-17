// material-ui
import { Avatar, Grid, Menu, MenuItem } from '@mui/material';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from 'react';
import { useTheme } from '@emotion/react';


// ==============================|| SKELETON - CARD ACTIONS ||============================== //

const CardActionGrid = () =>{
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
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
    );
};

export default CardActionGrid;
