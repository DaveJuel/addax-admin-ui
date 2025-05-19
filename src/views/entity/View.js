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
import { deleteEntityInstance, exportEntityData, fetchEntityData, fetchEntityProperties, saveEntityData, uploadFile } from "utils/entityApi";
import renderInputField from "ui-component/InputField";
import TableEmptyState from "views/utilities/TableEmptyState";
import { Edit } from "@mui/icons-material";
import ImportEntityModal from "ui-component/modals/ImportEntityModal";
import TableLoadingState from "views/utilities/TableLoadingState";
import { LongTextCell } from "ui-component/LongTextCell";

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
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isActionEdit, setIsActionEdit] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      const entityProperties = await fetchEntityProperties(
        entityName
      );
      const entityData = await fetchEntityData(
        entityName
      );
      setEntityData(entityData || []);
      setName(entityName);
      setAttributeList(entityProperties?.attribute_list);
      setLoading(false);
    };
    setLoading(true);
    fetchData();
  }, [entityName]);

  const handleAddClick = () => {
    setIsActionEdit(false);
    setFormData({});
    setShowAddModal(true);
  };

  const handleExport = async () => {
    try {
      await exportEntityData(entityName);
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
    setSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeApp = localStorage.getItem("activeApp");
      const fileUrl = await uploadFile(userData,activeApp,files[0]);
      setFormData((prevData) => ({
        ...prevData,
        [attribute.name]: fileUrl,
      }));
    } catch (error) {
      handleOpenSnackbar(error.message, 'error');
    }finally{
      setSubmitting(false);
    }
  }

  const handleInputChange = async (e, attribute) => {
    try {
      if (!attribute || !attribute.name) {
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
      handleOpenSnackbar(error.message || 'Input error', 'error');
    }
  };
  

  const handleOpenSnackbar = (message, status) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(status);
    setSnackbarOpen(true);
  }

  const updateEntityData = async () => {
    try{
      setLoading(true);
      const entityData = await fetchEntityData(
        entityName
      );
      setEntityData(entityData);
    }catch(error){
      handleOpenSnackbar(error.message ?? 'Error updating records','error');
    }finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await saveEntityData(isActionEdit, entityName, formData);
      setShowAddModal(false);
      handleOpenSnackbar('Saved successfully.', 'success');
      await updateEntityData();
    } catch (error) {
      handleOpenSnackbar(error.message || 'An error occurred while deleting the entity.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (instance) => {
    try {
      const response = await deleteEntityInstance(entityName,instance.uuid);
      if (response.success) {
        handleOpenSnackbar(response.result, 'success');
        await updateEntityData();
      } else {
        handleOpenSnackbar(response.result || 'An error occurred while deleting the entity.', 'error');
      }
    } catch (error) {
      handleOpenSnackbar(error.message || 'An unexpected error occurred. Please try again.', 'error');
    }
  };
  

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <MainCard>
      <Box justifyContent="space-between" gap={3} style={{margin: "20px 0px 10px 0px"}} alignItems="center">
        {!loading && (
          <>
            <Typography variant="body2">
              {formatTitle(name)} entity records.
            </Typography>
          
            <Button variant="contained" color="success" style={{marginRight: "4px"}} onClick={handleExport}>
              Export
            </Button>
            <Button variant="contained" color="secondary" style={{marginRight: "4px"}} onClick={handleImportClick}>
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
      <ImportEntityModal showImportModal={showImportModal} handleModalClose={handleImportModalClose} entityName={entityName} setUploading={setUploading} uploading={uploading}/>
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
