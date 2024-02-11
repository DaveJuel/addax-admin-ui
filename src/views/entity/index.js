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
  TextField,
  Grid,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import formatTitle from "utils/title-formatter";
import { apiUrl } from "utils/httpclient-handler";
import { fetchEntityData, fetchEntityProperties } from "utils/entityApi";

const API_ENDPOINT = `${apiUrl}/entity`;

const EntityPage = () => {
  const { entityName } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [entityData, setEntityData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleInputChange = (e, attributeName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [attributeName]: value,
    }));
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
        <Typography variant="body2">No content available</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {attribute_list.map((attribute) => (
                  <TableCell key={attribute.name}>{attribute.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {entityData.map((dataItem, index) => (
                <TableRow key={index}>
                  {attribute_list.map((attribute) => (
                    <TableCell key={attribute.name}>
                      {dataItem[attribute.name]}
                    </TableCell>
                  ))}
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
            <Typography variant="h6" gutterBottom>
              Add New {name}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {attribute_list.map((attribute) => (
                  <Grid key={attribute.name} item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={attribute.name}
                      variant="outlined"
                      value={formData[attribute.name] || ""}
                      onChange={(e) => handleInputChange(e, attribute.name)}
                    />
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
    </MainCard>
  );
};
export default EntityPage;
