import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';
import { WbSunny } from '@mui/icons-material';

// Styled component for the WeatherCard
const WeatherCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.info.dark, // Change color for this card
}));

const WeatherCard = ({ isLoading }) => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(isLoading);
  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const location = latitude && longitude 
          ? `lat=${latitude}&lon=${longitude}`
          : 'q=Kigali';
  
        const url = `https://api.openweathermap.org/data/2.5/weather?${location}&appid=03f5e7ede41608a45eacfebc3a016cd3&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        () => {
          fetchWeatherData();
        }
      );
    } else {
      fetchWeatherData();
    }
  }, []);
  

  return (
    <>
      {loading || !weatherData ? (
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
};

export default WeatherCard;
