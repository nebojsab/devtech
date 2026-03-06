import React from 'react';
import { Alert, Box, Paper, Typography } from '@mui/material';
import { useCompanyContext } from '../context/CompanyContext';
import { sanitizeCustomHomepageHtml } from '../utils/sanitizeCustomHomepageHtml';

function MyCompany() {
  const { sessionUser, findCompanyById, getLandingHomepageForCompany } = useCompanyContext();

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
        <Paper sx={{ p: 4, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ color: '#333', fontWeight: 700, mb: 1 }}>
            My Company
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 15 }}>
            Welcome back, {myCompany.name}. No reseller custom homepage is enabled for your company, so the default landing
            experience is shown.
          </Typography>
        </Paper>
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
