import React, { useEffect, useState } from "react";

import MainCard from "ui-component/cards/MainCard";
import {
  Typography,
  TableContainer,
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
import { fetchEntityList, fetchEntityProperties } from "utils/entityApi";
import IconInputField from "ui-component/IconInputField";
import EntityTable from "ui-component/EntityTable";
import { Add, Remove } from "@mui/icons-material";

const API_ENDPOINT = `${apiUrl}/entity`;

const EntityConfigPage = () => {
  const [entityList, setEntityList] = useState([]);
  const [entityAttributes , setEntityAttributes ] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attributeNumber, setAttributeNumber] = useState(1);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [attributeList, setAttributeList] = useState([{
    attribute_name: "",
    data_type: "text",
    is_null: false,
    is_unique: false,
    has_reference: false,
  }]);

  const userData = JSON.parse(localStorage.getItem("user"));
  const activeAppApiKey = localStorage.getItem("activeApp") || "";
  
  const handleAddAttribute = () => {
    const newAttributeNumber = attributeNumber + 1;
    setAttributeNumber(newAttributeNumber);
    setAttributeList(() => [
      ...attributeList,
      {
        attribute_name: "",
        data_type: "text",
        is_null: false,
        is_unique: false,
        has_reference: false,
      },
    ]);
  };

  const handleRemoveAttribute = () => {
    if (attributeNumber > 1) {
      setAttributeNumber(attributeNumber - 1);
      setAttributeList(attributeList.slice(0, -1));
    }
  };

  const defaultDataTypes = [
    { value: 'text', label: 'Text' },
    { value: 'numeric', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'datetime', label: 'Datetime' },
    { value: 'file', label: 'File' },
    { value: 'password', label: 'Password' },
    { value: 'long text', label: 'Long text' },
  ];

  const mapEntityListToDataTypes = (list) =>{
    return list.map((item) => ({
      value: item.name, label: formatTitle(item.name)
    }));
  };

  const onAttributeChange = async (index, field, value) => {
    const updatedAttributeList = [...attributeList];
    if (field === 'data_type') {
      updatedAttributeList[index][field] = value;
      if (!defaultDataTypes.some(dataType => dataType.value === value)) {
        updatedAttributeList[index]['has_reference'] = true;
        try {
          const itemDetailsResponse = await fetchEntityProperties(value, userData, activeAppApiKey);
          if (itemDetailsResponse && itemDetailsResponse.attribute_list) {
            setEntityAttributes(mapEntityListToDataTypes(itemDetailsResponse.attribute_list));
          }
        } catch (error) {
          console.error('Error fetching entity properties:', error);
        }
      }else{
        updatedAttributeList[index]['has_reference'] = false;
        delete updatedAttributeList[index]['display_column'];
      }
    } else if (field === 'display_column') {
      updatedAttributeList[index]['has_reference'] = true;
      updatedAttributeList[index]['display_column'] = value;
    } else if (field === 'is_null' || field === 'is_unique') {
      updatedAttributeList[index][field] = !updatedAttributeList[index][field];
    } else {
      updatedAttributeList[index][field] = value;
    }
    setAttributeList(updatedAttributeList);
  };

  const formatCreateEntityRequest = (data) =>{
    return data.map((row)=>{
      return !defaultDataTypes.some(dataType => dataType.value === row.data_type)? {...row, has_reference: true}:row;
      });
  };
  
  const AttributeField = ({ id, label, value, onBlur }) => (
    <TextField
      id={id}
      label={label}
      value={value}
      onBlur={onBlur}
      fullWidth
      margin="normal"
    />
  );

  const AttributeFieldSelect = ({ id, label, value, onChange, options = [] }) => (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select id={id} value={value} onChange={onChange}>
        {options.map((option, idx) => (
          <MenuItem key={idx} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const AttributeCheckbox = ({ id, label, checked, onChange }) => (
    <FormControlLabel
      control={<Checkbox id={id} checked={checked} onChange={onChange} />}
      label={label}
    />
  );

  async function fetchEntities(){
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const entityList = await fetchEntityList(userData, activeAppApiKey);
    setEntityList(entityList);
    setLoading(false);
  }

  useEffect(() => {
    for(let index = 0;index < attributeList.length; index++){
      const element = document.getElementById(`attribute_name-${index}`);
      if(element){
        element.value = attributeList[index]['attribute_name'];
      }
    }
  }, [attributeList, name, icon, privacy]);

  useEffect(() => {
    fetchEntities();
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
        icon: icon,
        number_of_attribute: attributeNumber,
        privacy: privacy,
        attribute_list: formatCreateEntityRequest(attributeList)
      };
      console.log(`===== <handleSave> REQUESTDATA`);
      console.log(requestData);
      const jsonBody = JSON.stringify(requestData);
      const response = await fetch(`${API_ENDPOINT}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonBody,
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
            <EntityTable entityList={entityList}/>
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
                  <IconInputField icon={icon} setIcon={setIcon} />
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
                {attributeList && attributeList.map((attribute, index) => (
                  <React.Fragment key={'attribute-'+index}>
                    <Grid item xs={12} sm={4}>
                    <AttributeField
                        id={`attribute_name-${index}`}
                        label={`Attribute Name ${index + 1}`}
                        onBlur={(e) => onAttributeChange(index, 'attribute_name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    <AttributeFieldSelect
                                id={`data_type-${index}`}
                                label={`Data Type ${index + 1}`}
                                value={attribute.data_type}
                                onChange={(e) => onAttributeChange(index, 'data_type', e.target.value)}
                                options={[
                                  ...defaultDataTypes,
                                  ...mapEntityListToDataTypes(entityList)
                                ]}
                              />
                              {attribute.has_reference && (
                                <AttributeFieldSelect
                                  id={`display_column-${index}`}
                                  label={`Display Column ${index + 1}`}
                                  value={attribute.display_column}
                                  onChange={(e) => onAttributeChange(index, 'display_column', e.target.value)}
                                  options={entityAttributes}
                                />
                              )}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeCheckbox
                        id={`is_null-${index}`}
                        label= {`Nullable ${index + 1}`}
                        checked={attribute.is_null || false}
                        onChange={(e)=>onAttributeChange(index, 'is_null', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <AttributeCheckbox
                        id={`is_unique-${index}`}
                        label= {`Unique ${index + 1}`}
                        checked={attribute.is_unique || false}
                        onChange={(e)=>onAttributeChange(index, 'is_unique', e.target.value)}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
               <Grid item xs={12} sm={12}>
                <Box display="flex" alignItems="center">
                  <Button
                    xs={12}
                    sm={2}
                    variant="outlined"
                    color="primary"
                    onClick={handleAddAttribute}
                    startIcon={<Add />}
                  >
                    Add Attribute
                  </Button>
                  <Box ml={2}>
                    <Button
                      xs={12}
                      sm={2}
                      variant="outlined"
                      color="secondary"
                      onClick={handleRemoveAttribute}
                      disabled={attributeNumber <= 1}
                      startIcon={<Remove />}
                    >
                      Remove Attribute
                    </Button>
                  </Box>
                </Box>
              </Grid>
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
