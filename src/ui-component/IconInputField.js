import React from 'react';
import { Grid, TextField, InputAdornment, Autocomplete, Box, Typography } from '@mui/material';
import {
  Dashboard, Article, Home, Settings, Info, Search, AccountCircle, Alarm,
  Build, Call, CameraAlt, Email, Favorite, Lock, MenuBook, Notifications,
  Person, Phone, Print, Save, Security, ShoppingCart, ThumbUp, Visibility,
  Wifi, Work, ZoomIn, LocationOn, Cloud, CalendarToday, Star
} from '@mui/icons-material';

// Icon mapping for Material-UI icons
export const iconMapping = {
  "account_circle": AccountCircle,
  "alarm": Alarm,
  "article": Article,
  "build": Build,
  "call": Call,
  "calendar_today": CalendarToday,
  "camera_alt": CameraAlt,
  "cloud": Cloud,
  "dashboard": Dashboard,
  "email": Email,
  "favorite": Favorite,
  "home": Home,
  "info": Info,
  "location_on": LocationOn,
  "lock": Lock,
  "menu_book": MenuBook,
  "notifications": Notifications,
  "person": Person,
  "phone": Phone,
  "print": Print,
  "save": Save,
  "search": Search,
  "security": Security,
  "settings": Settings,
  "shopping_cart": ShoppingCart,
  "star": Star,
  "thumb_up": ThumbUp,
  "visibility": Visibility,
  "wifi": Wifi,
  "work": Work,
  "zoom_in": ZoomIn,
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
