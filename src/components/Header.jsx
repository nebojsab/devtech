import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Badge,
  Avatar,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Search, Notifications } from '@mui/icons-material';
import { useCompanyContext } from '../context/CompanyContext';

function Header() {
  const { sessionUser, sessionPresetId, sessionAccountPresets, switchSessionPreset, companies, impersonateSessionUser } =
    useCompanyContext();

  const initials =
    sessionUser.initials ||
    sessionUser.displayName
      ?.split(' ')
      .map((token) => token.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'NA';

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Typography sx={{ fontSize: 11, color: '#777', fontWeight: 600 }}>SESSION</Typography>

          <Select
            value={sessionPresetId}
            size="small"
            onChange={(event) => switchSessionPreset(event.target.value)}
            sx={{
              minWidth: 220,
              height: 34,
              bgcolor: '#fff',
              fontSize: 13,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d8d8d8',
              },
            }}
          >
            <MenuItem value="custom">Custom session</MenuItem>
            {sessionAccountPresets.map((preset) => (
              <MenuItem key={preset.id} value={preset.id}>
                {preset.label}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={sessionUser.role}
            size="small"
            onChange={(event) =>
              impersonateSessionUser({
                role: event.target.value,
                companyId: sessionUser.companyId,
              })
            }
            sx={{
              minWidth: 140,
              height: 34,
              bgcolor: '#fff',
              fontSize: 13,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d8d8d8',
              },
            }}
          >
            <MenuItem value="PPA">PPA</MenuItem>
            <MenuItem value="ResellerAdmin">Non-PPA</MenuItem>
          </Select>

          <Select
            value={sessionUser.companyId}
            size="small"
            onChange={(event) =>
              impersonateSessionUser({
                role: sessionUser.role,
                companyId: Number(event.target.value),
              })
            }
            sx={{
              minWidth: 220,
              height: 34,
              bgcolor: '#fff',
              fontSize: 13,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d8d8d8',
              },
            }}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name} ({company.type})
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Notifications */}
        <IconButton
          sx={{
            color: '#666',
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
          }}
        >
          <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { bgcolor: '#888', color: '#fff' } }}>
            <Notifications sx={{ fontSize: 24 }} />
          </Badge>
        </IconButton>

        {/* User Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#d6d6d6',
            color: '#444',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {initials}
        </Avatar>
      </Box>
    </Box>
  );
}

export default Header;
