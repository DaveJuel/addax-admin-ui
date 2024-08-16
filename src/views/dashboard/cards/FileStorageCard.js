import PropTypes from 'prop-types';
import DefaultCard from 'views/dashboard/cards/DefaultCard';


// ==============================|| DASHBOARD - FILE STORAGE CARD ||============================== //

const FileStorageCard = ({ isLoading }) => {
    console.log(isLoading);
  return <DefaultCard />;
};

FileStorageCard.propTypes = {
  isLoading: PropTypes.bool
};

export default FileStorageCard;
