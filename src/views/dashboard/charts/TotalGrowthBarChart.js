import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import formatTitle from 'utils/title-formatter';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({isLoading, entityList}) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(()=>{
    const populateGraph = (items, records) => {
      setChartOptions({
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: items || [],
        },
        colors: [theme.palette.primary.main],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false,
        },
        theme: {
          mode: customization.navType === 'dark' ? 'dark' : 'light'
        },
      });
  
      setChartSeries([
        {
          name: 'Records',
          data: records || []
        }
      ]);
    }
    if (entityList && entityList.length && entityList?.length > 0) {
      const entityNames = entityList.map((entity) => formatTitle(entity.name));
      const entityRecords = entityList.map((entity) => entity.total_records);
      populateGraph(entityNames, entityRecords);
    }
 
  }, [entityList, isLoading, theme, customization.navType])

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <SkeletonTotalGrowthBarChart  />
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={460}
          />
        )}
      </CardContent>
    </Card>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
  entities: PropTypes.number
};

export default TotalGrowthBarChart;
