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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const API_ENDPOINT = `${apiUrl}/entity`;

const EntityPage = () => {
  const { entityName } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [entityData, setEntityData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [reload, setReload] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


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
      setEntityData(entityDataResponse);

      setLoading(false);
    };

    fetchData();
  }, [entityName]);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleInputChange = async (e, attribute) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const { value, files } = e.target;
  
    if (attribute.data_type === 'file' && files && files[0]) {
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('login_token', userData.login_token);
      formData.append('api_key', activeAppApiKey);
      formData.append('file', files[0]);
      try {
        const response = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('File upload failed');
        }
  
        const result = await response.json();
        const fileUrl = result.url;
        setFormData((prevData) => ({
          ...prevData,
          [attribute.name]: fileUrl,
        }));
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
        username: userData.username,
        login_token: userData.login_token,
        api_key: activeAppApiKey,
        details: formData,
      };
      const response = await fetch(`${API_ENDPOINT}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    } catch (error) {
      console.error("Error saving entity:", error);
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
        setReload(true); // Indicate that a reload is required after snackbar is closed
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

  if (!itemDetails) {
    return <div>Loading...</div>;
  }

  const { name, attribute_list } = itemDetails;

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          {formatTitle(name)} entity records.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {/* Generate table based on attribute_list */}
      {loading ? (
        <Typography variant="body2">Loading entity data...</Typography>
      ) : entityData.length === 0 ? (
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
              {entityData.map((dataItem, index) => (
                <TableRow key={index}>
                  {attribute_list.map((attribute) => (
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
                    <IconButton onClick={handleClickOpen}>
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
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogContent>
              This feature is under development and will be available soon.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
        
      )}
      {/* Add New Entity Modal */}
      <Modal open={showAddModal} onClose={handleModalClose}>
        <Paper>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Add New {formatTitle(name)}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {attribute_list.map((attribute) => (
                  <Grid key={attribute.name} item xs={12} md={6}>
                    {renderInputField(attribute, formData, handleInputChange)}
                  </Grid>
                ))}
              </Grid>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                >
                  Submit
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
