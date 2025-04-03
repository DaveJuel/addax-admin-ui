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
    onChange: (e) => handleInputChange(e, attribute),
  };

  if (attribute.has_reference) {
    return (
      <FormControl fullWidth variant="outlined" key={attribute.name}>
        <InputLabel>{formatTitle(attribute.name)}</InputLabel>
        <Select
          label={formatTitle(attribute.name)}
          value={formData[attribute.name] || ""}
          onChange={(e) => handleInputChange(e, attribute)}
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
      return (
        <TextField
          {...commonProps}
          type="text"
          onChange={(e) => handleInputChange(e, attribute)}
        />
      );
    case "long text":
      return (<TextField
          {...commonProps}
          multiline={true}
          rows={4}
          variant="outlined"
          onChange={(e) => handleInputChange(e, attribute)}
        />);
    case "password":
      return (
        <TextField
          {...commonProps}
          type="password"
          onChange={(e) => handleInputChange(e, attribute)}
        />
      );
    case "numeric":
      return (
        <TextField
          {...commonProps}
          type="number"
          onChange={(e) => handleInputChange(e, attribute)}
        />
      );
    case "date":
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={formatTitle(attribute.name)}
            value={formData[attribute.name] || null}
            onChange={(date) => handleInputChange({ target: { value: date } }, attribute)}
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
            onChange={(date) => handleInputChange({ target: { value: date } }, attribute)}
            renderInput={(params) => <TextField {...params} {...commonProps} />}
          />
        </LocalizationProvider>
      );

    case "file":
      return (
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>{formatTitle(attribute.name)}</InputLabel>
          <Input
            type="file"
            onChange={(e) => handleInputChange(e, attribute)}
          />
        </FormControl>
      );

    case "embedded":
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
