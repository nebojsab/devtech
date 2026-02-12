import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Badge,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { Search, Notifications } from '@mui/icons-material';

function Header() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        height: 70,
      }}
    >
      {/* Search Bar */}
      <TextField
        placeholder="Search"
        variant="outlined"
        size="small"
        sx={{
          width: 300,
          '& .MuiOutlinedInput-root': {
            bgcolor: '#f5f5f5',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#ccc',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#666',
            '&::placeholder': {
              color: '#999',
              opacity: 1,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#999', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Notifications */}
        <IconButton
          sx={{
            color: '#666',
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
          }}
        >
          <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { bgcolor: '#ff6b6b', color: '#fff' } }}>
            <Notifications sx={{ fontSize: 24 }} />
          </Badge>
        </IconButton>

        {/* User Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#e0e0e0',
            color: '#666',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          ET
        </Avatar>
      </Box>
    </Box>
  );
}

export default Header;
