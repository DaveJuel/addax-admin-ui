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
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
      <Grid container spacing={gridSpacing}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <UsersCard />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <EntitiesCard />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
                <FileStorageCard />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <WeatherCard />
            </Grid>
        </Grid>
      </Grid> 
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <TimeCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
