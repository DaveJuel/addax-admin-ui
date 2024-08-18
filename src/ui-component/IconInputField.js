import React from 'react';
import { Grid, TextField, InputAdornment, Autocomplete } from '@mui/material';
import { Dashboard, Article, Home, Settings, Info } from '@mui/icons-material';

// Icon mapping for Material-UI icons
export const iconMapping = {
  "dashboard": Dashboard,
  "article": Article,
  "home": Home,
  "settings": Settings,
  "info": Info,
  // Add more icons as needed
};

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
