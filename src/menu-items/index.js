import generateMenuItems from "./sidemenu";

// Load the menu items asynchronously
const loadMenuItems = async () => {
  try {
    const generatedMenuItems = await generateMenuItems();
    return { items: [...generatedMenuItems.items] };
  } catch (error) {
    console.error('Error loading menu items:', error.message);
    return { items: [] };
  }
};

// ==============================|| MENU ITEMS ||============================== //

// Load the menu items
const menuItems = loadMenuItems();

export default menuItems;