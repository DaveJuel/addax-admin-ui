import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/authentication/authentication3/Login3')));
const SelectApp = Loadable(lazy(() => import('views/authentication/authentication3/SelectApp')));
const AuthRegister3 = Loadable(lazy(() => import('views/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthLogin3 />
    },
    {
      path: '/auth/login',
      element: <AuthLogin3 />
    },
    {
      path: '/auth/select/app',
      element: <SelectApp />
    },
    {
      path: '/auth/register',
      element: <AuthRegister3 />
    }
  ]
};

export default AuthenticationRoutes;
