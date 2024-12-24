import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import { CheckCircle, Cancel } from "@mui/icons-material";

const plansData = [
  {
    packageName: "Starter",
    monthlyPrice: "99",
    yearlyPrice: "1000",
    subtitle: "Perfect for small businesses or personal projects needing essential features.",
    offers: [
      { text: "300 Entities", status: "active" },
      { text: "2 Users & 2 Roles", status: "active" },
      { text: "20GB Data Storage", status: "active" },
      { text: "Basic App Configuration", status: "active" },
      { text: "Stripe Integration Only", status: "active" },
      { text: "Dashboard", status: "active" },
      { text: "Basic Data Import/Export", status: "active" },
      { text: "Pre-built Reports", status: "active" },
      { text: "Custom Domain & Multiple Applications", status: "inactive" },
      { text: "Full App Customization", status: "inactive" },
      { text: "Advanced Integrations (Payments, SMS, Stock)", status: "inactive" },
      { text: "Priority Support & Consultancy", status: "inactive" },
    ],
  },
  {
    packageName: "Adapt",
    monthlyPrice: "199",
    yearlyPrice: "2000",
    subtitle: "Tailored for growing businesses needing more features and integrations.",
    isRecommended: true,
    offers: [
      { text: "1,000 Entities", status: "active" },
      { text: "5 Users & 3 Roles", status: "active" },
      { text: "50GB Data Storage", status: "active" },
      { text: "Limited App Configuration", status: "active" },
      { text: "Stripe & MasterCard Integration", status: "active" },
      { text: "Dashboard", status: "active" },
      { text: "Advanced Data Import/Export", status: "active" },
      { text: "Customizable Reports", status: "active" },
      { text: "Custom Domain & Multiple Applications", status: "inactive" },
      { text: "Full App Customization", status: "inactive" },
      { text: "Advanced Integrations (Payments, SMS, Stock)", status: "inactive" },
      { text: "Priority Support & Consultancy", status: "inactive" },
    ],
  },
  {
    packageName: "Platinum",
    monthlyPrice: "399",
    yearlyPrice: "4000",
    subtitle: "Advanced features and integrations for enterprises needing flexibility.",
    offers: [
      { text: "2,500 Entities", status: "active" },
      { text: "20 Users & 10 Roles", status: "active" },
      { text: "500GB Data Storage", status: "active" },
      { text: "Full App Customization", status: "active" },
      { text: "Custom Domain & Multiple Applications", status: "active" },
      { text: "All Integrations (Payments, SMS, Stock)", status: "active" },
      { text: "Full Data Import/Export", status: "active" },
      { text: "Custom Reports & Insights", status: "active" },
      { text: "Priority Support & Consultancy", status: "active" },
    ],
  },
];

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState(plansData[0]); // Example: Starter Plan as default
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleConfirmChange = () => {
    setCurrentPlan(selectedPlan);
    setSnackbarMessage(`Switched to ${selectedPlan.packageName} plan successfully.`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setShowModal(false);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Current Plan
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5">{currentPlan.packageName}</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {currentPlan.subtitle}
          </Typography>
          <Typography variant="h6">${currentPlan.monthlyPrice}/month</Typography>
          <Typography variant="caption">or ${currentPlan.yearlyPrice}/year</Typography>
          <Box mt={2}>
            <Typography variant="subtitle1">Features:</Typography>
            <List>
              {currentPlan.offers.map((offer, index) => (
                <ListItem key={index}>
                  {offer.status === "active" ? (
                    <CheckCircle color="success" fontSize="small" />
                  ) : (
                    <Cancel color="error" fontSize="small" />
                  )}
                  <ListItemText primary={offer.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Available Plans
        </Typography>
        <Grid container spacing={2}>
          {plansData.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.packageName}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: plan.isRecommended ? "primary.main" : "grey.300",
                  borderWidth: plan.isRecommended ? 2 : 1,
                }}
              >
                <CardContent>
                  <Typography variant="h5">{plan.packageName}</Typography>
                  {plan.isRecommended && <Chip label="Recommended" color="primary" />}
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {plan.subtitle}
                  </Typography>
                  <Typography variant="h6">${plan.monthlyPrice}/month</Typography>
                  <Typography variant="caption">or ${plan.yearlyPrice}/year</Typography>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePlanSelect(plan)}
                      disabled={currentPlan.packageName === plan.packageName}
                    >
                      {currentPlan.packageName === plan.packageName
                        ? "Current Plan"
                        : "Choose Plan"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Change Plan Confirmation Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Paper>
          <Box p={3} mx="auto" mt={10} width="400px" textAlign="center">
            <Typography variant="h6" gutterBottom>
              Confirm Plan Change
            </Typography>
            <Typography variant="body2" gutterBottom>
              Are you sure you want to switch to the {selectedPlan?.packageName} plan?
            </Typography>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmChange}
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Subscription;
