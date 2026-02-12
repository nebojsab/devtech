import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Business,
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
  { icon: Store, label: 'Companies', active: true },
  { icon: Handshake, label: 'Vendors', active: false },
  { icon: Inventory, label: 'Catalog', active: false },
  { icon: LocalOffer, label: 'Pricelists', active: false },
  { icon: Description, label: 'Quotes', active: false },
  { icon: BarChart, label: 'Reports', active: false },
  { icon: History, label: 'Audit Logs', active: false },
];

function Sidebar() {
  const navigate = useNavigate();

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
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => {
              if (item.label === 'Companies') {
                navigate('/');
              }
            }}
            sx={{
              bgcolor: item.active ? '#f0f0f0' : 'transparent',
              borderLeft: item.active ? '3px solid #333' : 'none',
              pl: item.active ? 2.625 : 3,
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
                  fontWeight: item.active ? 600 : 400,
                  color: item.active ? '#333' : '#666',
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Bottom Section */}
      <Box sx={{ borderTop: '1px solid #e0e0e0' }}>
        <ListItem
          sx={{
            pl: 3,
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
                color: '#666',
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
