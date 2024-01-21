// material-ui
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";

// project imports
import MainCard from "ui-component/cards/MainCard";
import formatTitle from "utils/title-formatter";

// ==============================|| SAMPLE PAGE ||============================== //

const EntityPage = () => {
  const { entityName } = useParams();
  const pageHeader = formatTitle(entityName);
  return (
    <MainCard title={`Details for ${pageHeader}`}>
      <Typography variant="body2">
        {/* Add your dynamic content here based on the entityName */}
        {/* You can fetch data or render specific details */}
        Details for {entityName} go here.
      </Typography>
    </MainCard>
  );
};

export default EntityPage;
