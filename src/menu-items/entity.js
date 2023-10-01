// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const entity = {
  id: 'entity',
  title: 'Entity',
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'entity-view',
      title: 'Entity',
      type: 'item',
      url: '#',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default entity;