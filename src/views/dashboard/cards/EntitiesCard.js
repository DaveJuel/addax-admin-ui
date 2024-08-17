import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';

// ==============================|| DASHBOARD - ENTITIES CARD ||============================== //

const EntitiesCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const EntitiesCard = ({ isLoading }) => {
  const theme = useTheme();

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
                </Grid>
              </Grid>
              <Grid item sx={{ mt: 2 }}>
                <Typography
                  variant="h4"
                  sx={{ fontSize: '1.5rem', fontWeight: 500, mt: 1.75, mb: 0.75 }}
                >
                  500
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
