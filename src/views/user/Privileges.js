import React, { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
  Grid,
  Paper,
  Modal,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import MainCard from "ui-component/cards/MainCard";
import TableEmptyState from "views/utilities/TableEmptyState";
import { deleteEntityInstance, fetchEntityData, fetchEntityList, fetchEntityProperties } from "utils/entityApi";
import formatTitle from "utils/title-formatter";
import { Edit } from "@mui/icons-material";
import { apiUrl } from "utils/httpclient-handler";

const API_ENDPOINT = `${apiUrl}/entity`;

const UserPrivilegesPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [reload, setReload] = useState(false);
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [privProperties, setPrivProperties] = useState([]);
  const [isActionEdit, setIsActionEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [entityList, setEntityList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedReadLevel, setSelectedReadLevel] = useState(null);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const fetchData = async () => {
      const roles = await fetchEntityData('user_role', userData, activeAppApiKey);
      const response = await fetchEntityList(userData, activeAppApiKey);
      const privileges = await fetchEntityData('privilege', userData, activeAppApiKey);
      const privilegeTableProps = await fetchEntityProperties('privilege', userData, activeAppApiKey);
      setEntityList(response.result);
      setRoleList(roles);
      setPrivileges(privileges);
      setPrivProperties(privilegeTableProps);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setIsActionEdit(false);
    setShowAddModal(true);
  };

  const handleEditClick = (instance) =>{
    console.log(instance);
    setIsActionEdit(true);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleDelete = async (instance) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await deleteEntityInstance('privilege',instance.uuid,userData, activeAppApiKey);
      if (response.success) {
        setSnackbarMessage(response.result);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setReload(true);
      } else {
        setSnackbarMessage(response.error_message || 'An error occurred while deleting the entity.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting entity:', error);
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    if (reload) {
      window.location.reload(); // Reload the page when the snackbar closes and reload is required
    }
  };


  const handleSubmit = async (e) =>{
    e.preventDefault();
    setSubmitting(true);
    try{
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const requestData = {
        entity_name: 'privilege',
        username: userData.username,
        login_token: userData.login_token,
        api_key: activeAppApiKey,
        
        details: {
          entity_name: selectedEntity,
          user_role: selectedRole,
          access_level:selectedAccessLevel,
    	    read_level: selectedReadLevel
        },
      };
      const response = await fetch(`${API_ENDPOINT}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const jsonReply = await response.json();
      if (jsonReply.success) {
        setSnackbarMessage(jsonReply.result);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setReload(true);
      } else {
        setSnackbarMessage(response.error_message || 'An error occurred while deleting the entity.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }

      if (!response.ok) {
        throw new Error("Failed to save entity");
      }
      setShowAddModal(false);
    }catch(error){
      console.error("Error saving privileges:", error);
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!roleList || !entityList || !privProperties || !privileges) {
    return <div>Loading...</div>;
  }
  const { attribute_list } = privProperties;

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          Privileges
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {/* Generate table based on attribute_list */}
      {loading ? (
        <Typography variant="body2">Loading privileges ...</Typography>
      ) : privileges.length === 0 ? (
        <TableEmptyState p={2} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                    {attribute_list.map((attribute) => (
                    <TableCell key={attribute.name}>{formatTitle(attribute.name)}</TableCell>
                    ))}
                    <TableCell key='actions'>Actions
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {privileges.map((dataItem, index) => (
                <TableRow key={index}>
                {attribute_list.map((attribute) => (
                  <TableCell key={attribute.name}>
                    {attribute.data_type === 'file' ? (
                      <a href={dataItem[attribute.name]} target="_blank" rel="noopener noreferrer">
                        click here
                      </a>
                    ) : (
                      formatTitle(dataItem[attribute.name])
                    )}
                  </TableCell>
                ))}
                 <TableCell>
                    <IconButton onClick={() => handleEditClick(dataItem)} size="small" aria-label="edit">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(dataItem)} size="small" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal open={showAddModal} onClose={handleModalClose}>
        <Paper style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
          <Box p={3}>
            {/* Title based on Action */}
            <Typography variant="h5" align="center" gutterBottom>
              {isActionEdit ? 'Edit Privilege' : 'Add New Privilege'}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                
                {/* Entity List (Select Box) */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="entity-label">Entity List</InputLabel>
                    <Select
                      labelId="entity-label"
                      label="Entity List"
                      onChange={(e) => setSelectedEntity(e.target.value)}
                      required
                    >
                      {entityList.map((entity, index) => (
                        <MenuItem key={index} value={entity.name}>
                          {formatTitle(entity.name)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Roles (Select Box) */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="roles-label">Roles</InputLabel>
                    <Select
                      labelId="roles-label"
                      label="Roles"
                      onChange={(e) => setSelectedRole(e.target.value)}
                      required
                    >
                      {roleList.map((role, index) => (
                        <MenuItem key={index} value={role.title}>
                          {role.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Access Level (Radio Buttons) */}
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="subtitle1" gutterBottom>
                      Access Level
                    </Typography>
                    <RadioGroup
                      aria-label="access-level"
                      onChange={(e) => setSelectedAccessLevel(e.target.value)}
                    >
                      <FormControlLabel value="read" control={<Radio />} label="Read" />
                      <FormControlLabel value="write" control={<Radio />} label="Write" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Read Level (Radio Buttons) */}
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="subtitle1" gutterBottom>
                      Read Level
                    </Typography>
                    <RadioGroup
                      aria-label="read-level"
                      onChange={(e) => setSelectedReadLevel(e.target.value)}
                    >
                      <FormControlLabel value="self" control={<Radio />} label="Self" />
                      <FormControlLabel value="all" control={<Radio />} label="All" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Buttons Section */}
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                >
                  {isActionEdit ? 'Update' : 'Submit'}
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
export default UserPrivilegesPage;
