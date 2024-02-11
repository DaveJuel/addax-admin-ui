import React, { useEffect, useState } from "react";

import MainCard from "ui-component/cards/MainCard";
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
  } from "@mui/material";
import { apiUrl } from "utils/httpclient-handler";
import formatTitle from "utils/title-formatter";

const EntityConfigPage = () => {
  const [entityList, setEntityList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_ENDPOINT = `${apiUrl}/entity`;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const requestData = {
      username: userData.username,
      login_token: userData.login_token,
      api_key: activeAppApiKey,
    };
    const fetchEntityList = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEntityList(data.result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching entity data:", error);
      }
    };
    fetchEntityList();
  }, [API_ENDPOINT]);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };
  return (
    <MainCard tit>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          Entity list.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {loading ? (
        <Typography variant="body2">Loading entity data...</Typography>
      ) : entityList.length === 0 ? (
        <Typography variant="body2">No content available</Typography>
      ) : (
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {entityList.length > 0 && Object.keys(entityList[0]).map((key) => (
                key !== 'uuid' && (
                  <TableCell key={key}>{formatTitle(key)}</TableCell>
                )
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {entityList.map((dataItem, index) => (
              <TableRow key={index}>
                {Object.keys(dataItem).map((key) => (
                  key !== 'uuid' && (
                    <TableCell key={key}>{dataItem[key]}</TableCell>
                  )
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
              Create new entity
            </Typography>
          </Box>
        </Paper>
      </Modal>
    </MainCard>
  );
};

export default EntityConfigPage;
