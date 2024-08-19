import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { iconMapping } from './IconInputField';
import { Article } from '@mui/icons-material';
import formatTitle from 'utils/title-formatter';
// import { iconMapping } from './iconMapping'; 


const EntityTable = ({ entityList, handleDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {entityList.length > 0 &&
            Object.keys(entityList[0]).map((key) =>
              key !== "uuid" ? (
                <TableCell key={key}>
                  {formatTitle(key)}
                </TableCell>
              ) : null
            )}
          <TableCell>Actions</TableCell> {/* Action column */}
        </TableRow>
      </TableHead>
      <TableBody>
        {entityList.map((dataItem, index) => (
          <TableRow key={index}>
            {Object.keys(dataItem).map((key) =>
              key !== "uuid" ? (
                <TableCell key={key}>
                  {key === 'icon' ? (
                   iconMapping[dataItem[key]]? 
                    React.createElement(iconMapping[dataItem[key]], { fontSize: "small" }) :
                        React.createElement(Article, { fontSize: "small" })
                  ) : (
                    dataItem[key]
                  )}
                </TableCell>
              ) : null
            )}
            <TableCell>
              <IconButton onClick={() => handleDelete(dataItem.name)} size="small" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EntityTable;
