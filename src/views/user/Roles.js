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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import TableEmptyState from "views/utilities/TableEmptyState";
import { fetchEntityData, fetchEntityProperties } from "utils/entityApi";
import formatTitle from "utils/title-formatter";

const UserRolesPage = () => {
  const [open, setOpen] = useState(false);
  const [rolesData, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleProperties, setRoleProperties] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const fetchData = async () => {
        const roleProperties = await fetchEntityProperties(
            'user_role',
            userData,
            activeAppApiKey
            );
        setRoleProperties(roleProperties);
        const list = await fetchEntityData(
            'user_role',
            userData,
            activeAppApiKey
        );
        setRoles(list);
        setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    handleClickOpen();
  };

  if (!roleProperties) {
    return <div>Loading...</div>;
  }
  const { attribute_list } = roleProperties;


  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          Roles
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add New
        </Button>
      </Box>
      {/* Generate table based on attribute_list */}
      {loading ? (
        <Typography variant="body2">Loading roles ...</Typography>
      ) : rolesData.length === 0 ? (
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
              {rolesData.map((dataItem, index) => (
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
        <Dialog open={open} onClose={handleClose}>
                <DialogTitle >Coming Soon</DialogTitle>
                <DialogContent >
                This feature is under development and will be available soon.
                </DialogContent>
                <DialogActions >
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                </DialogActions>
        </Dialog>
    </MainCard>
  );
};
export default UserRolesPage;
