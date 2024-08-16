import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';


// ==============================|| DASHBOARD - ENTITIES CARD ||============================== //

const EntitiesCard = ({ isLoading }) => {
    console.log(isLoading);
  return <DefaultCard />;
};

EntitiesCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EntitiesCard;
