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
import { useEffect, useState } from 'react';
import { fetchEntityList } from 'utils/entityApi';
import { fetchWeatherData } from 'utils/weatherApi';
import { apiUrl } from 'utils/httpclient-handler';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [entities, setEntities] = useState([]);
  const [numberOfEntities, setNumberOfEntities] = useState(0);
  const [weather, setWeather] = useState(null);
  const [usedSpace, setUsedSpace] = useState({size: 0, unit:'KB'})
  
  const loadEntityList = async()=>{
    try{
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await fetchEntityList(userData, activeAppApiKey);
      return response;
    }catch(error){
      console.error('Failed loading entity list');
      setLoading(false);
    }
  }

  const loadWeatherData = async (location = 'Kigali') => {
    try {
      const response = await fetchWeatherData (location);
      setWeather(response.result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const loadStorageData = async () => {
    try{
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";

      const requestData = {
        username: userData.username,
        login_token: userData.login_token,
        api_key: activeAppApiKey,
      };
      const response = await fetch(`${apiUrl}/upload/used-space`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return {
        size: data.result.value,
        unit: data.result.unit,
      }
    }catch(error){
      console.error('Failed loading used storage', error);
    }
  }

  useEffect(()=>{
    const loadDashboardData = async () =>{
      const entityData = await loadEntityList();
      setEntities(entityData.result);
      setNumberOfEntities(entityData.result_count);
      const storage = await loadStorageData();
      setUsedSpace(storage);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
           (position) => {
            const { latitude, longitude } = position.coords;
             loadWeatherData(`${latitude},${longitude}`);
          },
          () => {
             loadWeatherData();
          }
        );
      } else {
          loadWeatherData();
      }
    }
    loadDashboardData();
  }, []);

  
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
      <Grid container spacing={gridSpacing}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <UsersCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <EntitiesCard isLoading={isLoading} entityCount={numberOfEntities}/>
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <FileStorageCard isLoading={isLoading} usedSpaceSize={usedSpace.size} usedSpaceUnit={usedSpace.unit}/>
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <WeatherCard isLoading={isLoading} weatherData={weather} loadWeatherData={loadWeatherData} />
            </Grid>
        </Grid>
      </Grid> 
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} entityList={entities} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TimeCard isLoading={isLoading} weatherData={weather} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
