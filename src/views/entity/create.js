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

  const [attributeNumber, setAttributeNumber] = useState(0);
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("private");
  let [attributeList, setAttributeList] = useState([]);
  
  const handleAddAttribute = () => {
    setAttributeNumber(attributeNumber);
    setAttributeList(Array.from({ length: attributeNumber }, () => ({
      attribute_name: "",
      data_type: "text",
      is_null: false,
      is_unique: false,
      has_reference: false,
    })));
  };

  const onAttributeChange = (index, field, value) => {
    if(field === 'data_type' && value === 'entity'){
      attributeList[index]['has_reference'] = true;
    }
    if(field === 'is_null' || field === 'is_unique'){
      attributeList[index][field] = !attributeList[index][field];
    }else{
      attributeList[index][field] = value;
    }
  }

  const AttributeField = ({ id, label, value, onChange }) => (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
    />
  );

  const AttributeFieldSelect = ({ id, label, value, onChange }) => (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select id={id} value={value} onChange={onChange}>
        <MenuItem value="text">Text</MenuItem>
        <MenuItem value="numeric">Number</MenuItem>
        <MenuItem value="date">Date</MenuItem>
        <MenuItem value="datetime">Datetime</MenuItem>
        <MenuItem value="file">File</MenuItem>
        <MenuItem value="password">password</MenuItem>
        <MenuItem value="long text">Long text</MenuItem>
        <MenuItem value="entity">Entity</MenuItem>
      </Select>
    </FormControl>
  );

  const AttributeCheckbox = ({ id, label, checked, onChange }) => (
    <FormControlLabel
      control={<Checkbox id={id} checked={checked} onChange={onChange} />}
      label={label}
    />
  );

  const API_ENDPOINT = `${apiUrl}/entity`;

  async function fetchEntityList(){
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const requestData = {
      username: userData.username,
      login_token: userData.login_token,
      api_key: activeAppApiKey,
    };
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
  }

  useEffect(() => {
    fetchEntityList();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const requestData = {
        username: userData.username,
        login_token: userData.login_token,
        api_key: activeAppApiKey,
        entity_name: name,
        icon: "fa fa-graduation-cap",
        number_of_attribute: attributeNumber,
        privacy: privacy,
        attribute_list: attributeList
      };
      const response = await fetch(`${API_ENDPOINT}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      setLoading(false);
    } catch (error) {
      console.error('Error saving attributes:', error);
    }
  };

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
                  <TextField
                    label="Number of Attributes"
                    type="number"
                    value={attributeNumber}
                    onChange={(e)=>setAttributeNumber(e.target.value)}
                    xs={12}
                    sm={2}
                  />
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
                {attributeList && attributeList.map((attribute, index) => (
                  <React.Fragment key={'attribute-'+index}>
                    <Grid item xs={12} sm={4}>
                    <AttributeField
                        id={`attribute_name-${index}`}
                        label={`Attribute Name ${index + 1}`}
                        onChange={(e)=>onAttributeChange(index, 'attribute_name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeFieldSelect
                        id={`data_type-${index}`}
                        label= {`Data Type ${index + 1}`}
                        onChange={(e)=>onAttributeChange(index, 'data_type', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeCheckbox
                        id={`is_null-${index}`}
                        label= {`Nullable ${index + 1}`}
                        onChange={(e)=>onAttributeChange(index, 'is_null', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeCheckbox
                        id={`is_unique-${index}`}
                        label= {`Unique ${index + 1}`}
                        onChange={(e)=>onAttributeChange(index, 'is_unique', e.target.value)}
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
                  onClick={handleSave}
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
