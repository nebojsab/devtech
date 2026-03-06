import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Handshake,
  Inventory,
  LocalOffer,
  Description,
  BarChart,
  History,
  HomeWork,
  Store,
} from '@mui/icons-material';

const menuItems = [
  { icon: Store, label: 'Companies', to: '/' },
  { icon: Handshake, label: 'Vendors' },
  { icon: Inventory, label: 'Catalog' },
  { icon: LocalOffer, label: 'Pricelists' },
  { icon: Description, label: 'Quotes' },
  { icon: BarChart, label: 'Reports' },
  { icon: History, label: 'Audit Logs' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCompaniesRoute = location.pathname === '/' || location.pathname.startsWith('/company/');
  const isMyCompanyRoute = location.pathname === '/my-company';

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Logo/Title */}
      <Box sx={{ p: 2, bgcolor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Store sx={{ fontSize: 28, color: '#666' }} />
          <Box sx={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Logo</Box>
        </Box>
      </Box>

      {/* Main Menu */}
      <List sx={{ flex: 1, p: 0 }}>
        {menuItems.map((item, index) => {
          const isActive = item.label === 'Companies' ? isCompaniesRoute : false;

          return (
          <ListItem
            key={index}
            onClick={() => {
              if (item.to) {
                navigate(item.to);
              }
            }}
            sx={{
              bgcolor: isActive ? '#f0f0f0' : 'transparent',
              borderLeft: isActive ? '3px solid #333' : 'none',
              pl: isActive ? 2.625 : 3,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f9f9f9',
              },
              color: '#666',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#999' }}>
              <item.icon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#333' : '#666',
                },
              }}
            />
          </ListItem>
          );
        })}
      </List>

      {/* Bottom Section */}
      <Box sx={{ borderTop: '1px solid #e0e0e0' }}>
        <ListItem
          onClick={() => navigate('/my-company')}
          sx={{
            bgcolor: isMyCompanyRoute ? '#f0f0f0' : 'transparent',
            borderLeft: isMyCompanyRoute ? '3px solid #333' : 'none',
            pl: isMyCompanyRoute ? 2.625 : 3,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#f9f9f9',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#999' }}>
            <HomeWork sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="My Company"
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: 14,
                color: isMyCompanyRoute ? '#333' : '#666',
                fontWeight: isMyCompanyRoute ? 600 : 400,
              },
            }}
          />
        </ListItem>
      </Box>

      {/* Version */}
      <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ fontSize: 11, color: '#999', textAlign: 'center' }}>
          Version 1.6.0-50-g6588f7d
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
