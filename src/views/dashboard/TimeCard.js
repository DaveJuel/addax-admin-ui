import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { CardContent, Grid, Typography, Divider, Select, MenuItem } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { format, addHours } from 'date-fns';

// Custom analog clock component
import AnalogClock, { getUTCTime } from 'ui-component/AnalogClock';

// ==============================|| DASHBOARD - TIME CARD ||============================== //

function convertOffsetToHours(offsetInSeconds) {
    return offsetInSeconds / 3600;
}

const TimeCard = ({ isLoading, weatherData }) => {
    const [timezoneOffset, setTimezoneOffset] = useState(0);
    const [date, setDate] = useState(format(new Date(), 'MMMM d, yyyy'));
    const [time, setTime] = useState(format(new Date(), 'hh:mm:ss a'));

    useEffect(() => {
        const timer = setInterval(() => {
            const utcTime = getUTCTime();
            const adjustedTime = addHours(utcTime, timezoneOffset);
            setDate(format(adjustedTime, 'MMMM d, yyyy'));
            setTime(format(adjustedTime, 'hh:mm:ss a'));
        }, 1000);

        return () => clearInterval(timer);
    }, [timezoneOffset]);

    useEffect(() => {
        if (weatherData && weatherData.timezone) {
            const offset = convertOffsetToHours(weatherData.timezone);
            setTimezoneOffset(offset);
        }
    }, [weatherData]);



    const handleTimezoneChange = (event) => {
        setTimezoneOffset(event.target.value);
    };
    return (
        <>
            {isLoading || !weatherData ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                <CardContent>
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Typography variant="h4" color="textPrimary">
                                        {date}
                                    </Typography>
                                    <Typography variant="h2" color="textSecondary">
                                        {time}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                <Select
                                        value={timezoneOffset}
                                        onChange={handleTimezoneChange}
                                        displayEmpty
                                        variant="outlined"
                                        fullWidth
                                    >
                                        <MenuItem value={0}>UTC (Coordinated Universal Time)</MenuItem>
                                        <MenuItem value={1}>London, UK (UTC+1)</MenuItem>
                                        <MenuItem value={2}>Kigali, Rwanda (UTC+2)</MenuItem>
                                        <MenuItem value={3}>Moscow, Russia (UTC+3)</MenuItem>
                                        <MenuItem value={4}>Dubai, UAE (UTC+4)</MenuItem>
                                        <MenuItem value={5}>Islamabad, Pakistan (UTC+5)</MenuItem>
                                        <MenuItem value={6}>Dhaka, Bangladesh (UTC+6)</MenuItem>
                                        <MenuItem value={7}>Bangkok, Thailand (UTC+7)</MenuItem>
                                        <MenuItem value={9}>Beijing, China (UTC+8)</MenuItem>
                                        <MenuItem value={10}>Tokyo, Japan (UTC+9)</MenuItem>
                                        <MenuItem value={11}>Sydney, Australia (UTC+11)</MenuItem>
                                        <MenuItem value={-5}>New York, USA (UTC-5)</MenuItem>
                                        <MenuItem value={-6}>Chicago, USA (UTC-6)</MenuItem>
                                        <MenuItem value={-7}>Denver, USA (UTC-7)</MenuItem>
                                        <MenuItem value={-8}>Los Angeles, USA (UTC-8)</MenuItem>
                                        <MenuItem value={-9}>Anchorage, USA (UTC-9)</MenuItem>
                                        <MenuItem value={-10}>Honolulu, USA (UTC-10)</MenuItem>
                                    </Select>

                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item xs={12} container justifyContent="center">
                            <AnalogClock timeOffset={timezoneOffset} />
                        </Grid>
                    </Grid>
                </CardContent>
            </MainCard>
            )}
        </>
    );
};

TimeCard.propTypes = {
    isLoading: PropTypes.bool,
    weatherData: PropTypes.object,
};

export default TimeCard;
