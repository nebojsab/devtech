import React, { useState } from 'react';
import { Alert, Avatar, Box, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material';
import { Business, Edit, Palette } from '@mui/icons-material';
import { useCompanyContext } from '../context/CompanyContext';

function MyCompany() {
  const { sessionUser, findCompanyById } = useCompanyContext();
  const [tabValue, setTabValue] = useState(0);

  const myCompany = findCompanyById(sessionUser.companyId);
  const myCompanyProfile = {
    stateOrProvince: myCompany?.stateOrProvince || 'Texas',
    zipCode: myCompany?.zipCode || '77396',
    country: myCompany?.country || 'United States',
    supportPhone: myCompany?.supportPhone || '-',
    supportUrl: myCompany?.supportUrl || '-',
    ...myCompany,
  };

  if (!myCompany) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
        <Alert severity="error">Signed-in company could not be resolved.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ color: '#333', fontWeight: 700 }}>
            {myCompanyProfile.name}
          </Typography>
          <IconButton size="small" sx={{ color: '#888' }}>
            <Edit sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Typography sx={{ color: '#999', fontSize: 25, mt: 0.5 }}>{myCompanyProfile.code || '-'}</Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_, nextTab) => setTabValue(nextTab)}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          mb: 3,
          '& .MuiTabs-indicator': { backgroundColor: '#333' },
          '& .MuiTab-root': {
            color: '#333',
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            minWidth: 'auto',
            mr: 3,
            '&.Mui-selected': { color: '#111', fontWeight: 600 },
          },
        }}
      >
        <Tab label="About" />
        <Tab label="Users" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '24px', width: '100%' }}>
          <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 700 }}>
                Company Information
              </Typography>
              <IconButton size="small" sx={{ color: '#888' }}>
                <Edit sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.75 }}>COMPANY LOGO</Typography>
                <Avatar sx={{ width: 74, height: 74, bgcolor: '#3515b0', color: '#fff' }}>
                  <Business sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.75 }}>BRAND COLOR</Typography>
                <Avatar sx={{ width: 74, height: 74, bgcolor: myCompanyProfile.brandColor || '#1e88e5', color: '#fff' }}>
                  <Palette sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>STREET ADDRESS</Typography>
                <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompanyProfile.streetAddress || '-'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>COMPANY PHONE</Typography>
                <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompanyProfile.phone || '-'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>CITY</Typography>
                <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompanyProfile.city || '-'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>STATE/PROVINCE</Typography>
                <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompanyProfile.stateOrProvince || '-'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>ZIP/POSTAL CODE</Typography>
                <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompanyProfile.zipCode || '-'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>COUNTRY</Typography>
                <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompanyProfile.country || '-'}</Typography>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 700 }}>
                  Contact
                </Typography>
                <IconButton size="small" sx={{ color: '#888' }}>
                  <Edit sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>PRIMARY CONTACT</Typography>
                    <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompanyProfile.primaryContact || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>EMAIL</Typography>
                    <Typography sx={{ color: '#999', fontSize: 14 }}>{myCompanyProfile.primaryContactEmail || '-'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>TECHNICAL CONTACT</Typography>
                    <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompanyProfile.technicalContact || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>EMAIL</Typography>
                    <Typography sx={{ color: '#999', fontSize: 14 }}>{myCompanyProfile.technicalContactEmail || '-'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>BILLING CONTACT</Typography>
                    <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompanyProfile.billingContact || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>EMAIL</Typography>
                    <Typography sx={{ color: '#999', fontSize: 14 }}>{myCompanyProfile.billingContactEmail || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 700 }}>
                  Support
                </Typography>
                <IconButton size="small" sx={{ color: '#888' }}>
                  <Edit sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>SUPPORT EMAIL</Typography>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompanyProfile.supportEmail || '-'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>SUPPORT PHONE</Typography>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompanyProfile.supportPhone || '-'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>SUPPORT URL</Typography>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompanyProfile.supportUrl || '-'}</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <Typography sx={{ color: '#999', fontSize: 14 }}>Users section for My Company is coming soon.</Typography>
        </Paper>
      )}
    </Box>
  );
}

export default MyCompany;
