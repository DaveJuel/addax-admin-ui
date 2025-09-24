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
  Divider,
  TextField,
  TablePagination
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
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
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const startIndex = page * rowsPerPage;
  const paginatedData = entityData?.slice(startIndex, startIndex + rowsPerPage);
  

  useEffect(() => {
    if (!entityName) return;
    
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const entityProperties = await fetchEntityProperties(userData,
        entityName
      );
      const entityData = await fetchEntityData(userData,
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

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Searching for:', searchValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      await updateEntityData();
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
      const userData = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const entityData = await fetchEntityData(userData,
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
      const userData = JSON.parse(localStorage.getItem("user"));
      await saveEntityData(userData,isActionEdit, entityName, formData);
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
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await deleteEntityInstance(userData, entityName,instance.uuid);
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
      <Box justifyContent="space-between" gap={3} alignItems="center">
        {!loading && (
          <>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.025em',
                textTransform: 'capitalize',
                marginBottom: '10px'
              }}
            >
              {formatTitle(name)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Search Box */}
              {entityData?.length > 0 && (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 280,
                    maxWidth: 400,
                  }}
                >
                  <TextField
                    placeholder={`Search ${formatTitle(name)}...`}
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        paddingRight: '48px',
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                        '&.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px 12px',
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSearch}
                    sx={{
                      position: 'absolute',
                      right: 4,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'primary.lighter',
                      },
                    }}
                    size="small"
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddClick}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3
                  }}
                >
                  Add New
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleImportClick}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3
                  }}
                >
                  Bulk Import
                </Button>
                {entityData?.length > 0 && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleExport}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 3
                    }}
                  >
                    Export
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Separator */}
      <Divider sx={{ my: 2 }} />

      {/* Generate table based on attribute_list */}
      {loading && <TableLoadingState />}
      {!loading && entityData?.length === 0 && <TableEmptyState />}
      {!loading && entityData?.length > 0 && (
        <>
          <TableContainer sx={{ borderRadius: 2, boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  {attributeList?.map((attribute) => (
                    <TableCell
                      key={attribute.name}
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textTransform: 'capitalize'
                      }}
                    >
                      {formatTitle(attribute.name)}
                    </TableCell>
                  ))}
                  <TableCell
                    key='actions'
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData?.map((dataItem, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': { backgroundColor: 'grey.50' },
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    {attributeList?.map((attribute) => (
                      <TableCell key={attribute.name}>
                        {attribute.data_type === 'file' && dataItem[attribute.name] && (
                          <a
                            href={dataItem[attribute.name]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'primary.main',
                              textDecoration: 'none',
                              fontWeight: 500
                            }}
                          >
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
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          onClick={() => handleEditClick(dataItem)}
                          size="small"
                          aria-label="edit"
                          sx={{
                            color: 'primary.main',
                            '&:hover': { backgroundColor: 'primary.lighter' }
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(dataItem)}
                          size="small"
                          aria-label="delete"
                          sx={{
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'error.lighter' }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              px: 2
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, entityData.length)} of {entityData.length} entries
            </Typography>
            
            <TablePagination
              component="div"
              count={entityData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiTablePagination-toolbar': {
                  minHeight: '52px'
                },
                '& .MuiTablePagination-selectLabel': {
                  fontWeight: 500
                },
                '& .MuiTablePagination-displayedRows': {
                  fontWeight: 500
                }
              }}
            />
          </Box>
        </>
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
              <Box mt={2} gap={3} style={{margin: "20px 0px 10px 0px"}}>
                {
                  isActionEdit ?
                  <Button style={{marginRight: "10px"}}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Update
                  </Button>
                  :
                  <Button style={{marginRight: "10px"}}
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
