import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import formatTitle from "utils/title-formatter";
import { apiUrl } from "utils/httpclient-handler";

const API_ENDPOINT = `${apiUrl}/entity`;

const EntityPage = () => {
  const { entityName } = useParams();
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";

      const requestData = {
        entity_name: entityName,
        username: userData.username,
        login_token: userData.login_token,
        api_key: activeAppApiKey,
      };

      try {
        const response = await fetch(`${API_ENDPOINT}/read/properties`, {
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
        setItemDetails(data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [entityName]);

  if (!itemDetails) {
    return <div>Loading...</div>;
  }

  const {
    uuid,
    name,
    icon,
    privacy,
    added_by,
    added_on,
    last_update_on,
    last_update_by,
    number_of_attribute,
    attribute_list,
  } = itemDetails;

  return (
    <MainCard title={`Details for ${formatTitle(name)}`}>
      <Typography variant="body2">
        <div>UUID: {uuid}</div>
        <div>Name: {name}</div>
        <div>Icon: {icon}</div>
        <div>Privacy: {privacy}</div>
        <div>Added by: {added_by}</div>
        <div>Added on: {added_on}</div>
        <div>Last update on: {last_update_on}</div>
        <div>Last update by: {last_update_by}</div>
        <div>Number of attributes: {number_of_attribute}</div>
      </Typography>
      {/* Generate table based on attribute_list */}
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
            {/* You can add rows here based on your data */}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default EntityPage;
