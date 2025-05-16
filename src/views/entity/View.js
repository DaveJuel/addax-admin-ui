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
import { LongTextCell } from "ui-component/LongTextCell";

const API_ENDPOINT = `${apiUrl}/entity`;

const EntityPage = () => {
  const { entityName } = useParams();
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
      const entityDataResponse = await fetchEntityData(
        entityName,
        userData,
        activeAppApiKey
      );
      setEntityData(entityDataResponse || []);
      setName(entityName);
      setAttributeList(itemDetailsResponse?.attribute_list);
      setLoading(false);
      setReload(false);
    };
    setLoading(true);
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
      handleOpenSnackbar(error.message, 'error');
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

  const handleUploadFile = async (attribute, files) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
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
      handleOpenSnackbar(error.message, 'error');
    }
  }

  const handleInputChange = async (e, attribute) => {
    try {
      if (!attribute || !attribute.name) {
        console.warn("Invalid attribute passed to handleInputChange.");
        return;
      }
      const isStringInput = typeof e === 'string';
      const value = isStringInput ? e : e?.target?.value ?? '';
      const files = e?.target?.files;
      if (attribute.data_type === 'file' && files && files[0]) {
        await handleUploadFile(attribute, files);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [attribute.name]: value,
        }));
      }
    } catch (error) {
      console.error("Error in handleInputChange:", error);
    }
  };
  

  const handleOpenSnackbar = (message, status) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(status);
      setSnackbarOpen(true);
  }

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
      handleOpenSnackbar('Saved data successfully.', 'success');
    } catch (error) {
      handleOpenSnackbar(error.message || 'An error occurred while deleting the entity.', 'error');
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
        handleOpenSnackbar(response.result, 'success');
        setReload(true);
      } else {
        handleOpenSnackbar(response.result || 'An error occurred while deleting the entity.', 'error');
      }
    } catch (error) {
      handleOpenSnackbar('An unexpected error occurred. Please try again.', 'error');
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
        {!loading && (
          <>
            <Typography variant="body2">
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
          </>
        )}
      </Box>
      {/* Generate table based on attribute_list */}
      {loading && <TableLoadingState />}
      {!loading && entityData?.length === 0 && <TableEmptyState />}
      {!loading && entityData?.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {attributeList?.map((attribute) => (
                  <TableCell key={attribute.name}>{formatTitle(attribute.name)}</TableCell>
                ))}
                <TableCell key='actions'>Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entityData?.map((dataItem, index) => (
                <TableRow key={index}>
                  {attributeList?.map((attribute) => (
                    <TableCell key={attribute.name}>
                      {attribute.data_type === 'file' && dataItem[attribute.name] && (
                        <a href={dataItem[attribute.name]} target="_blank" rel="noopener noreferrer">
                          click here
                        </a>
                      )}
                      {attribute.data_type === 'long text' && (
                        <LongTextCell
                          attribute={attribute}
                          value={dataItem[attribute.name]}
                        />
                      )}
                      {attribute.data_type !== 'file' && attribute.data_type !== 'long text' && dataItem[attribute.name]}
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
            {isActionEdit ? 
              <Typography variant="h6" gutterBottom>Edit {formatTitle(name)}</Typography>
              :
              <Typography variant="h6" gutterBottom>Add New {formatTitle(name)}</Typography>
            }
          </Box>
          <Box style={{paddingTop: '10px'}} sx={{top: '10%', overflowY: 'auto', flexGrow: 1 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {attributeList?.map((attribute) => (
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
                  disabled={submitting}
                >
                  Cancel
                </Button>
                {submitting && (
                  <Typography  variant="h6" color="warning" align="center">
                    Saving ...
                  </Typography>
                )}
                
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
