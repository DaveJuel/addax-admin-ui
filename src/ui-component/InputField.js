import React from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Input } from '@mui/material';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Helper function to format title
const formatTitle = (str) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

// Function to render input field based on data type and reference
const renderInputField = (attribute, formData, handleInputChange) => {
  const commonProps = {
    fullWidth: true,
    label: formatTitle(attribute.name),
    variant: "outlined",
    value: formData[attribute.name] || "",
    onChange: (e) => handleInputChange(e, attribute.name),
  };

  if (attribute.has_reference) {
    return (
      <FormControl fullWidth variant="outlined" key={attribute.name}>
        <InputLabel>{formatTitle(attribute.name)}</InputLabel>
        <Select
          label={formatTitle(attribute.name)}
          value={formData[attribute.name] || ""}
          onChange={(e) => handleInputChange(e, attribute.name)}
        >
          {attribute.options.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item[attribute.reference.display_column]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  switch (attribute.data_type) {
    case "text":
    case "long text":
    case "password":
      return (
        <TextField
          {...commonProps}
          type={attribute.data_type === "password" ? "password" : "text"}
          multiline={attribute.data_type === "long text"}
        />
      );

    case "numeric":
      return (
        <TextField
          {...commonProps}
          type="number"
        />
      );

    case "date":
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={formatTitle(attribute.name)}
            value={formData[attribute.name] || null}
            onChange={(date) => handleInputChange({ target: { value: date } }, attribute.name)}
            renderInput={(params) => <TextField {...params} {...commonProps} />}
          />
        </LocalizationProvider>
      );

    case "datetime":
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label={formatTitle(attribute.name)}
            value={formData[attribute.name] || null}
            onChange={(date) => handleInputChange({ target: { value: date } }, attribute.name)}
            renderInput={(params) => <TextField {...params} {...commonProps} />}
          />
        </LocalizationProvider>
      );

    case "cloud":
      // Custom logic for cloud data type
      return (
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>{formatTitle(attribute.name)}</InputLabel>
          <Input
            type="file"
            onChange={(e) => handleInputChange(e, attribute.name)}
          />
        </FormControl>
      );

    case "embedded":
      // Custom logic for embedded data type
      return (
        <TextField
          {...commonProps}
          type="text"
        />
      );

    default:
      return (
        <TextField
          {...commonProps}
          type="text"
        />
      );
  }
};

export default renderInputField;
