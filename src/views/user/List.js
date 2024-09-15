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
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import TableEmptyState from "views/utilities/TableEmptyState";
import { fetchUserProfiles } from "utils/userApi";

const UserListPage = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const fetchData = async () => {
      const entityDataResponse = await fetchUserProfiles(
        userData,
        activeAppApiKey
      );
      setUserData(entityDataResponse);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    
  };


  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          Users
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {/* Generate table based on attribute_list */}
      {loading ? (
        <Typography variant="body2">Loading users ...</Typography>
      ) : userData.length === 0 ? (
        <TableEmptyState p={2} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell key='first_name'>First name</TableCell>
              <TableCell key='last_name'>Last name</TableCell>
              <TableCell key='email'>Email</TableCell>
              <TableCell key='phone_number'>Phone number</TableCell>
              <TableCell key='address'>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((dataItem, index) => (
                <TableRow key={index}>
                    {Object.keys(dataItem).map((key) =>
                        key !== "uuid" ? (
                        <TableCell key={key}>
                            {(dataItem[key])}
                        </TableCell>
                        ) : null
                    )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </MainCard>
  );
};
export default UserListPage;
