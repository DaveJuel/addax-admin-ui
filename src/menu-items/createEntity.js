// assets
import { IconPlus } from '@tabler/icons';

// constant
const icons = { IconPlus };

// ==============================|| Entity MENU ITEMS ||============================== //

const createEntity = {
  id: 'create-entity',
  title: 'Create Entity',
  icon: icons.IconPlus,
  type: 'item',
  url: '/create/entity',
  breadcrumbs: false,
};

export default createEntity;