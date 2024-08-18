import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import TimeCard from './TimeCard';
import { gridSpacing } from 'store/constant';
import EntitiesCard from './cards/EntitiesCard';
import UsersCard from './cards/UsersCard';
import FileStorageCard from './cards/FileStorageCard';
import WeatherCard from './cards/WeatherCard';
import TotalGrowthBarChart from './charts/TotalGrowthBarChart';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

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
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
      <Grid container spacing={gridSpacing}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <UsersCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <EntitiesCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <FileStorageCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <WeatherCard isLoading={isLoading} weatherData={weatherData}/>
            </Grid>
        </Grid>
      </Grid> 
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TimeCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
