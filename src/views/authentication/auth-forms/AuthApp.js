import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";
import { AppsThemeMap } from "utils/AppsThemeMap";
import { useDispatch } from "react-redux";

const AppLogin = ({ ...others }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  // Check if user data and app list are available
  const appList = userData?.app_list || [];
  const onAppSelect = (apiKey) => (event) => {
    event.preventDefault();
    const themes = AppsThemeMap();
    const appKey = themes.find((appTheme)=>appTheme.apiKey === apiKey)?.appKey || 'default';
    localStorage.setItem("activeApp", apiKey);
    localStorage.setItem("themeVariant", appKey);
    dispatch({
      type: 'SET_THEME_VARIANT',
      themeVariant: appKey
    });
    navigate("/dashboard/default");
  };

  return (
    <>
      <form>
        <Box id="app-selector" sx={{ mt: 2 }}>
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
