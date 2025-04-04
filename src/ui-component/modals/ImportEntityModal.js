import { useState } from "react";
import { Modal, Paper, Box, Typography, Button, TextField, Snackbar, Alert, SnackbarContent } from "@mui/material";
import { apiUrl } from "utils/httpclient-handler";
import formatTitle from "utils/title-formatter";

const API_ENDPOINT = `${apiUrl}/entity`;

const ImportEntityModal = ({ showImportModal, handleModalClose, entityName, setReload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";

      const response = await fetch(`${API_ENDPOINT}/import/${entityName}/`, {
        method: "POST",
        headers: {
          "token": userData.login_token,
          "api_key": activeAppApiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      setMessage("File uploaded successfully!");
      setMessageType("success");
      setSelectedFile(null);
      setReload(true);
      handleModalClose();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setUploading(false);
      setOpenSnackbar(true);
    }
  };


  const handleExport = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const activeAppApiKey = localStorage.getItem("activeApp") || "";
      const response = await fetch(`${API_ENDPOINT}/template/${entityName}`, {
        method: "GET",
        headers: {
          "token": userData.login_token,
          "api_key": activeAppApiKey
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to export file");
      }
  
      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Create a download link
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_data.xlsx";
      document.body.appendChild(a);
      a.click();
  
      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };
  

  return (
    <Modal open={showImportModal} onClose={handleModalClose}>
      <Paper sx={{position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', 
                    width: "80%", 
                    p: 3, mx: "auto", 
                    mt: "10%", 
                    maxHeight: '90vh',
                    overflowY: 'auto',}}>
        <Box>
          <Typography variant="h6" gutterBottom>Upload {formatTitle(entityName)} File</Typography>

          {/* Download Template Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            sx={{ mb: 2 }}
          >
            Download Template
          </Button>

          {/* File Upload Input */}
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            inputProps={{ accept: ".xlsx, .csv" }}
            sx={{ mb: 2 }}
          />

          {/* Upload Button */}
          <Button
            variant="contained"
            color="success"
            onClick={handleUploadClick}
            disabled={!selectedFile || uploading}
            sx={{ mr: 2 }}
          >
            Upload File
          </Button>

          {/* Cancel Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleModalClose}
          >
            Cancel
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
            <SnackbarContent>
              <Alert severity={messageType} onClose={() => setOpenSnackbar(false)}>
                {message}
              </Alert>
            </SnackbarContent>
          </Snackbar>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ImportEntityModal;
