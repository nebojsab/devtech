import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  ListItemIcon,
} from '@mui/material';
import {
  Add,
  Search,
  Store,
  MoreVert,
  DriveFileMove,
  Edit,
} from '@mui/icons-material';
import MoveCustomerDialog from '../components/MoveCustomerDialog';
import { useCompanyContext } from '../context/CompanyContext';

function Companies() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [moveError, setMoveError] = useState('');
  const navigate = useNavigate();

  const {
    companies,
    findCompanyById,
    resellers,
    moveCustomer,
    companyPermissions,
    getPriceListById,
  } = useCompanyContext();

  const filteredCompanies = useMemo(
    () => (typeFilter === 'All' ? companies : companies.filter((company) => company.type === typeFilter)),
    [companies, typeFilter],
  );

  const companiesForTable = useMemo(
    () =>
      filteredCompanies.map((company) => {
        if (company.type !== 'Reseller') {
          return {
            ...company,
            resellers: 0,
            customers: 0,
          };
        }

        const hostedCustomers = companies.filter(
          (possibleCustomer) => possibleCustomer.type === 'Customer' && possibleCustomer.resellerId === company.id,
        );

        return {
          ...company,
          resellers: 0,
          customers: hostedCustomers.length,
        };
      }),
    [companies, filteredCompanies],
  );

  const selectedCompany = findCompanyById(selectedCompanyId);
  const selectedCustomerCurrentReseller = selectedCompany ? findCompanyById(selectedCompany.resellerId) : null;
  const selectedCustomerCurrentPriceListNames = (selectedCompany?.currentPriceListIds || []).map(
    (priceListId) => getPriceListById(selectedCompany.resellerId, priceListId)?.name || priceListId,
  );

  const handleMenuOpen = (event, companyId) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedCompanyId(companyId);
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
    setSelectedCompanyId(null);
  };

  const handleMove = (payload) => {
    try {
      const result = moveCustomer(payload);
      closeMoveDialog();
      navigate(`/company/${payload.customerId}`, {
        state: {
          moveSuccessMessage: result.message,
        },
      });
    } catch (error) {
      if (error.message === 'TECHNICAL_MOVE_ERROR') {
        setMoveError('We couldn’t complete the move. Please try again or contact support.');
        return;
      }

      setMoveError(error.message || 'We couldn’t complete the move. Please try again or contact support.');
    }
  };

  const moveVisible =
    selectedCompany?.type === 'Customer' &&
    (companyPermissions.canMoveCustomer || companyPermissions.deniedBehavior === 'disabled');

  const moveDisabled = !companyPermissions.canMoveCustomer && companyPermissions.deniedBehavior === 'disabled';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#333', fontWeight: 700 }}>
          Companies
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search Companies"
          variant="outlined"
          size="small"
          sx={{
            width: 250,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#ffffff',
              '& fieldset': {
                borderColor: '#d0d0d0',
              },
              '&:hover fieldset': {
                borderColor: '#bbb',
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
                <Search sx={{ color: '#999', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 13, color: '#666', fontWeight: 500 }}>TYPE</Typography>
            <Select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              size="small"
              sx={{
                width: 120,
                bgcolor: '#ffffff',
                color: '#666',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d0d0d0',
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Reseller">Reseller</MenuItem>
              <MenuItem value="Customer">Customer</MenuItem>
            </Select>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: 20 }} />}
            sx={{
              bgcolor: '#333',
              color: '#fff',
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
              px: 2,
              '&:hover': {
                bgcolor: '#555',
              },
            }}
          >
            New Company
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 2,
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            color: '#333',
            fontWeight: 600,
            cursor: 'pointer',
            pb: 1,
            borderBottom: '2px solid #333',
          }}
        >
          Companies
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#999', cursor: 'pointer', pb: 1 }}>Resellers</Typography>
        <Typography sx={{ fontSize: 14, color: '#999', cursor: 'pointer', pb: 1 }}>Customers</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#ffffff', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
              <TableCell sx={{ color: '#999', fontSize: 12, fontWeight: 600, p: 2 }}>Companies</TableCell>
              <TableCell sx={{ color: '#999', fontSize: 12, fontWeight: 600, p: 2 }} align="center">
                Resellers
              </TableCell>
              <TableCell sx={{ color: '#999', fontSize: 12, fontWeight: 600, p: 2 }} align="center">
                Customers
              </TableCell>
              <TableCell sx={{ color: '#999', fontSize: 12, fontWeight: 600, p: 2, width: 50 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {companiesForTable.map((company) => (
              <TableRow
                key={company.id}
                onClick={() => navigate(`/company/${company.id}`)}
                sx={{
                  borderBottom: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  },
                }}
              >
                <TableCell sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#e0e0e0',
                        color: '#666',
                      }}
                    >
                      <Store sx={{ fontSize: 20 }} />
                    </Avatar>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{company.name}</Typography>
                        {company.type === 'Reseller' && (
                          <Box
                            sx={{
                              bgcolor: '#e8e8e8',
                              color: '#666',
                              px: 1,
                              py: 0.5,
                              borderRadius: 0.5,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {company.type}
                          </Box>
                        )}
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#999' }}>{company.code}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ p: 2, textAlign: 'center', color: '#333', fontSize: 14 }}>{company.resellers}</TableCell>
                <TableCell sx={{ p: 2, textAlign: 'center', color: '#333', fontSize: 14 }}>{company.customers}</TableCell>
                <TableCell sx={{ p: 2, textAlign: 'right', width: 50 }}>
                  <IconButton size="small" onClick={(event) => handleMenuOpen(event, company.id)}>
                    <MoreVert sx={{ fontSize: 18, color: '#666' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          px: 2,
        }}
      >
        <Typography sx={{ fontSize: 13, color: '#999' }}>
          1-{filteredCompanies.length} of {filteredCompanies.length}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Pagination count={2} variant="outlined" shape="rounded" size="small" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Rows per page:</Typography>
            <Select
              value={5}
              size="small"
              sx={{
                width: 70,
                bgcolor: '#ffffff',
                color: '#666',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d0d0d0',
                },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>
          </Box>
        </Box>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <Edit sx={{ fontSize: 18 }} />
            </ListItemIcon>
            Edit
          </MenuItem>

          {moveVisible && (
            <Tooltip
              placement="left"
              title={moveDisabled ? 'You don’t have permission to move customers. Contact your administrator.' : ''}
            >
              <span>
                <MenuItem onClick={openMoveDialog} disabled={moveDisabled}>
                  <ListItemIcon>
                    <DriveFileMove sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  Move
                </MenuItem>
              </span>
            </Tooltip>
          )}
        </Menu>
      </Box>

      {moveDialogOpen && (
        <MoveCustomerDialog
          open={moveDialogOpen}
          onClose={closeMoveDialog}
          customer={selectedCompany?.type === 'Customer' ? selectedCompany : null}
          currentReseller={selectedCustomerCurrentReseller}
          currentPriceListNames={selectedCustomerCurrentPriceListNames}
          resellers={resellers}
          onConfirmMove={handleMove}
          moveError={moveError}
          clearMoveError={() => setMoveError('')}
        />
      )}
    </Box>
  );
}

export default Companies;
