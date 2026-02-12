import React, { useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

function SummaryRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography sx={{ fontSize: 13, color: '#666', fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: '#333', textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

function MoveCustomerDialog({
  open,
  onClose,
  customer,
  currentReseller,
  currentPriceListNames,
  resellers,
  onConfirmMove,
  moveError,
  clearMoveError,
}) {
  const [step, setStep] = useState(1);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [selectedPriceListIds, setSelectedPriceListIds] = useState([]);
  const [missingServices, setMissingServices] = useState([]);
  const [acknowledgedImpact, setAcknowledgedImpact] = useState(false);

  const destinationPriceLists = useMemo(() => selectedReseller?.priceLists || [], [selectedReseller]);
  const hasSingleDestinationPriceList = destinationPriceLists.length === 1;

  const effectiveSelectedPriceListIds = useMemo(
    () => (hasSingleDestinationPriceList ? [destinationPriceLists[0].id] : selectedPriceListIds),
    [hasSingleDestinationPriceList, destinationPriceLists, selectedPriceListIds],
  );

  const selectedPriceLists = useMemo(
    () => destinationPriceLists.filter((priceList) => effectiveSelectedPriceListIds.includes(priceList.id)),
    [destinationPriceLists, effectiveSelectedPriceListIds],
  );

  const selectedPriceListNames = selectedPriceLists.map((priceList) => priceList.name);

  const validateCoverage = () => {
    const availableServiceIds = new Set(selectedPriceLists.flatMap((priceList) => priceList.services.map((service) => service.id)));

    const notCovered = (customer?.services || []).filter((service) => !availableServiceIds.has(service.id));
    setMissingServices(notCovered);

    if (notCovered.length > 0) {
      setStep(4);
      return false;
    }

    return true;
  };

  const goNext = () => {
    clearMoveError?.();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!selectedReseller) {
        return;
      }

      setStep(3);
      return;
    }

    if (step === 3) {
      if (effectiveSelectedPriceListIds.length === 0) {
        return;
      }

      if (!validateCoverage()) {
        return;
      }

      setStep(5);
      return;
    }

    if (step === 5) {
      setStep(6);
    }
  };

  const handleConfirmMove = () => {
    if (!customer || !selectedReseller || effectiveSelectedPriceListIds.length === 0) {
      return;
    }

    onConfirmMove({
      customerId: customer.id,
      destinationResellerId: selectedReseller.id,
      destinationPriceListIds: effectiveSelectedPriceListIds,
    });
  };

  const resetForm = () => {
    setStep(1);
    setSelectedReseller(null);
    setSelectedPriceListIds([]);
    setMissingServices([]);
    setAcknowledgedImpact(false);
    clearMoveError?.();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canContinueFromCurrentStep =
    (step === 1) ||
    (step === 2 && Boolean(selectedReseller)) ||
    (step === 3 && effectiveSelectedPriceListIds.length > 0) ||
    step === 5;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>Move customer</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ fontSize: 13, color: '#999', mb: 2 }}>
          Step {step} of 6
        </Typography>

        {moveError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {moveError}
          </Alert>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Context summary</Typography>
            <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
              Review current assignment before choosing destination.
            </Typography>
            <PaperSection>
              <SummaryRow label="Customer" value={`${customer?.name || '-'} (${customer?.id || '-'})`} />
              <Divider />
              <SummaryRow label="Current reseller" value={`${currentReseller?.name || '-'} (${currentReseller?.id || '-'})`} />
              <Divider />
              <SummaryRow label="Current price list(s)" value={currentPriceListNames.join(', ') || '-'} />
            </PaperSection>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Destination reseller</Typography>
            <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
              End customer can be moved to any point in hierarchy where a reseller exists.
            </Typography>
            <Autocomplete
              options={resellers.filter((reseller) => reseller.id !== currentReseller?.id)}
              value={selectedReseller}
              onChange={(_, newValue) => {
                setSelectedReseller(newValue);
                setSelectedPriceListIds([]);
              }}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search destination reseller" fullWidth />
              )}
            />
          </Box>
        )}

        {step === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Destination price list(s)</Typography>
            <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
              Select destination price list that will be applied to this customer.
            </Typography>

            {hasSingleDestinationPriceList && destinationPriceLists[0] && (
              <Alert severity="info" sx={{ mb: 2 }}>
                This reseller has only one price list; it will be applied automatically.
              </Alert>
            )}

            {destinationPriceLists.length > 1 && (
              <Box>
                <Typography sx={{ fontSize: 12, color: '#666', fontWeight: 600, mb: 1 }}>
                  Price list selection is required
                </Typography>
                <Select
                  fullWidth
                  value={selectedPriceListIds[0] || ''}
                  onChange={(event) => setSelectedPriceListIds([event.target.value])}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select destination price list
                  </MenuItem>
                  {destinationPriceLists.map((priceList) => (
                    <MenuItem key={priceList.id} value={priceList.id}>
                      {priceList.name} ({priceList.id})
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}

            {hasSingleDestinationPriceList && destinationPriceLists[0] && (
              <PaperSection>
                <SummaryRow
                  label="Selected price list"
                  value={`${destinationPriceLists[0].name} (${destinationPriceLists[0].id})`}
                />
              </PaperSection>
            )}
          </Box>
        )}

        {step === 4 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Validation feedback</Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              The selected price list(s) do not include these services. Go back and select a different reseller from
              the list or choose a destination price list that contains the required services, then try again.
            </Alert>
            <List dense sx={{ border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fff' }}>
              {missingServices.map((service) => (
                <ListItem key={service.id} divider>
                  <ListItemText
                    primary={`${service.name} (${service.id})`}
                    secondary={`SKU: ${service.sku}`}
                    primaryTypographyProps={{ fontSize: 14, color: '#333' }}
                    secondaryTypographyProps={{ fontSize: 12, color: '#666' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {step === 5 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Billing & pricing summary</Typography>
            <Stack spacing={1.5}>
              <Typography sx={{ fontSize: 14, color: '#333' }}>
                Billing items will be closed for old reseller and created for new reseller.
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#333' }}>
                Services under price protection will retain their price.
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#333' }}>
                Non-protected services may change price according to the destination price list at the time of move.
              </Typography>
              <Box>
                <Tooltip title="Move does not retroactively re-rate completed billing periods.">
                  <Link component="button" underline="hover" sx={{ fontSize: 13 }}>
                    Learn more about billing impact
                  </Link>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
        )}

        {step === 6 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Confirm move</Typography>
            <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
              Review and confirm before applying this action.
            </Typography>
            <PaperSection>
              <SummaryRow
                label="Reseller"
                value={`${currentReseller?.name || '-'} → ${selectedReseller?.name || '-'}`}
              />
              <Divider />
              <SummaryRow
                label="Price list(s)"
                value={`${currentPriceListNames.join(', ') || '-'} → ${selectedPriceListNames.join(', ') || '-'}`}
              />
              <Divider />
              <SummaryRow label="Effective date" value="Immediate" />
              <Divider />
              <SummaryRow
                label="Billing / pricing"
                value="Protected prices are retained; others follow destination price list pricing."
              />
            </PaperSection>

            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Checkbox
                  checked={acknowledgedImpact}
                  onChange={(event) => setAcknowledgedImpact(event.target.checked)}
                />
              }
              label="I understand this may affect pricing and billing for this customer."
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box>
          {step > 1 && step !== 6 && (
            <Button onClick={() => setStep((previousStep) => previousStep - 1)} sx={{ textTransform: 'none' }}>
              Back
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
            {step === 4 ? 'Close' : 'Cancel'}
          </Button>

          {step < 4 && (
            <Button
              variant="contained"
              onClick={goNext}
              disabled={!canContinueFromCurrentStep}
              sx={{ bgcolor: '#333', textTransform: 'none', '&:hover': { bgcolor: '#555' } }}
            >
              Continue
            </Button>
          )}

          {step === 5 && (
            <Button
              variant="contained"
              onClick={goNext}
              sx={{ bgcolor: '#333', textTransform: 'none', '&:hover': { bgcolor: '#555' } }}
            >
              Continue
            </Button>
          )}

          {step === 6 && (
            <Button
              variant="contained"
              onClick={handleConfirmMove}
              disabled={!acknowledgedImpact}
              sx={{ bgcolor: '#333', textTransform: 'none', '&:hover': { bgcolor: '#555' } }}
            >
              Move customer
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function PaperSection({ children }) {
  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5, bgcolor: '#fff' }}>
      {children}
    </Box>
  );
}

export default MoveCustomerDialog;
