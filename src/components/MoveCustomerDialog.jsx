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

function StackedInfoRow({ label, value }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Typography sx={{ fontSize: 12, color: '#999', fontWeight: 600, mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontSize: 16, color: '#333' }}>{value}</Typography>
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

  const missingServices = useMemo(() => {
    if (effectiveSelectedPriceListIds.length === 0) {
      return [];
    }

    const availableServiceIds = new Set(selectedPriceLists.flatMap((priceList) => priceList.services.map((service) => service.id)));
    return (customer?.services || []).filter((service) => !availableServiceIds.has(service.id));
  }, [customer?.services, effectiveSelectedPriceListIds, selectedPriceLists]);

  const hasCoverageConflict = effectiveSelectedPriceListIds.length > 0 && missingServices.length > 0;

  const goNext = () => {
    clearMoveError?.();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!selectedReseller || effectiveSelectedPriceListIds.length === 0 || hasCoverageConflict) {
        return;
      }

      setStep(3);
      return;
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
    setAcknowledgedImpact(false);
    clearMoveError?.();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canContinueFromCurrentStep =
    (step === 1) ||
    (step === 2 && Boolean(selectedReseller) && effectiveSelectedPriceListIds.length > 0 && !hasCoverageConflict);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>Move customer</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ fontSize: 13, color: '#999', mb: 2 }}>
          Step {step} of 3
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
            <Box>
              <StackedInfoRow label="CUSTOMER" value={`${customer?.name || '-'} (${customer?.id || '-'})`} />
              <Divider />
              <StackedInfoRow
                label="CURRENT RESELLER"
                value={`${currentReseller?.name || '-'} (${currentReseller?.id || '-'})`}
              />
              <Divider />
              <StackedInfoRow label="CURRENT PRICE LIST(S)" value={currentPriceListNames.join(', ') || '-'} />
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Destination reseller & price list(s)</Typography>
            <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
              Select destination reseller. Price list selection appears after reseller is selected.
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

            {selectedReseller && (
              <Box sx={{ mt: 2.5 }}>
                <Typography sx={{ fontSize: 13, color: '#666', mb: 1.25 }}>
                  Destination price list(s)
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
                  <Box sx={{ mt: 1.5 }}>
                    <SummaryRow
                      label="Selected price list"
                      value={`${destinationPriceLists[0].name} (${destinationPriceLists[0].id})`}
                    />
                  </Box>
                )}

                {hasCoverageConflict && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: 14, mb: 1 }}>
                        The selected price list(s) do not include these services. Select a different reseller or
                        choose a destination price list that contains the required services.
                      </Typography>

                      <Box>
                        {missingServices.map((service, index) => (
                          <Box key={service.id}>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemText
                                primary={`${service.name} (${service.id})`}
                                secondary={`SKU: ${service.sku}`}
                                primaryTypographyProps={{ fontSize: 14, color: '#333' }}
                                secondaryTypographyProps={{ fontSize: 12, color: '#666' }}
                              />
                            </ListItem>
                            {index < missingServices.length - 1 && <Divider />}
                          </Box>
                        ))}
                      </Box>
                    </Alert>
                  </Box>
                )}

                {!hasCoverageConflict && effectiveSelectedPriceListIds.length > 0 && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Selected destination setup is valid. You can continue.
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        )}

        {step === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontSize: 18 }}>Confirm move</Typography>
            <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
              Review and confirm before applying this action.
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Stack spacing={0.75}>
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
            </Alert>

            <Typography sx={{ fontSize: 12, color: '#999', fontWeight: 700, mb: 1 }}>
              SUMMARY OF CHANGES
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

            <Typography sx={{ fontSize: 12, color: '#999', fontWeight: 700, mt: 2, mb: 0.75 }}>
              CONFIRMATION
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#666' }}>
              Confirm that you want to apply these changes to billing ownership and pricing context.
            </Typography>

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
          {step > 1 && (
            <Button onClick={() => setStep((previousStep) => previousStep - 1)} sx={{ textTransform: 'none' }}>
              Back
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>

          {step < 3 && (
            <Button
              variant="contained"
              onClick={goNext}
              disabled={!canContinueFromCurrentStep}
              sx={{ bgcolor: '#333', textTransform: 'none', '&:hover': { bgcolor: '#555' } }}
            >
              Continue
            </Button>
          )}

          {step === 3 && (
            <Button
              variant="contained"
              onClick={handleConfirmMove}
              disabled={!acknowledgedImpact}
              sx={{ bgcolor: '#333', textTransform: 'none', '&:hover': { bgcolor: '#555' } }}
            >
              Submit move
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
