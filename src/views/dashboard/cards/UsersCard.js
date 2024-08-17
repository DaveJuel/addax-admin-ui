import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import CardActionGrid from 'ui-component/cards/CardActionGrid';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';

// ==============================|| DASHBOARD - USERS CARD ||============================== //

const UsersCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.info.dark,
  color: theme.palette.info.contrastText,
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const UsersCard = ({ isLoading }) => {
  const theme = useTheme();

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
                        backgroundColor: theme.palette.secondary[700],
                        width: theme.spacing(7),
                        height: theme.spacing(7),
                      }}
                    >
                      {/* Add an appropriate icon inside the Avatar */}
                    </Avatar>
                  </Grid>
                  <CardActionGrid />
                </Grid>
              </Grid>
              <Grid item sx={{ mt: 2 }}>
                <Typography
                  variant="h4"
                  sx={{ fontSize: '1.5rem', fontWeight: 500, mt: 1.75, mb: 0.75 }}
                >
                  1,250
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '2rem', fontWeight: 500, color: theme.palette.primary.light }}
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
  isLoading: PropTypes.bool
};

export default UsersCard;
