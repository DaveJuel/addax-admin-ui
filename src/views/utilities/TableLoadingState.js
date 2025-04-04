import React from 'react';
import { Box, CircularProgress } from '@mui/material';
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
    </Box>
  );
};

export default TableLoadingState;