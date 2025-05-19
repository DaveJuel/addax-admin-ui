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
  Modal,
  Paper,
  Grid,
  FormControl,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import TableEmptyState from "views/utilities/TableEmptyState";
import { fetchUserProfiles } from "utils/userApi";
import { apiUrl } from "utils/httpclient-handler";
import { Edit } from "@mui/icons-material";
import { fetchEntityData } from "utils/entityApi";
import TableLoadingState from "views/utilities/TableLoadingState";

const API_ENDPOINT = `${apiUrl}/user`;

const UserListPage = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isActionEdit, setIsActionEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
  
    const fetchData = async () => {
      const entityDataResponse = await fetchUserProfiles();
      if(entityDataResponse){
        setUserData(entityDataResponse.result);
      }
      const roles = await fetchEntityData('user_role');
      setRoleList(roles);
      setLoading(false);
      setReload(false);
    };

    fetchData();
  }, [reload]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setSubmitting(true);
    try{
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const requestData = {     
        api_key: activeAppApiKey,
        username: username,
        user_role: selectedRole,
        password: password,
        confirm_password: confirmPassword,
      };
      const response = await fetch(`${API_ENDPOINT}/register`, {
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
        setSnackbarMessage(response.result || 'An error occurred while deleting the entity.');
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


  const handleAddClick = () => {
    setIsActionEdit(false);
    setShowAddModal(true);
  };

  const handleEditClick = (instance) =>{
    setIsActionEdit(true);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };


  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          Users
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {loading ? (
        <TableLoadingState />
      ) : userData.length === 0 ? (
        <TableEmptyState p={2} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell key='username'>Username</TableCell>
                <TableCell key='type'>Type</TableCell>
                <TableCell key='last_login'>Last Login</TableCell>
                <TableCell key='role'>Role</TableCell>
                <TableCell key='status'>Status</TableCell>
                <TableCell key='actions'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((dataItem, index) => (
                <TableRow key={index}>
                    {Object.keys(dataItem).map((key) =>
                        key !== "uuid" && key!=="login_token" ? (
                        <TableCell key={key}>
                            {(dataItem[key])}
                        </TableCell>
                        ) : null
                    )}
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(dataItem)} size="small" aria-label="edit">
                        <Edit />
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
            <Typography variant="h5" align="center" gutterBottom>
              {isActionEdit ? 'Edit Invited User' : 'Invite User'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <TextField labelId="email-label" label="Email" type="text"  value={username}
                    onChange={(e) => setUsername(e.target.value)}
                   />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="roles-label">Roles</InputLabel>
                    <Select
                      labelId="roles-label"
                      label="Roles"
                      onChange={(e) => setSelectedRole(e.target.value)}
                      required
                    >
                      {roleList && roleList.map((role, index) => (
                        <MenuItem key={index} value={role.title}>
                          {role.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <TextField labelId="password-label" label="Password" type="password"  value={password}
                    onChange={(e) => setPassword(e.target.value)}
                   />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <TextField labelId="confirm-password-label" label="Confirm Password" type="password"  value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                   />
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={(handleModalClose)}
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
export default UserListPage;
