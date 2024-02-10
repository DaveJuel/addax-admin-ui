// assets
import { IconDashboard, IconArticle } from "@tabler/icons";
import dashboard from "./dashboard";
import createEntity from "./createEntity";
import { apiUrl } from "utils/httpclient-handler";
import formatTitle from "utils/title-formatter";

// constant
const icons = { IconDashboard, IconArticle };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //
// Fetch data from the API
const fetchEntityList = async () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const activeAppApiKey = localStorage.getItem("activeApp") || "";
  const url = `${apiUrl}/entity/list`;
  const requestData = {
    username: userData.username,
    login_token: userData.login_token,
    api_key: activeAppApiKey,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result; // Assuming the actual menu data is in the 'result' field
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};



// Generate menu items based on the API response
const generateMenuItems = async () => {
  const entityData = await fetchEntityList();

  // Map API response to menu items
  const entityMenuItems = entityData.map((item) => ({
    id: `entity-${item.uuid}`,
    title: formatTitle(item.name),
    icon: icons.IconArticle,
    type: "item",
    url: `/entity/${item.name}`,
    breadcrumbs: false,
  }));
  const titleText = entityMenuItems.length > 1 ? "Entities" : "Entity";
  // Construct the 'entity' group with its children
  entityMenuItems.push(createEntity);
  const entityGroup = {
    id: "entity",
    title: titleText,
    icon: icons.IconDashboard, // You may want to adjust this based on the API response
    type: "group",
    children: entityMenuItems,
  };

  // Construct the final menu items
  const menuItems = {
    items: [dashboard, entityGroup], // Include the 'dashboard' menu item
  };

  return menuItems;
};

export default generateMenuItems;
