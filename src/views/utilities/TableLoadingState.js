import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableLoadingState = () => {
  const theme = useTheme();
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={3}
      bgcolor={theme.palette.secondary.light}
      borderRadius="12px"
      minHeight="200px"
    >
      <CircularProgress 
        size={60}
        thickness={4}
        style={{
          color: theme.palette.secondary.dark,
          marginBottom: '16px'
        }}
      />
      <Typography
        variant="body2"
        color={theme.palette.secondary.main}
        align="center"
        maxWidth="300px"
        mt={1}
      >
        Please wait while we fetch your data...
      </Typography>
    </Box>
  );
};

export default TableLoadingState;