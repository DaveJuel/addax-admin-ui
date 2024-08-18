// assets
import { IconDashboard, IconArticle } from "@tabler/icons";
import dashboard from "./dashboard";
import createEntity from "./createEntity";
import formatTitle from "utils/title-formatter";
import { fetchEntityList } from "utils/entityApi";
import utilities from "./utilities";
import { iconMapping } from "ui-component/IconInputField";

// constant
const icons = { IconDashboard, IconArticle };


// Generate menu items based on the API response
const generateMenuItems = async () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const activeAppApiKey = localStorage.getItem("activeApp") || "";
  const entityData = await fetchEntityList(userData, activeAppApiKey);

  // Map API response to menu items
  const entityMenuItems = entityData.map((item) => {
    // Get the corresponding icon component based on the item.icon name
    const SelectedIcon = iconMapping[item.icon];
  
    return {
      id: `entity-${item.uuid}`,
      title: formatTitle(item.name),
      icon: SelectedIcon || icons.IconArticle, // Fallback to a default icon if not found
      type: "item",
      url: `/entity/${item.name}`,
      breadcrumbs: false,
    };
  });
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
    items: [dashboard, entityGroup, utilities], // Include the 'dashboard' menu item
  };

  return menuItems;
};

export default generateMenuItems;
