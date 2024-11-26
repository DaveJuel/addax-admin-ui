// assets
import { IconPlus } from '@tabler/icons';

// constant
const icons = { IconPlus };

// ==============================|| Entity MENU ITEMS ||============================== //

const createEntity = {
  id: 'entity-config',
  title: 'Configuration',
  icon: icons.IconPlus,
  type: 'item',
  url: '/entity/config',
  breadcrumbs: false,
};

export default createEntity;