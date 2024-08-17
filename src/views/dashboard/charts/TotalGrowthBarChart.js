import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setChartOptions({
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: ['Entity 1', 'Entity 2', 'Entity 3', 'Entity 4', 'Entity 5'],
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
          data: [10, 41, 35, 51, 49]
        }
      ]);
    }
  }, [isLoading, theme, customization.navType]);

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
            height={560}
          />
        )}
      </CardContent>
    </Card>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
