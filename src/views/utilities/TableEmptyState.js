import React from 'react';
import { Box, Typography } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const TableEmptyState = () => {
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
            <SentimentDissatisfied
                style={{
                    fontSize: '60px',
                    color: theme.palette.secondary.dark,
                    marginBottom: '16px'
                }}
            />
            <Typography
                variant="h6"
                color={theme.palette.secondary.dark}
                align="center"
            >
                No records at the moment.
            </Typography>
            <Typography
                variant="body2"
                color={theme.palette.secondary.main}
                align="center"
                maxWidth="300px"
                mt={1}
            >
                Click "Add New", or use "Bulk Import" to add records.
            </Typography>
        </Box>
    );
};

export default TableEmptyState;
