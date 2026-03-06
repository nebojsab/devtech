import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { HourglassEmpty } from '@mui/icons-material';
import { useCompanyContext } from '../context/CompanyContext';
import { sanitizeCustomHomepageHtml } from '../utils/sanitizeCustomHomepageHtml';

function Home() {
  const { sessionUser, getLandingHomepageForCompany } = useCompanyContext();

  const customHomepage = getLandingHomepageForCompany(sessionUser.companyId);
  const safeHomepageHtml = customHomepage?.html ? sanitizeCustomHomepageHtml(customHomepage.html) : '';
  const homepageSrcDoc = `<!doctype html><html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>${safeHomepageHtml}</body></html>`;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" sx={{ color: '#222', fontWeight: 700, mb: 2 }}>
        Welcome
      </Typography>

      {!safeHomepageHtml && (
        <Box
          sx={{
            minHeight: '68vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', color: '#9b9b9b' }}>
            <Box
              sx={{
                width: 82,
                height: 82,
                borderRadius: 3,
                border: '1px solid #e6e6e6',
                bgcolor: '#f5f5f5',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <HourglassEmpty sx={{ fontSize: 40, color: '#c3c3c3' }} />
            </Box>
            <Typography sx={{ fontSize: 32, fontWeight: 600, color: '#8d8d8d', mb: 0.5 }}>Coming Soon</Typography>
            <Typography sx={{ fontSize: 20, color: '#a6a6a6', maxWidth: 560 }}>
              The homepage page is currently under development and will be available in upcoming releases.
            </Typography>
          </Box>
        </Box>
      )}

      {safeHomepageHtml && (
        <Paper sx={{ p: 0, border: '1px solid #e0e0e0', boxShadow: 'none', bgcolor: '#ffffff', overflow: 'hidden' }}>
          <Box
            component="iframe"
            title="Custom homepage"
            srcDoc={homepageSrcDoc}
            sx={{ width: '100%', height: '76vh', border: 'none', bgcolor: '#fff' }}
          />
        </Paper>
      )}
    </Box>
  );
}

export default Home;
