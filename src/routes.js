import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdAddHome,
  MdAddchart,
  MdOutlineDataExploration
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdAddchart} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Site Dashboard',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdAddHome}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: 'Data Région',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
  },
  {
    name: 'Data Site',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdOutlineDataExploration} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  
  
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  
  // {
  // //   name: 'RTL Admin',
  // //   layout: '/rtl',
  // //   path: '/rtl-default',
  // //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  // //   component: <RTL />,
  // // },
];

export default routes;
