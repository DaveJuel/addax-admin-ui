import { IconDashboard, IconArticle } from "@tabler/icons";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import PeopleIcon from '@mui/icons-material/People';
import dashboard from "./dashboard";
import createEntity from "./createEntity";
import formatTitle from "utils/title-formatter";
import { CONFIG_ENTITIES, fetchEntityList } from "utils/entityApi";
import utilities from "./utilities";
import { iconMapping } from "ui-component/IconInputField";

const icons = { IconDashboard, IconArticle };
const generateMenuItems = async () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const activeAppApiKey = localStorage.getItem("activeApp") || "";
  const entityData = await fetchEntityList(userData, activeAppApiKey);
  const entityMenuItems = entityData.filter(item => !CONFIG_ENTITIES.includes(item.name)).map((item) => {
    
    const SelectedIcon = iconMapping[item.icon];
  
    return {
      id: `entity-${item.uuid}`,
      title: formatTitle(item.name),
      icon: SelectedIcon || icons.IconArticle,
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
    icon: icons.IconDashboard,
    type: "group",
    children: entityMenuItems,
  };

  const userAccess = [
    {
      id: `users`,
      title: `Users`,
      icon: PeopleIcon,
      type: "item",
      url: `/user/list`,
      breadcrumbs: false,
    },
    {
      id: `user-role`,
      title: `Roles`,
      icon: AssignmentIndIcon,
      type: "item",
      url: `/user/roles`,
      breadcrumbs: false,
    },
    {
      id: `user-privilege`,
      title: `Privileges`,
      icon: LockPersonIcon,
      type: "item",
      url: `/user/privileges`,
      breadcrumbs: false,
    },
  ];

  const accessLevel = {
    id: "user-access",
    title: "User Management",
    icon: icons.IconDashboard,
    type: "group",
    children: userAccess,
  };
  const menuItems = {
    items: [dashboard, entityGroup, accessLevel, utilities],
  };

  return menuItems;
};

export default generateMenuItems;
