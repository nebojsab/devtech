import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
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
  FormControlLabel,
  Switch,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Tooltip,
  Typography,
  ListItemIcon,
} from '@mui/material';
import { Business, DriveFileMove, Edit, FilterList, IosShare, MoreVert, Palette } from '@mui/icons-material';
import MoveCustomerDialog from '../components/MoveCustomerDialog';
import { useCompanyContext } from '../context/CompanyContext';
import { formatCompanyId } from '../utils/formatCompanyId';
import { sanitizeCustomHomepageHtml } from '../utils/sanitizeCustomHomepageHtml';

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

const homepageHtmlPlaceholder = `<style>
  :root {
    --bg: #f5f5f7;
    --card-bg: #ffffff;
    --text: #1d1d1f;
    --muted: #5f6368;
    --border: #e6e6e9;
    --accent: #6e6e73;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  .shell {
    max-width: 1120px;
    margin: 20px auto;
    padding: 0 14px 20px;
  }

  .hero {
    background: linear-gradient(135deg, #d8d8dc, #bcbcc3);
    border-radius: 16px;
    min-height: 280px;
    padding: 28px;
  }

  .hero h1 {
    margin: 0 0 10px;
    font-size: 42px;
    line-height: 1.1;
  }

  .hero p {
    margin: 0;
    color: var(--muted);
  }
</style>

<main class="shell">
  <section class="hero">
    <h1>Welcome</h1>
    <p>Use this template as your reseller homepage starter.</p>
  </section>
</main>`;

function ResellerCustomHomepageCard({
  resellerId,
  initialEnabled,
  initialHtml,
  initialSourceUrl,
  onSaveConfig,
  onResetConfig,
  globalLoading,
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [html, setHtml] = useState(initialHtml);
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl);
  const [editorMode, setEditorMode] = useState('preview');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const safePreviewHtml = sanitizeCustomHomepageHtml(html || '');
  const previewSrcDoc = `<!doctype html><html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>${safePreviewHtml}</body></html>`;

  const handleFetchHtml = async () => {
    setMessage('');
    setErrorMessage('');

    setIsFetching(true);

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}mock/custom-homepage.html`);

      if (!response.ok) {
        throw new Error(`Template source returned status ${response.status}.`);
      }

      const fetchedHtml = await response.text();
      setHtml(fetchedHtml);
      setMessage('Static homepage template loaded. Save Homepage to persist configuration.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load static homepage template.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    setMessage('');
    setErrorMessage('');

    if (enabled && !safePreviewHtml.trim()) {
      setErrorMessage('Load or paste HTML before saving while custom homepage is enabled.');
      return;
    }

    setIsSaving(true);

    try {
      const result = await onSaveConfig({ resellerId, enabled, html, sourceUrl: sourceUrl.trim() });
      const warnings = result.warnings?.length ? ` ${result.warnings.join(' ')}` : '';

      if (enabled && !result.config.enabled) {
        setMessage('Custom homepage remains OFF because sanitized HTML is empty.' + warnings);
        return;
      }

      setMessage('Custom homepage configuration saved.' + warnings);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save homepage configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setMessage('');
    setErrorMessage('');
    setIsResetting(true);

    try {
      await onResetConfig(resellerId);
      setEnabled(false);
      setHtml('');
      setSourceUrl('');
      setMessage('Custom homepage configuration removed and disabled.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to reset homepage configuration.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, boxShadow: 'none', border: '1px solid #e0e0e0', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 0.5 }}>
        <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
          Custom Homepage
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={globalLoading || isSaving || isResetting || isFetching}
            sx={{ textTransform: 'none', bgcolor: '#333', '&:hover': { bgcolor: '#555' } }}
          >
            {isSaving ? 'Saving...' : 'Save Homepage'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={globalLoading || isSaving || isResetting || isFetching}
            sx={{ textTransform: 'none' }}
          >
            {isResetting ? 'Removing...' : 'Remove Homepage'}
          </Button>
        </Box>
      </Box>
      <Typography sx={{ color: '#666', fontSize: 13, mb: 2 }}>
        PPA-only control for direct child companies of this reseller. Scripts and event handlers are removed during save.
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 1.25,
          mb: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              disabled={globalLoading || isSaving || isResetting || isFetching}
              onChange={(event) => setEnabled(event.target.checked)}
            />
          }
          label={enabled ? 'Enabled: ON' : 'Enabled: OFF'}
          sx={{ mr: 0.5, ml: 0, whiteSpace: 'nowrap' }}
        />

        <TextField
          label="Template API URL"
          value={sourceUrl}
          onChange={(event) => setSourceUrl(event.target.value)}
          placeholder="https://api.partner.local/homepage-template"
          sx={{ flex: '1 1 340px', minWidth: 240 }}
          disabled={globalLoading || isSaving || isResetting || isFetching}
        />
        <Button
          variant="outlined"
          onClick={handleFetchHtml}
          disabled={globalLoading || isSaving || isResetting || isFetching}
          sx={{ textTransform: 'none', whiteSpace: 'nowrap', height: 56 }}
        >
          {isFetching ? 'Fetching...' : 'Fetch HTML'}
        </Button>

        <ToggleButtonGroup
          value={editorMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode) {
              setEditorMode(newMode);
            }
          }}
          sx={{
            border: '1px solid #c8ccd2',
            borderRadius: 1,
            p: 0.25,
            bgcolor: '#f3f5f8',
            '& .MuiToggleButtonGroup-grouped': {
              border: 'none',
              minWidth: 104,
              minHeight: 34,
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              color: '#4f5d6f',
              borderRadius: 0.75,
              px: 1.5,
              py: 0.5,
            },
            '& .MuiToggleButtonGroup-grouped:not(:last-of-type)': {
              borderRight: '1px solid #d7dce3',
              mr: 0.25,
            },
            '& .MuiToggleButton-root.Mui-selected': {
              color: '#16181b',
              bgcolor: '#e3e5e8',
            },
            '& .MuiToggleButton-root.Mui-selected:hover': {
              bgcolor: '#d8dbdf',
            },
          }}
        >
          <ToggleButton value="preview">Preview</ToggleButton>
          <ToggleButton value="edit">Code</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 2 }}>

        {editorMode === 'preview' && (
          <Paper sx={{ border: '1px solid #e0e2e6', boxShadow: 'none', overflow: 'hidden' }}>
            {safePreviewHtml ? (
              <Box
                component="iframe"
                title="Inline homepage preview"
                srcDoc={previewSrcDoc}
                sx={{
                  width: '100%',
                  height: 'calc(100vh - 360px)',
                  minHeight: 360,
                  border: 'none',
                  bgcolor: '#fff',
                }}
              />
            ) : (
              <Box sx={{ px: 2, py: 3 }}>
                <Typography sx={{ color: '#80858b', fontSize: 14 }}>
                  No preview available. Fetch template or paste HTML first.
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {editorMode === 'edit' && (
          <Paper sx={{ border: '1px solid #2d333b', boxShadow: 'none', overflow: 'hidden', bgcolor: '#0f1720' }}>
            <Box
              sx={{
                px: 1.5,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#111b27',
                borderBottom: '1px solid #243142',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#ffbd2f' }} />
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#27c93f' }} />
              </Box>
              <Typography sx={{ color: '#9db0c7', fontSize: 12, fontWeight: 600, letterSpacing: 0.25 }}>
                homepage.html
              </Typography>
              <Box sx={{ width: 36 }} />
            </Box>

            <Box sx={{ height: 'calc(100vh - 360px)', minHeight: 360 }}>
              <Editor
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(value) => setHtml(value ?? '')}
                options={{
                  automaticLayout: true,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'off',
                  tabSize: 2,
                  fontSize: 13,
                  lineHeight: 21,
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
              />
            </Box>
          </Paper>
        )}
      </Box>
    </Paper>
  );
}

function ResellerCustomHomepageReadOnlyCard({ config, loading }) {
  const safePreviewHtml = sanitizeCustomHomepageHtml(config?.html || '');
  const hasHomepage = Boolean(safePreviewHtml.trim());
  const previewSrcDoc = `<!doctype html><html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>${safePreviewHtml}</body></html>`;

  return (
    <Paper sx={{ p: 3, boxShadow: 'none', border: '1px solid #e0e0e0', width: '100%' }}>
      <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 0.5 }}>
        Custom Homepage
      </Typography>
      <Typography sx={{ color: '#666', fontSize: 13, mb: 2 }}>
        Read-only view. Only Platform Provider Admin users can set up or edit custom homepage HTML for resellers.
      </Typography>

      {loading && <Typography sx={{ color: '#777', fontSize: 14 }}>Loading homepage configuration...</Typography>}

      {!loading && hasHomepage && (
        <Paper sx={{ border: '1px solid #e0e2e6', boxShadow: 'none', overflow: 'hidden' }}>
          <Box
            component="iframe"
            title="Read-only homepage preview"
            srcDoc={previewSrcDoc}
            sx={{
              width: '100%',
              height: 'calc(100vh - 360px)',
              minHeight: 360,
              border: 'none',
              bgcolor: '#fff',
            }}
          />
        </Paper>
      )}

      {!loading && !hasHomepage && (
        <Paper
          sx={{
            border: '1px dashed #d0d0d0',
            boxShadow: 'none',
            px: 2,
            py: 3,
            bgcolor: '#fafafa',
          }}
        >
          <Typography sx={{ color: '#555', fontSize: 14, fontWeight: 600, mb: 0.5 }}>No custom homepage yet.</Typography>
          <Typography sx={{ color: '#777', fontSize: 13 }}>
            Only Platform Provider Admin can set up the custom HTML homepage for reseller companies.
          </Typography>
        </Paper>
      )}
    </Paper>
  );
}

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
    sessionUser,
    getResellerHomepageConfig,
    upsertResellerHomepageConfig,
    clearResellerHomepageConfig,
    homepageConfigLoading,
  } = useCompanyContext();

  const company = findCompanyById(id) || findCompanyById(1);
  const isPpaUser = sessionUser?.role === 'PPA';
  const resellerHomepageConfig = company?.type === 'Reseller' ? getResellerHomepageConfig(company.id) : null;
  const currentReseller = company?.type === 'Customer' ? findCompanyById(company.resellerId) : null;
  const currentPriceListNames = (company?.currentPriceListIds || []).map(
    (priceListId) => getPriceListById(company.resellerId, priceListId)?.name || priceListId,
  );
  const showHomepageConfigTab = company?.type === 'Reseller';
  const homepageConfigTabIndex = showHomepageConfigTab ? 6 : -1;
  const auditTabIndex = company?.type === 'Reseller' ? 7 : 5;

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
            onClick={() => navigate('/companies')}
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

        <Typography sx={{ color: '#999', fontSize: 13, mt: 0.5 }}>
          Company ID: {formatCompanyId(company?.id)} · Code: {company?.code || '-'}
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
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
        <Tab label="Vendors" />
        <Tab label="Pricelists" />
        <Tab label="Services" />
        {company?.type === 'Reseller' && <Tab label="Companies" />}
        {showHomepageConfigTab && <Tab label="Home Page" />}
        <Tab label="Audit Log" />
      </Tabs>

      {tabValue === 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: '32px',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ p: 3, boxShadow: 'none', border: '1px solid #e0e0e0', width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Company Information
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.75 }}>COMPANY LOGO</Typography>
                  <Avatar sx={{ width: 74, height: 74, bgcolor: '#1f1f1f', color: '#fff' }}>
                    <Business sx={{ fontSize: 32 }} />
                  </Avatar>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.75 }}>BRAND COLOR</Typography>
                  <Avatar sx={{ width: 74, height: 74, bgcolor: '#efefef', color: '#111' }}>
                    <Palette sx={{ fontSize: 30, color: '#111' }} />
                  </Avatar>
                </Box>
              </Box>

              {company?.type === 'Customer' && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>
                    CURRENT RESELLER
                  </Typography>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>
                    {currentReseller?.name || '-'}
                  </Typography>
                  <Typography sx={{ color: '#999', fontSize: 12, mt: 0.25 }}>
                    Company ID: {formatCompanyId(currentReseller?.id)}
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
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.referenceId || '-'}</Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>STREET ADDRESS</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.streetAddress || '-'}</Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>COMPANY PHONE</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.phone || '-'}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>CITY</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.city || '-'}</Typography>
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
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.primaryContact || '-'}</Typography>
                  <Typography sx={{ color: '#999', fontSize: 13 }}>{company?.primaryContactEmail || '-'}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>TECHNICAL CONTACT</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.technicalContact || '-'}</Typography>
                  <Typography sx={{ color: '#999', fontSize: 13 }}>{company?.technicalContactEmail || '-'}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>BILLING CONTACT</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.billingContact || '-'}</Typography>
                  <Typography sx={{ color: '#999', fontSize: 13 }}>{company?.billingContactEmail || '-'}</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, boxShadow: 'none', border: '1px solid #e0e0e0', width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Support
              </Typography>

              <Box>
                <Typography sx={{ fontSize: 11, color: '#999', fontWeight: 600, mb: 0.5 }}>SUPPORT EMAIL</Typography>
                <Typography sx={{ color: '#333', fontSize: 14 }}>{company?.supportEmail || '-'}</Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {tabValue === homepageConfigTabIndex && (
        <Box sx={{ width: '100%' }}>
          {isPpaUser && (
            <ResellerCustomHomepageCard
              key={`${company.id}-${resellerHomepageConfig?.updatedAt || 'none'}`}
              resellerId={company.id}
              initialEnabled={Boolean(resellerHomepageConfig?.enabled)}
              initialHtml={resellerHomepageConfig?.html || ''}
              initialSourceUrl={resellerHomepageConfig?.sourceUrl || ''}
              onSaveConfig={upsertResellerHomepageConfig}
              onResetConfig={clearResellerHomepageConfig}
              globalLoading={homepageConfigLoading}
            />
          )}

          {!isPpaUser && <ResellerCustomHomepageReadOnlyCard config={resellerHomepageConfig} loading={homepageConfigLoading} />}
        </Box>
      )}

      {tabValue !== 0 && tabValue !== homepageConfigTabIndex && tabValue !== auditTabIndex && (
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
                      <Link component="button" underline="none" sx={{ color: '#333', fontSize: 13, fontWeight: 600 }}>
                        {entry.operationTarget}
                      </Link>
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#666', lineHeight: 1.35 }}>{entry.operationSuffix}</Typography>
                  </Box>

                  <Box>
                    {entry.users.map((user, userIndex) => (
                      <Box key={`${user.name}-${user.code}`} sx={{ mb: userIndex < entry.users.length - 1 ? 0.75 : 0 }}>
                        <Typography sx={{ fontSize: 13, color: '#333', fontWeight: 600 }}>{user.name}</Typography>
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
