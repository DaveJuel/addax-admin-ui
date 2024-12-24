import React from 'react';
import { Grid, TextField, InputAdornment, Autocomplete, Box, Typography } from '@mui/material';
import { iconMapping } from 'utils/iconMapping';


const IconInputField = ({ icon, setIcon }) => {
  // Get the corresponding icon component based on the icon name
  const SelectedIcon = iconMapping[icon];

  return (
    <Grid item xs={12} sm={12}>
      <Autocomplete
        options={Object.keys(iconMapping)}
        getOptionLabel={(option) => option}
        value={icon}
        onChange={(e, newValue) => setIcon(newValue || '')}
        renderOption={(props, option) => {
          const OptionIcon = iconMapping[option];
          return (
            <Box component="li" {...props}>
              <OptionIcon style={{ marginRight: 8 }} />
              <Typography>{option}</Typography>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Icon"
            margin="normal"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  {SelectedIcon ? <SelectedIcon /> : null}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        )}
      />
    </Grid>
  );
};

export default IconInputField;
