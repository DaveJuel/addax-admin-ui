import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';
import { WbSunny } from '@mui/icons-material';

// Styled component for the WeatherCard
const WeatherCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.info.dark, // Change color for this card
}));

const WeatherCard = ({ isLoading, weatherData }) => {
  const theme = useTheme();
  return (
    <>
      {isLoading || !weatherData ? (
        <DefaultCard />
      ) : (
        <WeatherCardWrapper>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.info[800],
                        mt: 1,
                      }}
                    >
                      <WbSunny />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mt: 1.75, mb: 0.75 }}>
                  {weatherData.name}
                </Typography>
                <Typography sx={{ fontSize: '2rem', fontWeight: 500, color: theme.palette.info[200] }}>
                  {`${weatherData.main.temp} °C`}
                </Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 400, color: theme.palette.info[100], mb: 1 }}>
                  {weatherData.weather[0].description}
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: theme.palette.info[300] }}>
                  Humidity: {weatherData.main.humidity}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </WeatherCardWrapper>
      )}
    </>
  );
};

WeatherCard.propTypes = {
  isLoading: PropTypes.bool,
  weatherData: PropTypes.object,
};

export default WeatherCard;
