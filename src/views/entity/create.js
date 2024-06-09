import React, { useEffect, useState } from "react";

import MainCard from "ui-component/cards/MainCard";
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Modal,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";

import { apiUrl } from "utils/httpclient-handler";
import formatTitle from "utils/title-formatter";

const EntityConfigPage = () => {
  const [entityList, setEntityList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [numAttributes, setNumAttributes] = useState(2);
  const [attributes, setAttributes] = useState([
    {
      attribute_name: "",
      data_type: "text",
      is_null: false,
      is_unique: false,
    },
  ]);
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("private");

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setNumAttributes(numAttributes + 1);
    setAttributes([
      ...attributes,
      {
        attribute_name: "",
        data_type: "text",
        is_null: false,
        is_unique: false,
      },
    ]);
  };

  const AttributeField = ({ label, value, onChange }) => (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
    />
  );

  const AttributeFieldSelect = ({ label, value, onChange }) => (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange}>
        <MenuItem value="text">Text</MenuItem>
        <MenuItem value="number">Number</MenuItem>
        <MenuItem value="date">Date</MenuItem>
      </Select>
    </FormControl>
  );

  const AttributeCheckbox = ({ label, checked, onChange }) => (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} />}
      label={label}
    />
  );

  const API_ENDPOINT = `${apiUrl}/entity`;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const requestData = {
      username: userData.username,
      login_token: userData.login_token,
      api_key: activeAppApiKey,
    };
    const fetchEntityList = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEntityList(data.result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching entity data:", error);
      }
    };
    fetchEntityList();
  }, [API_ENDPOINT]);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };
  return (
    <MainCard tit>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          Entity list.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {loading ? (
        <Typography variant="body2">Loading entity data...</Typography>
      ) : entityList.length === 0 ? (
        <Typography variant="body2">No content available</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {entityList.length > 0 &&
                  Object.keys(entityList[0]).map(
                    (key) =>
                      key !== "uuid" && (
                        <TableCell key={key}>{formatTitle(key)}</TableCell>
                      )
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {entityList.map((dataItem, index) => (
                <TableRow key={index}>
                  {Object.keys(dataItem).map(
                    (key) =>
                      key !== "uuid" && (
                        <TableCell key={key}>{dataItem[key]}</TableCell>
                      )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Add New Entity Modal */}
      <Modal open={showAddModal} onClose={handleModalClose}>
        <Paper>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Create new entity
            </Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Privacy</InputLabel>
                    <Select
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value)}
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Button
                    xs={12}
                    sm={2}
                    variant="outlined"
                    color="primary"
                    onClick={handleAddAttribute}
                  >
                    Add Attribute
                  </Button>
                </Grid>
                {attributes.map((attribute, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} sm={4}>
                      <AttributeField
                        label="Attribute Name"
                        value={attribute.attribute_name}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "attribute_name",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeFieldSelect
                        label="Data Type"
                        value={attribute.data_type}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "data_type",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeCheckbox
                        label="Nullable"
                        checked={attribute.is_null}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "is_null",
                            e.target.checked
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeCheckbox
                        label="Unique"
                        checked={attribute.is_unique}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "is_unique",
                            e.target.checked
                          )
                        }
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Modal>
    </MainCard>
  );
};

export default EntityConfigPage;
