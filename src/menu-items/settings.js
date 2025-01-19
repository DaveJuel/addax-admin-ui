// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconCreditCard } from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconCreditCard
};

// ==============================|| SETTINGS MENU ITEMS ||============================== //

const settings = {
  id: 'settings',
  title: 'Settings',
  type: 'group',
  children: [
    {
        id: 'settings-profile',
        title: 'App Profile',
        type: 'item',
        url: '/settings/app-profile',
        icon: icons.IconTypography,
        breadcrumbs: false
    },
    {
      id: 'settings-color',
      title: 'Color Palette',
      type: 'item',
      url: '/settings/color-palette',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
    {
      id: 'settings-billing',
      title: 'Billing',
      type: 'collapse',
      icon: icons.IconCreditCard,
      children:[
        {
            id: 'settings-payment-methods',
            title: 'Payment Methods',
            type: 'item',
            url: '/settings/payment-methods',
            breadcrumbs: false
          },
          {
            id: 'settings-subscription',
            title: 'Subscription',
            type: 'item',
            url: '/settings/subscription',
            breadcrumbs: false
          },
      ]
    },
  ]
};

export default settings;