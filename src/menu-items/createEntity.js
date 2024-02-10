// assets
import { IconPlus } from '@tabler/icons';

// constant
const icons = { IconPlus };

// ==============================|| Entity MENU ITEMS ||============================== //

const createEntity = {
  id: 'entity',
  title: 'Create Entity',
  icon: icons.IconPlus,
  type: 'item',
  url: '/entity/create',
  breadcrumbs: false,
};

export default createEntity;