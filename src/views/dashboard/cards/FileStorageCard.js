import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';

// ==============================|| DASHBOARD - FILE STORAGE CARD ||============================== //

const FileStorageCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.success.dark,
  color: theme.palette.success.contrastText,
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const FileStorageCard = ({ isLoading }) => {
  const theme = useTheme();

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
                </Grid>
              </Grid>
              <Grid item sx={{ mt: 2 }}>
                <Typography
                  variant="h4"
                  sx={{ fontSize: '1.5rem', fontWeight: 500, mt: 1.75, mb: 0.75 }}
                >
                  150 GB
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
