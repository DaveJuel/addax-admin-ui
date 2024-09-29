// material-ui
import { Card, CardContent, Grid, Skeleton, Divider } from '@mui/material';

// Skeleton component for the MainCard
const SkeletonTimeCard = () => (
    <Card>
        <CardContent>
            <Grid container direction="column" spacing={2}>
                {/* Date and Time Typography Skeleton */}
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            {/* Skeleton for Date Typography */}
                            <Skeleton variant="rectangular" width={100} height={30} />
                            {/* Skeleton for Time Typography */}
                            <Skeleton variant="rectangular" width={150} height={50} sx={{ mt: 1 }} />
                        </Grid>
                        <Grid item>
                            {/* Skeleton for Timezone Select */}
                            <Skeleton variant="rectangular" width={200} height={50} />
                        </Grid>
                    </Grid>
                </Grid>
                
                {/* Divider */}
                <Divider sx={{ my: 2 }} />

                {/* Skeleton for Analog Clock */}
                <Grid item xs={12} container justifyContent="center">
                    <Skeleton variant="circular" width={200} height={200} />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default SkeletonTimeCard;
