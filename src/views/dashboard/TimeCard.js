import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { CardContent, Grid, Typography, Divider } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { format } from 'date-fns';

// Custom analog clock component
import AnalogClock from 'ui-component/AnalogClock';

// ==============================|| DASHBOARD - TIME CARD ||============================== //

const TimeCard = ({ isLoading }) => {
    const [date, setDate] = useState(format(new Date(), 'MMMM d, yyyy'));
    const [time, setTime] = useState(format(new Date(), 'hh:mm:ss a'));

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(format(new Date(), 'MMMM d, yyyy'));
            setTime(format(new Date(), 'hh:mm:ss a'));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
              <MainCard content={false}>
                  <CardContent>
                      <Grid container direction="column" spacing={2}>
                          <Grid item xs={12}>
                              <Typography variant="h4" color="textPrimary">
                                  {date}
                              </Typography>
                              <Typography variant="h2" color="textSecondary">
                                  {time}
                              </Typography>
                          </Grid>
                          <Divider sx={{ my: 2 }} />
                          <Grid item xs={12} container justifyContent="center">
                              <AnalogClock />
                          </Grid>
                      </Grid>
                  </CardContent>
              </MainCard>
            )}
        </>
    );
};

TimeCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TimeCard;
