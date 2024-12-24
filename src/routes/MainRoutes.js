import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import EntityPage from "views/entity/View";
import EntityConfigPage from "views/entity/Config";
import UserListPage from "views/user/List";
import FileViewPage from "views/files/View";
import UserProfilePage from "views/user/Profile";
import UserPrivilegesPage from "views/user/Privileges";
import AppProfilePage from "views/settings/AppProfile";
import PaymentMethods from "views/settings/PaymentMethods";
import Subscription from "views/settings/Subscription";
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("views/dashboard")));

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("views/utilities/Typography"))
);
const SettingsColor = Loadable(lazy(() => import("views/settings/ColorPalette")));
const UtilsShadow = Loadable(lazy(() => import("views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
  lazy(() => import("views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("views/utilities/TablerIcons"))
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
    },
    {
      path: "dashboard",
      children: [
        {
          path: "default",
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: "entity/:entityName",
      element: <EntityPage />,
    },
    {
      path: "/entity/config",
      element: <EntityConfigPage />,
    },
    {
      path: "user/list",
      element: <UserListPage />,
    },
    {
      path: "user/profile",
      element: <UserProfilePage />,
    },
    {
      path: "user/privileges",
      element: <UserPrivilegesPage />,
    },
    {
      path: "files",
      element: <FileViewPage />,
    },
    {
      path:"settings",
      children: [
        {
          path:"app-profile",
          element: <AppProfilePage />
        },
        {
          path: "color-palette",
          element: <SettingsColor />
        },
        {
          path: "subscription",
          element: <Subscription />
        },
        {
          path: "payment-methods",
          element: <PaymentMethods />
        }
      ]
    },
    {
      path: "utils",
      children: [
        {
          path: "util-typography",
          element: <UtilsTypography />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-color",
          element: <SettingsColor />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-shadow",
          element: <UtilsShadow />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "tabler-icons",
          element: <UtilsTablerIcons />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "material-icons",
          element: <UtilsMaterialIcons />,
        },
      ],
    },
  ],
};

export default MainRoutes;
