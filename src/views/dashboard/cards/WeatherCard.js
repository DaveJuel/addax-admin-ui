import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, Avatar, TextField, InputAdornment, IconButton, Collapse } from '@mui/material';
import DefaultCard from 'views/dashboard/cards/DefaultCard';
import CommonCardWrapper from 'views/utilities/CommonCardWrapper';
import { SearchOutlined, WbSunny } from '@mui/icons-material';
import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


// Styled component for the WeatherCard
const WeatherCardWrapper = styled(CommonCardWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.info.dark, // Change color for this card
}));
const WeatherCard = ({ isLoading, weatherData, onFetchWeather }) => {
  const theme = useTheme();
  const [location, setLocation] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFetchWeather = () => {
    if (location.trim()) {
      onFetchWeather(location);
    }
  };
  return (
    <>
      {isLoading || !weatherData ? (
        <DefaultCard />
      ) : (
        <WeatherCardWrapper>
          <Box sx={{ p: 3 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.info[800],
                        width: theme.spacing(7),
                        height: theme.spacing(7),
                      }}
                    >
                      <WbSunny fontSize="large" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: theme.palette.info.dark,
                        color: theme.palette.info[200],
                        zIndex: 1,
                      }}
                      onClick={toggleSearch}
                    >
                      <MoreHorizIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Collapsible Search Form */}
              <Grid item sx={{ mt: 2 }}>
                <Collapse in={showSearch}>
                  <TextField
                    value={location}
                    onChange={handleLocationChange}
                    placeholder='Enter location'
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleFetchWeather}
                            edge="end"
                            sx={{ color: theme.palette.info[700] }}
                          >
                            <SearchOutlined />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Collapse>
              </Grid>

              <Grid item sx={{ mt: 2 }}>
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
  onFetchWeather: PropTypes.func.isRequired,
};

export default WeatherCard;
