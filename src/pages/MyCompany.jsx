import React, { useState } from 'react';
import { Alert, Avatar, Box, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material';
import { Business, Edit, Palette } from '@mui/icons-material';
import { useCompanyContext } from '../context/CompanyContext';
import { sanitizeCustomHomepageHtml } from '../utils/sanitizeCustomHomepageHtml';

function MyCompany() {
  const { sessionUser, findCompanyById, getLandingHomepageForCompany } = useCompanyContext();
  const [tabValue, setTabValue] = useState(0);

  const myCompany = findCompanyById(sessionUser.companyId);
  const customHomepage = getLandingHomepageForCompany(sessionUser.companyId);
  const myCompanyProfile = {
    stateOrProvince: myCompany?.stateOrProvince || 'Texas',
    zipCode: myCompany?.zipCode || '77396',
    country: myCompany?.country || 'United States',
    supportPhone: myCompany?.supportPhone || '-',
    supportUrl: myCompany?.supportUrl || '-',
    ...myCompany,
  };

  const safeHomepageHtml = customHomepage?.html ? sanitizeCustomHomepageHtml(customHomepage.html) : '';

  if (!myCompany) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
        <Alert severity="error">Signed-in company could not be resolved.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
      {!safeHomepageHtml && (
        <Box>
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
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>
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
                    <Avatar sx={{ width: 74, height: 74, bgcolor: '#444', color: '#fff' }}>
                      <Business sx={{ fontSize: 32 }} />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.75 }}>BRAND COLOR</Typography>
                    <Avatar sx={{ width: 74, height: 74, bgcolor: '#666', color: '#fff' }}>
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
      )}

      {safeHomepageHtml && (
        <Box>
          <Alert severity="info" sx={{ mb: 2, borderRadius: 1, bgcolor: '#f3f3f3', color: '#333', '& .MuiAlert-icon': { color: '#777' } }}>
            Custom homepage is active for direct child companies of reseller ID {customHomepage.resellerId}.
          </Alert>
          <Paper sx={{ p: 0, border: '1px solid #e0e0e0', boxShadow: 'none', bgcolor: '#ffffff' }}>
            <Box
              sx={{
                minHeight: 340,
                color: '#333',
                '& a': {
                  color: '#444',
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                },
              }}
              dangerouslySetInnerHTML={{ __html: safeHomepageHtml }}
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default MyCompany;
