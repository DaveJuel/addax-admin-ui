import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from "ui-component/cards/MainCard";
import formatTitle from "utils/title-formatter";
import { apiUrl } from "utils/httpclient-handler";
import { deleteEntityInstance, fetchEntityData, fetchEntityProperties } from "utils/entityApi";
import renderInputField from "ui-component/InputField";
import TableEmptyState from "views/utilities/TableEmptyState";
import { Edit } from "@mui/icons-material";
import ImportEntityModal from "ui-component/modals/ImportEntityModal";
import TableLoadingState from "views/utilities/TableLoadingState";

const API_ENDPOINT = `${apiUrl}/entity`;

const EntityPage = () => {
  const { entityName } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [name, setName] = useState(entityName);
  const [attributeList, setAttributeList] = useState([]);
  const [entityData, setEntityData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [reload, setReload] = useState(false);
  const [isActionEdit, setIsActionEdit] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const fetchData = async () => {
      const itemDetailsResponse = await fetchEntityProperties(
        entityName,
        userData,
        activeAppApiKey
      );
      setItemDetails(itemDetailsResponse);
      const entityDataResponse = await fetchEntityData(
        entityName,
        userData,
        activeAppApiKey
      );
      setEntityData(entityDataResponse || []);
      setName(entityName);
      setAttributeList(itemDetailsResponse.attribute_list);
      setLoading(false);
      setReload(false);
    };

    fetchData();
  }, [entityName, reload]);

  const handleAddClick = () => {
    setIsActionEdit(false);
    setFormData({});
    setShowAddModal(true);
  };

  const handleExport = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await fetch(`${API_ENDPOINT}/export/${entityName}`, {
        method: "GET",
        headers: {
          "token": userData.login_token,
          "api_key": activeAppApiKey
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to export file");
      }
  
      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Create a download link
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_data.xlsx";
      document.body.appendChild(a);
      a.click();
  
      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };
  

  const handleEditClick = (instance) =>{
    setFormData(instance);
    setIsActionEdit(true);
    setShowAddModal(true);
  };

  const handleImportClick = () =>{
    setShowImportModal(true);
    setIsActionEdit(true);
  }

  const handleImportModalClose = () => {
    setShowImportModal(false);
  }

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleInputChange = async (e, attribute) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const { value, files } = e.target;
  
    if (attribute.data_type === 'file' && files && files[0]) {
      const formData = new FormData();
      formData.append('file', files[0]);
      try {
        setSubmitting(true);
        const response = await fetch(`${apiUrl}/upload/`, {
          method: 'POST',
          headers: {
            "token": userData.login_token,
            "api_key": activeAppApiKey,
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('File upload failed');
        }
  
        const data = await response.json();
        const fileUrl = data.result;
        setFormData((prevData) => ({
          ...prevData,
          [attribute.name]: fileUrl,
        }));
        setSubmitting(false);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [attribute.name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";

      const requestData = {
        entity_name: entityName,
       
        details: formData,
      };
      const path = isActionEdit? `${API_ENDPOINT}/${entityName}/${formData.uuid}` : `${API_ENDPOINT}/save/`;
      const method = isActionEdit? `PATCH`: `POST`;
      const response = await fetch(path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "token": userData.login_token,
          "api_key": activeAppApiKey,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to save entity");
      }
      setShowAddModal(false);
      const entityDataResponse = await fetchEntityData(
        entityName,
        userData,
        activeAppApiKey
      );
      setEntityData(entityDataResponse);
      setSnackbarMessage('Saved data successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setReload(true);
    } catch (error) {
      console.error("Error saving entity:", error);
      setSnackbarMessage(error.message || 'An error occurred while deleting the entity.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (instance) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await deleteEntityInstance(entityName,instance.uuid,userData, activeAppApiKey);
      if (response.success) {
        setSnackbarMessage(response.result);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setReload(true);
      } else {
        setSnackbarMessage(response.result || 'An error occurred while deleting the entity.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
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
  };

  return (
    <MainCard>
      <Box justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          {formatTitle(name)} entity records.
        </Typography>
        <Button variant="contained" color="success" onClick={handleExport}>
          Export
        </Button>
        <Button variant="contained" color="secondary" onClick={handleImportClick}>
          Bulk Import
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {/* Generate table based on attribute_list */}
      {loading ? (
        <TableLoadingState />
      ) :!itemDetails || !entityData || entityData.length === 0 ? (
        <TableEmptyState p={2} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {attributeList.map((attribute) => (
                  <TableCell key={attribute.name}>{formatTitle(attribute.name)}</TableCell>
                ))}
                <TableCell key='actions'>Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entityData?.map((dataItem, index) => (
                <TableRow key={index}>
                  {attributeList.map((attribute) => (
                    <TableCell key={attribute.name}>
                      {attribute.data_type === 'file' ? (
                        <a href={dataItem[attribute.name]} target="_blank" rel="noopener noreferrer">
                          click here
                        </a>
                      ) : (
                        dataItem[attribute.name]
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
      {/* Add New Entity Modal */}
      <Modal open={showAddModal} onClose={handleModalClose}>
        <Paper>
          <Box p={2}>
              {
                isActionEdit ?
                <Typography variant="h6" gutterBottom>Edit {formatTitle(name)}</Typography>
                :
                <Typography variant="h6" gutterBottom>Add New {formatTitle(name)}</Typography>
              }
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {attributeList.map((attribute) => (
                  <Grid key={attribute.name} item xs={12} md={6}>
                    {renderInputField(attribute, formData, handleInputChange)}
                  </Grid>
                ))}
              </Grid>
              <Box mt={2}>
                {
                  isActionEdit ?
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Update
                  </Button>
                  :
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
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
      <ImportEntityModal showImportModal={showImportModal} handleModalClose={handleImportModalClose} entityName={entityName} setReload={setReload}/>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};
export default EntityPage;
