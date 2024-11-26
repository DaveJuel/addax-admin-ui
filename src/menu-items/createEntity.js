// assets
import { IconSettingsAutomation } from '@tabler/icons';

// constant
const icons = { IconSettingsAutomation };

// ==============================|| Entity MENU ITEMS ||============================== //

const createEntity = {
  id: 'entity-config',
  title: 'Configuration',
  icon: icons.IconSettingsAutomation,
  type: 'item',
  url: '/entity/config',
  breadcrumbs: false,
};

export default createEntity;