import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import TableEmptyState from "views/utilities/TableEmptyState";
import { fetchEntityData, fetchEntityProperties } from "utils/entityApi";
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';

const fileIcons = {
  'doc': DescriptionIcon, 
  'docx': DescriptionIcon, 
  'xls': TableChartIcon,   
  'xlsx': TableChartIcon,   
  'ppt': SlideshowIcon,     
  'pptx': SlideshowIcon,   
  'pdf': PictureAsPdfIcon,
  'jpeg': ImageIcon,
  'jpg': ImageIcon,
  'png': ImageIcon,
  'svg': ImageIcon,
  'mp3': MusicNoteIcon,
  'mp4': VideoLibraryIcon
};

const acceptedFileTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpeg', 'jpg', 'png', 'svg', 'mp3', 'mp4'];


const FileViewPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileProperties, setFileProperties] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const activeAppApiKey = localStorage.getItem("activeApp") || "";
    const fetchData = async () => {
      const properties = await fetchEntityProperties('file_upload', userData, activeAppApiKey);
      setFileProperties(properties);

      const list = await fetchEntityData('file_upload', userData, activeAppApiKey);
      setFiles(list);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    
  };


  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const getFileIcon = (extension) => {
    return fileIcons[extension] || DescriptionIcon; // Default to DescriptionIcon if no match
  };

  if (!fileProperties) {
    return <div>Loading...</div>;
  }
//   const { attribute_list } = fileProperties;

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {/* Add your dynamic content here based on the entityName */}
          {/* You can fetch data or render specific details */}
          Uploaded Files
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Upload New
        </Button>
      </Box>
      {/* Generate table based on attribute_list */}
      {loading ? (
        <Typography variant="body2">Loading files ...</Typography>
      ) : files.length === 0 ? (
        <TableEmptyState p={2} />
      ) : (
        <Grid container spacing={3} mt={2}>
          {files.map((file, index) => {
            const fileName = file.name;
            const fileExtension = getFileExtension(fileName);
            const FileIcon = getFileIcon(fileExtension);

            // Ensure only accepted file types are shown
            if (!acceptedFileTypes.includes(fileExtension)) return null;

            return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-5px)" },
                    m: 2,
                  }}
                >
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                      <FileIcon sx={{ fontSize: 80, color: "#1976d2", mb: 2 }} />
                      <Typography variant="body1" noWrap sx={{ mb: 1 }}>
                        {`${fileName}`}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GetAppIcon />}
                        target="_blank"
                        href={file.url_path}
                        download
                      >
                        Download
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
            );
          })}
        </Grid>
      )}
    </MainCard>
  );
};
export default FileViewPage;
