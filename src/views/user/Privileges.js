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
import { fetchEntityData, fetchEntityProperties } from "utils/entityApi";
import formatTitle from "utils/title-formatter";

const UserPrivilegesPage = () => {
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [privProperties, setPrivProperties] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const fetchData = async () => {
      const properties = await fetchEntityProperties('privilege', userData, activeAppApiKey);
      setPrivProperties(properties);

      const list = await fetchEntityData('privilege', userData, activeAppApiKey);
      setPrivileges(list);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    
  };

  if (!privProperties) {
    return <div>Loading...</div>;
  }
  const { attribute_list } = privProperties;

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          Privileges
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {/* Generate table based on attribute_list */}
      {loading ? (
        <Typography variant="body2">Loading privileges ...</Typography>
      ) : privileges.length === 0 ? (
        <TableEmptyState p={2} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                    {attribute_list.map((attribute) => (
                    <TableCell key={attribute.name}>{formatTitle(attribute.name)}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
              {privileges.map((dataItem, index) => (
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
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </MainCard>
  );
};
export default UserPrivilegesPage;
