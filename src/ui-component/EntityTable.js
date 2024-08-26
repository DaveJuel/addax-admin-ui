import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { iconMapping } from './IconInputField';
import { Article, Edit } from '@mui/icons-material';
import formatTitle from 'utils/title-formatter';
import { destroyEntity } from 'utils/entityApi';

const EntityTable = ({ entityList, handleDelete }) => {
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

  const handleDeleteEntity = async (entityName) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await destroyEntity(entityName, userData, activeAppApiKey);
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

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {entityList.length > 0 &&
              Object.keys(entityList[0]).map((key) =>
                key !== "uuid" ? (
                  <TableCell key={key}>
                    {formatTitle(key)}
                  </TableCell>
                ) : null
              )}
            <TableCell>Actions</TableCell> {/* Action column */}
          </TableRow>
        </TableHead>
        <TableBody>
          {entityList.map((dataItem, index) => (
            <TableRow key={index}>
              {Object.keys(dataItem).map((key) =>
                key !== "uuid" ? (
                  <TableCell key={key}>
                    {key === 'icon' ? (
                      iconMapping[dataItem[key]] ? 
                        React.createElement(iconMapping[dataItem[key]], { fontSize: "small" }) :
                        React.createElement(Article, { fontSize: "small" })
                    ) : (
                      dataItem[key]
                    )}
                  </TableCell>
                ) : null
              )}
              <TableCell>
                <IconButton onClick={handleClickOpen}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteEntity(dataItem.name)} size="small" aria-label="delete">
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
    </>
  );
};

export default EntityTable;
