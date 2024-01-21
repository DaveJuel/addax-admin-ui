// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import generateMenuItems from "menu-items/sidemenu";
import { useState } from "react";
import { useEffect } from "react";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const loadMenuItems = async () => {
    try {
      const generatedMenuItems = await generateMenuItems();
      return generatedMenuItems.items || []; // Ensure a default value if 'items' is undefined
    } catch (error) {
      console.error("Error loading menu items:", error.message);
      return [];
    }
  };

  // State to hold the menu items
  const [menuItems, setMenuItems] = useState([]);

  // Fetch and set menu items when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      const loadedMenuItems = await loadMenuItems();
      setMenuItems(loadedMenuItems);
    };

    fetchMenuItems();
  }, []);

  // Map through menu items and render NavGroup or an error message
  const navItems = menuItems.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
