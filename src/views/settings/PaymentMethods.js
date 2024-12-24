import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Paper,
  Grid,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { Edit, Delete as DeleteIcon } from "@mui/icons-material";
// import { renderInputField } from "utils/formUtils"; // Utility function to render input fields
import MainCard from "ui-component/cards/MainCard";
import renderInputField from "ui-component/InputField";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleModalOpen = () => {
    setFormData({});
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (isEditMode) {
      // Logic for updating a payment method
      setSnackbarMessage("Payment method updated successfully.");
    } else {
      // Logic for adding a new payment method
      setPaymentMethods((prev) => [...prev, formData]);
      setSnackbarMessage("Payment method added successfully.");
    }
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setSubmitting(false);
    setShowModal(false);
  };

  const handleEditClick = (method) => {
    setFormData(method);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = (method) => {
    setPaymentMethods((prev) => prev.filter((item) => item !== method));
    setSnackbarMessage("Payment method deleted successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Payment Methods</Typography>
        <Button variant="contained" color="primary" onClick={handleModalOpen}>
          Add New Payment Method
        </Button>
      </Box>
      {paymentMethods.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No payment methods added yet.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment Type</TableCell>
                <TableCell>Cardholder Name</TableCell>
                <TableCell>Card Number</TableCell>
                <TableCell>Billing Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentMethods.map((method, index) => (
                <TableRow key={index}>
                  <TableCell>{method.paymentType}</TableCell>
                  <TableCell>{method.cardholderName}</TableCell>
                  <TableCell>{method.cardNumber}</TableCell>
                  <TableCell>{method.billingAddress}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditClick(method)}
                      size="small"
                      aria-label="edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(method)}
                      size="small"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal open={showModal} onClose={handleModalClose}>
        <Paper>
          <Box p={3} width="500px" mx="auto" mt={10}>
            <Typography variant="h6" gutterBottom>
              {isEditMode ? "Edit Payment Method" : "Add New Payment Method"}
            </Typography>
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {renderInputField(
                    {
                      name: "paymentType",
                      label: "Payment Type",
                      data_type: "text",
                    },
                    formData,
                    handleInputChange
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderInputField(
                    {
                      name: "cardholderName",
                      label: "Cardholder Name",
                      data_type: "text",
                    },
                    formData,
                    handleInputChange
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderInputField(
                    {
                      name: "cardNumber",
                      label: "Card Number",
                      data_type: "text",
                    },
                    formData,
                    handleInputChange
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderInputField(
                    {
                      name: "billingAddress",
                      label: "Billing Address",
                      data_type: "text",
                    },
                    formData,
                    handleInputChange
                  )}
                </Grid>
              </Grid>
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                >
                  {isEditMode ? "Update" : "Submit"}
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleModalClose}>
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default PaymentMethods;
