import React, { useState } from 'react';
import { Alert, Avatar, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { Business, Palette } from '@mui/icons-material';
import { useCompanyContext } from '../context/CompanyContext';
import { sanitizeCustomHomepageHtml } from '../utils/sanitizeCustomHomepageHtml';

function MyCompany() {
  const { sessionUser, findCompanyById, getLandingHomepageForCompany } = useCompanyContext();
  const [tabValue, setTabValue] = useState(0);

  const myCompany = findCompanyById(sessionUser.companyId);
  const customHomepage = getLandingHomepageForCompany(sessionUser.companyId);

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
            <Typography variant="h4" sx={{ color: '#333', fontWeight: 700 }}>
              {myCompany.name}
            </Typography>
            <Typography sx={{ color: '#999', fontSize: 20, mt: 0.5 }}>{myCompany.code || '-'}</Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(_, nextTab) => setTabValue(nextTab)}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              mb: 3,
              '& .MuiTabs-indicator': { backgroundColor: '#1976d2' },
              '& .MuiTab-root': {
                color: '#333',
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 500,
                minWidth: 'auto',
                mr: 3,
                '&.Mui-selected': { color: '#1976d2', fontWeight: 600 },
              },
            }}
          >
            <Tab label="About" />
            <Tab label="Users" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>
              <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 700, mb: 2 }}>
                  Company Information
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.75 }}>COMPANY LOGO</Typography>
                    <Avatar sx={{ width: 74, height: 74, bgcolor: '#3f00b5', color: '#fff' }}>
                      <Business sx={{ fontSize: 32 }} />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.75 }}>BRAND COLOR</Typography>
                    <Avatar sx={{ width: 74, height: 74, bgcolor: myCompany.brandColor || '#3f00b5', color: '#fff' }}>
                      <Palette sx={{ fontSize: 30 }} />
                    </Avatar>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>STREET ADDRESS</Typography>
                    <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompany.streetAddress || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>COMPANY PHONE</Typography>
                    <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompany.phone || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>CITY</Typography>
                    <Typography sx={{ fontSize: 14, color: '#333' }}>{myCompany.city || '-'}</Typography>
                  </Box>
                </Box>
              </Paper>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 700, mb: 2 }}>
                    Contact
                  </Typography>

                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>PRIMARY CONTACT</Typography>
                        <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompany.primaryContact || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>EMAIL</Typography>
                        <Typography sx={{ color: '#999', fontSize: 14 }}>{myCompany.primaryContactEmail || '-'}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>TECHNICAL CONTACT</Typography>
                        <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompany.technicalContact || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>EMAIL</Typography>
                        <Typography sx={{ color: '#999', fontSize: 14 }}>{myCompany.technicalContactEmail || '-'}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>BILLING CONTACT</Typography>
                        <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompany.billingContact || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>EMAIL</Typography>
                        <Typography sx={{ color: '#999', fontSize: 14 }}>{myCompany.billingContactEmail || '-'}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 700, mb: 2 }}>
                    Support
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1.5 }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>SUPPORT EMAIL</Typography>
                      <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompany.supportEmail || '-'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>SUPPORT PHONE</Typography>
                      <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompany.supportPhone || '-'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.4 }}>SUPPORT URL</Typography>
                      <Typography sx={{ color: '#333', fontSize: 14 }}>{myCompany.supportUrl || '-'}</Typography>
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
          <Alert severity="info" sx={{ mb: 2 }}>
            Custom homepage is active for direct child companies of reseller ID {customHomepage.resellerId}.
          </Alert>
          <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', boxShadow: 'none', bgcolor: '#ffffff' }}>
            <Box
              sx={{
                minHeight: 320,
                '& a': {
                  color: '#0056b3',
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
