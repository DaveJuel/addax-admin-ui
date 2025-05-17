import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
        />
      );
      case "long text":
        return (
          <FormControl fullWidth variant="outlined" style={{ marginTop: 8 }}>
            <InputLabel shrink style={{ marginBottom: 4, fontSize: '0.9rem' }}>
              {formatTitle(attribute.name)}
            </InputLabel>
            <ReactQuill
              theme="snow"
              value={formData[attribute.name] || ""}
              onChange={(value) =>
                handleInputChange({ target: { value } }, attribute)
              }
            />
          </FormControl>
        );      
    case "password":
      return (
        <TextField
          {...commonProps}
          type="password"
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
           {...commonProps}
            renderInput={(params) => <TextField {...params} {...commonProps} />}
          />
        </LocalizationProvider>
      );

    case "datetime":
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            {...commonProps}
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
