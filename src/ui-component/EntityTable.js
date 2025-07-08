import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Article, Edit } from '@mui/icons-material';
import formatTitle from 'utils/title-formatter';
import { destroyEntity } from 'utils/entityApi';
import { iconMapping } from 'utils/iconMapping';
import { useDispatch } from 'react-redux';
import { toggleReload } from "store/slices/globalSlice";


const EntityTable = ({ entityList, handleEdit }) => {
  const dispatch = useDispatch ();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleDeleteEntity = async (entityName) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await destroyEntity(userData, entityName, userData, activeAppApiKey);
      if (response.success) {
        setSnackbarMessage(response.result);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        dispatch(toggleReload());
      } else {
        setSnackbarMessage(response.result || 'An error occurred while deleting the entity.');
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
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            {entityList.length > 0 &&
              Object.keys(entityList[0]).map((key) =>
                key !== "uuid" ? (
                  <TableCell key={key} 
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textTransform: 'capitalize'
                      }}>
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
                      key === "name" ? formatTitle(dataItem.name): dataItem[key]
                    )}
                  </TableCell>
                ) : null
              )}
              <TableCell>
                <IconButton onClick={() =>handleEdit(dataItem)} size="small" aria-label="edit">
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
