import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Breadcrumbs,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  ListItemIcon,
} from '@mui/material';
import { Business, DriveFileMove, Edit, FilterList, IosShare, MoreVert, Palette } from '@mui/icons-material';
import MoveCustomerDialog from '../components/MoveCustomerDialog';
import { useCompanyContext } from '../context/CompanyContext';

const formatAuditDate = (value) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));

const formatAuditTime = (value) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(new Date(value));

function CompanyDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [moveError, setMoveError] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.moveSuccessMessage || '');

  const {
    findCompanyById,
    resellers,
    moveCustomer,
    moveHistoryByCustomer,
    companyPermissions,
    getPriceListById,
  } = useCompanyContext();

  const company = findCompanyById(id) || findCompanyById(1);
  const currentReseller = company?.type === 'Customer' ? findCompanyById(company.resellerId) : null;
  const currentPriceListNames = (company?.currentPriceListIds || []).map(
    (priceListId) => getPriceListById(company.resellerId, priceListId)?.name || priceListId,
  );
  const auditTabIndex = company?.type === 'Reseller' ? 6 : 5;

  const moveHistory = moveHistoryByCustomer[company?.id] || [];

  const resellerAuditEntries = [
    {
      occurredAt: '2026-02-05T15:02:05Z',
      timezone: 'GMT+1',
      status: 'Successful',
      event: 'Tenant Configuration',
      operationPrefix: 'Activation of tenant for',
      operationTarget: company?.name,
      operationSuffix: '(01973a07-52df-7fa6-9bb3-de8be6dffb9b) has been completed successfully.',
      users: [
        { name: 'Marcus Hill', code: 'nbpwx' },
        { name: 'BluePeak Networks', code: 'r3sqy' },
      ],
    },
    {
      occurredAt: '2025-10-23T11:35:01Z',
      timezone: 'GMT+2',
      status: 'Successful',
      event: 'Tenant Configuration',
      operationPrefix: 'Activation of tenant for',
      operationTarget: company?.name,
      operationSuffix: '(01973a07-52df-7fa6-9bb3-de8be6dffb9b) has been completed successfully.',
      users: [
        { name: 'Eric Tan', code: 'mkwzp' },
        { name: 'GMS Platform Root', code: 'qa509' },
      ],
    },
  ];

  const customerAuditEntries = moveHistory.map((event) => ({
    occurredAt: event.occurredAt,
    timezone: 'GMT+0',
    status: 'Successful',
    event: 'Move Customer',
    operationPrefix: 'Customer moved from',
    operationTarget: event.beforeResellerName,
    operationSuffix: `to ${event.afterResellerName}. Price lists: ${event.beforePriceListNames.join(', ')} → ${event.afterPriceListNames.join(', ')}. Effective date: ${event.effectiveDate}.`,
    users: [{ name: 'System', code: 'Move workflow' }],
  }));

  const auditEntries = company?.type === 'Customer' ? customerAuditEntries : resellerAuditEntries;

  const filteredAuditEntries = auditEntries.filter((entry) => {
    const haystack = [
      entry.status,
      entry.event,
      entry.operationPrefix,
      entry.operationTarget,
      entry.operationSuffix,
      ...entry.users.flatMap((user) => [user.name, user.code]),
      formatAuditDate(entry.occurredAt),
      formatAuditTime(entry.occurredAt),
      entry.timezone,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(auditSearch.trim().toLowerCase());
  });

  useEffect(() => {
    if (location.state?.moveSuccessMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state?.moveSuccessMessage, navigate]);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const openMoveDialog = () => {
    setMoveError('');
    setMoveDialogOpen(true);
    handleMenuClose();
  };

  const closeMoveDialog = () => {
    setMoveDialogOpen(false);
    setMoveError('');
  };

  const handleMove = (payload) => {
    try {
      const result = moveCustomer(payload);
      setSuccessMessage(result.message);
      closeMoveDialog();
      setTabValue(auditTabIndex);
    } catch (error) {
      if (error.message === 'TECHNICAL_MOVE_ERROR') {
        setMoveError('We couldn’t complete the move. Please try again or contact support.');
        return;
      }

      setMoveError(error.message || 'We couldn’t complete the move. Please try again or contact support.');
    }
  };

  const showMoveAction =
    company?.type === 'Customer' && (companyPermissions.canMoveCustomer || companyPermissions.deniedBehavior === 'disabled');

  const disableMoveAction = !companyPermissions.canMoveCustomer && companyPermissions.deniedBehavior === 'disabled';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 1 }}>
          <Link
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              color: '#999',
              textDecoration: 'none',
              fontSize: 13,
              '&:hover': { color: '#666' },
            }}
          >
            Companies
          </Link>
          <Typography sx={{ color: '#666', fontSize: 13 }}>{company?.name}</Typography>
        </Breadcrumbs>

        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccessMessage('')}
            action={
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Link
                  component="button"
                  underline="hover"
                  sx={{ fontSize: 13 }}
                  onClick={() => setTabValue(auditTabIndex)}
                >
                  View audit history
                </Link>
                <Link component="button" underline="hover" sx={{ fontSize: 13 }}>
                  View billing details
                </Link>
              </Box>
            }
          >
            {successMessage}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box
            sx={{
              bgcolor: '#e8e8e8',
              color: '#666',
              px: 1.5,
              py: 0.5,
              borderRadius: 0.5,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {company?.type}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ color: '#333', fontWeight: 700 }}>
            {company?.name}
          </Typography>

          <IconButton
            size="small"
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <Edit sx={{ fontSize: 18, color: '#111' }} />
          </IconButton>

          {company?.type === 'Customer' && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <MoreVert sx={{ fontSize: 18, color: '#111' }} />
            </IconButton>
          )}
        </Box>

        <Typography sx={{ color: '#999', fontSize: 13, mt: 0.5 }}>{company?.code}</Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
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
        <Tab label="Vendors" />
        <Tab label="Pricelists" />
        <Tab label="Services" />
        {company?.type === 'Reseller' && <Tab label="Companies" />}
        <Tab label="Audit Log" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ p: 3, boxShadow: 'none', border: '1px solid #e0e0e0', width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Company Information
              </Typography>

              {company?.type === 'Customer' && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>
                    CURRENT RESELLER
                  </Typography>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>
                    {currentReseller?.name || '-'} ({currentReseller?.id || '-'})
                  </Typography>
                </Box>
              )}

              {company?.type === 'Customer' && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>
                    CURRENT PRICE LIST(S)
                  </Typography>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{currentPriceListNames.join(', ') || '-'}</Typography>
                </Box>
              )}

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>REFERENCE ID</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.referenceId}</Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>STREET ADDRESS</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.streetAddress}</Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>COMPANY PHONE</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.phone}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>CITY</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.city}</Typography>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ p: 3, boxShadow: 'none', border: '1px solid #e0e0e0', mb: 3, width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Contact
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>PRIMARY CONTACT</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.primaryContact}</Typography>
                  <Typography sx={{ color: '#999', fontSize: 13 }}>{company?.primaryContactEmail}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>TECHNICAL CONTACT</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.technicalContact}</Typography>
                  <Typography sx={{ color: '#999', fontSize: 13 }}>{company?.technicalContactEmail}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>BILLING CONTACT</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.billingContact}</Typography>
                  <Typography sx={{ color: '#999', fontSize: 13 }}>{company?.billingContactEmail}</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, boxShadow: 'none', border: '1px solid #e0e0e0', width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Brand
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#f5f5f5', color: '#111' }}>
                  <Business sx={{ fontSize: 36 }} />
                </Avatar>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#111', color: '#fff' }}>
                  <Palette sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {tabValue !== 0 && tabValue !== auditTabIndex && (
        <Box sx={{ p: 3, textAlign: 'center', width: '100%' }}>
          <Typography sx={{ color: '#999' }}>Content for this tab coming soon...</Typography>
        </Box>
      )}

      {tabValue === auditTabIndex && (
        <Paper sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search Audit Log"
              value={auditSearch}
              onChange={(event) => setAuditSearch(event.target.value)}
              sx={{ width: 240, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList sx={{ fontSize: 16 }} />}
                sx={{ textTransform: 'none', borderColor: '#d0d0d0', color: '#333', px: 2 }}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                startIcon={<IosShare sx={{ fontSize: 16 }} />}
                sx={{ textTransform: 'none', borderColor: '#d0d0d0', color: '#333', px: 2 }}
              >
                Export
              </Button>
            </Box>
          </Box>

          {auditEntries.length === 0 && <Typography sx={{ color: '#999', fontSize: 14 }}>No audit events recorded yet.</Typography>}

          {auditEntries.length > 0 && (
            <Box sx={{ border: '1px solid #efefef', borderRadius: 2, overflow: 'hidden' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1.5fr 2.4fr 1fr',
                  gap: 2,
                  px: 2.5,
                  py: 1.75,
                  borderBottom: '1px solid #e8e8e8',
                }}
              >
                <Typography sx={{ fontSize: 13, color: '#999', fontWeight: 600 }}>Date/Time</Typography>
                <Typography sx={{ fontSize: 13, color: '#999', fontWeight: 600 }}>Event</Typography>
                <Typography sx={{ fontSize: 13, color: '#999', fontWeight: 600 }}>Operations</Typography>
                <Typography sx={{ fontSize: 13, color: '#999', fontWeight: 600 }}>User</Typography>
              </Box>

              {filteredAuditEntries.map((entry, index) => (
                <Box
                  key={`${entry.occurredAt}-${index}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 1.5fr 2.4fr 1fr',
                    gap: 2,
                    px: 2.5,
                    py: 2,
                    borderBottom: index < filteredAuditEntries.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 13, color: '#333' }}>{formatAuditDate(entry.occurredAt)}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#666', lineHeight: 1.2 }}>{formatAuditTime(entry.occurredAt)}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#666', lineHeight: 1.2 }}>{entry.timezone}</Typography>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        px: 1,
                        py: 0.25,
                        borderRadius: 0.5,
                        fontSize: 11,
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {entry.status}
                    </Box>
                    <Typography sx={{ fontSize: 14, color: '#333', lineHeight: 1.2 }}>{entry.event}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: 13, color: '#666', mb: 0.25 }}>
                      {entry.operationPrefix}{' '}
                      <Link component="button" underline="none" sx={{ color: '#1976d2', fontSize: 13, fontWeight: 600 }}>
                        {entry.operationTarget}
                      </Link>
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#666', lineHeight: 1.35 }}>{entry.operationSuffix}</Typography>
                  </Box>

                  <Box>
                    {entry.users.map((user, userIndex) => (
                      <Box key={`${user.name}-${user.code}`} sx={{ mb: userIndex < entry.users.length - 1 ? 0.75 : 0 }}>
                        <Typography sx={{ fontSize: 13, color: '#1976d2', fontWeight: 600 }}>{user.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#999' }}>{user.code}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}

              {filteredAuditEntries.length === 0 && (
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Typography sx={{ color: '#999', fontSize: 13 }}>No audit events match your search.</Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}

      {company?.type === 'Customer' && (
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          {showMoveAction && (
            <Tooltip
              placement="left"
              title={disableMoveAction ? 'You don’t have permission to move customers. Contact your administrator.' : ''}
            >
              <span>
                <MenuItem onClick={openMoveDialog} disabled={disableMoveAction}>
                  <ListItemIcon>
                    <DriveFileMove sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  Move customer
                </MenuItem>
              </span>
            </Tooltip>
          )}
        </Menu>
      )}

      {moveDialogOpen && (
        <MoveCustomerDialog
          open={moveDialogOpen}
          onClose={closeMoveDialog}
          customer={company?.type === 'Customer' ? company : null}
          currentReseller={currentReseller}
          currentPriceListNames={currentPriceListNames}
          resellers={resellers}
          onConfirmMove={handleMove}
          moveError={moveError}
          clearMoveError={() => setMoveError('')}
        />
      )}
    </Box>
  );
}

export default CompanyDetails;
