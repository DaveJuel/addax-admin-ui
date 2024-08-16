import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';


// ==============================|| DASHBOARD - WEATHER CARD ||============================== //

const WeatherCard = ({ isLoading }) => {
    console.log(isLoading);
  return <DefaultCard />;
};

WeatherCard.propTypes = {
  isLoading: PropTypes.bool
};

export default WeatherCard;
