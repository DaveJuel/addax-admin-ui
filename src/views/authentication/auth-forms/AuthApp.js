import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";

const AppLogin = ({ ...others }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  // Check if user data and app list are available
  const appList = userData?.app_list || [];
  const onAppSelect = (apiKey) => (event) => {
    event.preventDefault();
    localStorage.setItem("activeApp", apiKey);
    navigate("/dashboard/default");
  };

  return (
    <>
      <form>
        <Box sx={{ mt: 2 }}>
          {appList.map((app) => (
            <AnimateButton key={app.id}>
              <Button
                disableElevation
                onClick={onAppSelect(app.api_key)}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
              >
                {app.name}
              </Button>
            </AnimateButton>
          ))}
        </Box>
      </form>
    </>
  );
};

export default AppLogin;
