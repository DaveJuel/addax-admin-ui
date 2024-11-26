// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://documenter.getpostman.com/view/23507537/2s93XsY6da" target="_blank" underline="hover">
      API docs
    </Typography>
    <Typography variant="subtitle2" component={Link} href="#" target="_blank" underline="hover">
      &copy; Addax-Tech
    </Typography>
  </Stack>
);

export default AuthFooter;
