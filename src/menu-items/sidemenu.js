// assets
import { IconDashboard, IconArticle } from "@tabler/icons";
import dashboard from "./dashboard";
import createEntity from "./createEntity";
import formatTitle from "utils/title-formatter";
import { fetchEntityList } from "utils/entityApi";

// constant
const icons = { IconDashboard, IconArticle };


// Generate menu items based on the API response
const generateMenuItems = async () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const activeAppApiKey = localStorage.getItem("activeApp") || "";
  const entityData = await fetchEntityList(userData, activeAppApiKey);

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
