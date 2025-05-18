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
  Snackbar,
  Alert,
} from "@mui/material";
import formatTitle from "utils/title-formatter";
import { createEntity, fetchEntityList, fetchEntityProperties } from "utils/entityApi";
import IconInputField from "ui-component/IconInputField";
import EntityTable from "ui-component/EntityTable";
import { Add, Remove } from "@mui/icons-material";
import TableEmptyState from "views/utilities/TableEmptyState";
import TableLoadingState from "views/utilities/TableLoadingState";
import { useDispatch, useSelector } from "react-redux";
import { toggleReload } from "store/slices/globalSlice";
const EntityConfigPage = () => {
  const reload = useSelector((state) => state.global.reload);
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [entityList, setEntityList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    display_column: null,
    display_column_options: null,
  }]);
  const [isActionEdit, setIsActionEdit] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  
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
          const itemDetailsResponse = await fetchEntityProperties(value);
          if (itemDetailsResponse && itemDetailsResponse?.attribute_list) {
            updatedAttributeList[index]['display_column_options'] = mapEntityListToDataTypes(itemDetailsResponse.attribute_list);
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

  useEffect(() => {
    for(let index = 0;index < attributeList.length; index++){
      const element = document.getElementById(`attribute_name-${index}`);
      if(element){
        element.value = attributeList[index]['attribute_name'];
      }
    }
  }, [attributeList, name, icon, privacy]);

  useEffect(() => {
    async function fetchEntities(){
    try{
      const response = await fetchEntityList();
      const entityList = response.result;
      setEntityList(entityList);
      setLoading(false);
    }catch(error){
      handleOpenSnackbar(error.message || 'An unexpected error occurred. Please try again.', 'error');
    }
  }
    fetchEntities();
  }, [reload]);

  const handleOpenSnackbar = (message, status) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(status);
    setSnackbarOpen(true);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    try {
      const requestData = {
        entity_name: name,
        icon: icon,
        number_of_attribute: attributeNumber,
        privacy: privacy,
        attribute_list: formatCreateEntityRequest(attributeList)
      };
      await createEntity(requestData);
      handleOpenSnackbar('Entity created successfully!','success' );
      dispatch(toggleReload());
      setShowAddModal(false);
    } catch (error) {
      handleOpenSnackbar(error.message || 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddClick = () => {
    setIsActionEdit(false);
    setShowAddModal(true);
  };

  const handleEditClick = (entity) => {
    setIsActionEdit(true);
    setShowAddModal(true);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };
  return (
    <MainCard tit>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          Entities
        </Typography>
        {(userData.role === 'author' || userData.role === 'sysadmin' || userData.role === 'administrator') &&
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>}
      </Box>
      {loading ? (
        <TableLoadingState />
      ) : entityList.length === 0 ? (
        <TableEmptyState p={2} />
      ) : (
        <TableContainer>
            <EntityTable entityList={entityList} handleEdit={handleEditClick}/>
        </TableContainer>
      )}
      {/* Add New Entity Modal */}
      <Modal open={showAddModal} onClose={handleModalClose}>
        <Paper sx={{position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', 
                    width: "80%", 
                    p: 3, mx: "auto", 
                    mt: "10%", 
                    maxHeight: '90vh',
                    overflowY: 'auto',}}>
          <Box>
            {
              isActionEdit ? 
                <Typography variant="h6" gutterBottom>Modify entity</Typography>
              :
                <Typography variant="h6" gutterBottom>Create new entity</Typography>
            }
          </Box>
          <Box style={{paddingTop: '10px'}} sx={{ overflowY: 'auto', flexGrow: 1 }}>
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
                                  options={attribute.display_column_options}
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
                {
                  isActionEdit?
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    // onClick={handleSave}
                  >
                    Update
                  </Button>
                  :
                  <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      onClick={handleSave}
                      disabled={submitting}
                    >
                      Submit
                    </Button>
                }
               
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
        onClose={handleSnackbarClose} 
        severity={snackbarSeverity} 
        sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default EntityConfigPage;
