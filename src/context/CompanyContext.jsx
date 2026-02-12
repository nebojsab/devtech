/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react';

const initialCompanies = [
  {
    id: 1,
    name: 'BlueHex IT',
    type: 'Reseller',
    code: 'hpkya',
    logo: '📦',
    brandColor: '#007bff',
    referenceId: '-',
    streetAddress: '100 Tech Drive',
    city: 'New York',
    phone: '8002255345',
    primaryContact: 'Test',
    primaryContactEmail: 'test@notarealdomain.com',
    technicalContact: '-',
    technicalContactEmail: '-',
    billingContact: '-',
    billingContactEmail: '-',
    supportEmail: '-',
    hierarchyHint: 'Can host end customers',
    priceLists: [
      {
        id: 'PL-BH-STD',
        name: 'BlueHex Standard',
        services: [
          { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC' },
          { id: 'SVC-BACKUP', name: 'Cloud Backup', sku: 'CLD-BKP' },
          { id: 'SVC-EMAILSEC', name: 'Email Security', sku: 'EML-SEC' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'BluePeak Networks',
    type: 'Reseller',
    code: 'r3sqy',
    logo: '🌐',
    brandColor: '#28a745',
    referenceId: '-',
    streetAddress: '200 Cloud Ave',
    city: 'San Francisco',
    phone: '4155551234',
    primaryContact: 'John Doe',
    primaryContactEmail: 'john@bluepeak.com',
    technicalContact: 'Jane Smith',
    technicalContactEmail: 'jane@bluepeak.com',
    billingContact: 'Mike Johnson',
    billingContactEmail: 'mike@bluepeak.com',
    supportEmail: 'support@bluepeak.com',
    hierarchyHint: 'Can host end customers',
    priceLists: [
      {
        id: 'PL-BP-CORE',
        name: 'BluePeak Core',
        services: [
          { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC' },
          { id: 'SVC-BACKUP', name: 'Cloud Backup', sku: 'CLD-BKP' },
          { id: 'SVC-EMAILSEC', name: 'Email Security', sku: 'EML-SEC' },
        ],
      },
      {
        id: 'PL-BP-GROWTH',
        name: 'BluePeak Growth',
        services: [
          { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC' },
          { id: 'SVC-VDI', name: 'Virtual Desktop', sku: 'VDS-ENT' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'CloudPlus - U.S.',
    type: 'Reseller',
    code: 'k1rh',
    logo: '☁️',
    brandColor: '#ffc107',
    referenceId: '-',
    streetAddress: '300 Enterprise Blvd',
    city: 'Seattle',
    phone: '2065551234',
    primaryContact: 'Sarah Wilson',
    primaryContactEmail: 'sarah@cloudplus.com',
    technicalContact: '-',
    technicalContactEmail: '-',
    billingContact: '-',
    billingContactEmail: '-',
    supportEmail: '-',
    hierarchyHint: 'Can host end customers',
    priceLists: [
      {
        id: 'PL-CP-ONE',
        name: 'CloudPlus One',
        services: [
          { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC' },
          { id: 'SVC-BACKUP', name: 'Cloud Backup', sku: 'CLD-BKP' },
          { id: 'SVC-EMAILSEC', name: 'Email Security', sku: 'EML-SEC' },
          { id: 'SVC-VDI', name: 'Virtual Desktop', sku: 'VDS-ENT' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'CoreFusion Tech',
    type: 'Reseller',
    code: 'crvbm',
    logo: '⚙️',
    brandColor: '#dc3545',
    referenceId: '-',
    streetAddress: '400 Innovation Way',
    city: 'Austin',
    phone: '5125551234',
    primaryContact: 'Robert Brown',
    primaryContactEmail: 'robert@corefusion.com',
    technicalContact: '-',
    technicalContactEmail: '-',
    billingContact: '-',
    billingContactEmail: '-',
    supportEmail: '-',
    hierarchyHint: 'Can host end customers',
    priceLists: [
      {
        id: 'PL-CF-PRO',
        name: 'CoreFusion Pro',
        services: [{ id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC' }],
      },
      {
        id: 'PL-CF-SECURE',
        name: 'CoreFusion Secure',
        services: [
          { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC' },
          { id: 'SVC-EMAILSEC', name: 'Email Security', sku: 'EML-SEC' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'D&H Cloud Solutions',
    type: 'Reseller',
    code: 'lcvpd',
    logo: '📊',
    brandColor: '#17a2b8',
    referenceId: '-',
    streetAddress: '500 Data Park',
    city: 'Boston',
    phone: '6175551234',
    primaryContact: 'Lisa Anderson',
    primaryContactEmail: 'lisa@dandh.com',
    technicalContact: 'Tom Garcia',
    technicalContactEmail: 'tom@dandh.com',
    billingContact: '-',
    billingContactEmail: '-',
    supportEmail: 'support@dandh.com',
    hierarchyHint: 'Can host end customers',
    priceLists: [
      {
        id: 'PL-DH-CLOUD',
        name: 'D&H Cloud',
        services: [
          { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC' },
          { id: 'SVC-BACKUP', name: 'Cloud Backup', sku: 'CLD-BKP' },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Acme Corporation',
    type: 'Customer',
    code: 'acme1',
    logo: '🏢',
    brandColor: '#ff5722',
    referenceId: 'REF-6001',
    streetAddress: '123 Business Ave',
    city: 'Chicago',
    phone: '3125551234',
    primaryContact: 'John Smith',
    primaryContactEmail: 'john@acme.com',
    technicalContact: 'Jane Williams',
    technicalContactEmail: 'jane@acme.com',
    billingContact: 'Bob Johnson',
    billingContactEmail: 'bob@acme.com',
    supportEmail: 'support@acme.com',
    resellerId: 2,
    currentPriceListIds: ['PL-BP-CORE'],
    services: [
      { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC', priceProtected: true },
      { id: 'SVC-BACKUP', name: 'Cloud Backup', sku: 'CLD-BKP', priceProtected: false },
      { id: 'SVC-EMAILSEC', name: 'Email Security', sku: 'EML-SEC', priceProtected: false },
    ],
  },
  {
    id: 7,
    name: 'Tech Innovations Ltd',
    type: 'Customer',
    code: 'tecin',
    logo: '⚡',
    brandColor: '#9c27b0',
    referenceId: 'REF-7001',
    streetAddress: '456 Innovation Drive',
    city: 'Denver',
    phone: '3035551234',
    primaryContact: 'Mary Davis',
    primaryContactEmail: 'mary@techinnovations.com',
    technicalContact: 'David Miller',
    technicalContactEmail: 'david@techinnovations.com',
    billingContact: '-',
    billingContactEmail: '-',
    supportEmail: 'support@techinnovations.com',
    resellerId: 3,
    currentPriceListIds: ['PL-CP-ONE'],
    services: [
      { id: 'SVC-M365', name: 'Microsoft 365 Business Basic', sku: 'M365-BASIC', priceProtected: true },
      { id: 'SVC-VDI', name: 'Virtual Desktop', sku: 'VDS-ENT', priceProtected: false },
    ],
  },
];

const initialMoveHistory = {
  6: [
    {
      occurredAt: '2026-02-10T11:22:00Z',
      beforeResellerName: 'BlueHex IT',
      afterResellerName: 'BluePeak Networks',
      beforePriceListNames: ['BlueHex Standard'],
      afterPriceListNames: ['BluePeak Core'],
      effectiveDate: 'Immediate',
    },
  ],
};

const companyPermissions = {
  canMoveCustomer: true,
  deniedBehavior: 'disabled',
};

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [moveHistoryByCustomer, setMoveHistoryByCustomer] = useState(initialMoveHistory);

  const resellers = useMemo(() => companies.filter((company) => company.type === 'Reseller'), [companies]);

  const findCompanyById = (companyId) => companies.find((company) => company.id === Number(companyId));

  const getPriceListById = (resellerId, priceListId) => {
    const reseller = findCompanyById(resellerId);
    return reseller?.priceLists?.find((priceList) => priceList.id === priceListId);
  };

  const moveCustomer = ({ customerId, destinationResellerId, destinationPriceListIds }) => {
    const customer = findCompanyById(customerId);
    const fromReseller = findCompanyById(customer?.resellerId);
    const toReseller = findCompanyById(destinationResellerId);

    if (!customer || customer.type !== 'Customer') {
      throw new Error('Only end customers can be moved.');
    }

    if (!toReseller || toReseller.type !== 'Reseller') {
      throw new Error('Destination reseller is invalid.');
    }

    if (customer.resellerId === destinationResellerId) {
      throw new Error('Customer is already assigned to this reseller.');
    }

    const selectedPriceLists = destinationPriceListIds
      .map((priceListId) => getPriceListById(destinationResellerId, priceListId))
      .filter(Boolean);

    if (selectedPriceLists.length === 0) {
      throw new Error('Destination price list selection is required.');
    }

    if (destinationResellerId === 4 && destinationPriceListIds.includes('PL-CF-PRO')) {
      throw new Error('TECHNICAL_MOVE_ERROR');
    }

    const beforePriceListNames = (customer.currentPriceListIds || [])
      .map((priceListId) => getPriceListById(customer.resellerId, priceListId)?.name || priceListId);

    const afterPriceListNames = selectedPriceLists.map((priceList) => priceList.name);

    setCompanies((previousCompanies) =>
      previousCompanies.map((company) => {
        if (company.id !== Number(customerId)) {
          return company;
        }

        return {
          ...company,
          resellerId: destinationResellerId,
          currentPriceListIds: destinationPriceListIds,
        };
      }),
    );

    const moveEvent = {
      occurredAt: new Date().toISOString(),
      beforeResellerName: fromReseller?.name || `Reseller ${customer.resellerId}`,
      afterResellerName: toReseller.name,
      beforePriceListNames,
      afterPriceListNames,
      effectiveDate: 'Immediate',
    };

    setMoveHistoryByCustomer((previousHistory) => ({
      ...previousHistory,
      [customerId]: [moveEvent, ...(previousHistory[customerId] || [])],
    }));

    return {
      moveEvent,
      message: `Customer successfully moved from ${fromReseller?.name || 'previous reseller'} to ${toReseller.name}.`,
    };
  };

  const value = {
    companies,
    resellers,
    findCompanyById,
    moveCustomer,
    moveHistoryByCustomer,
    companyPermissions,
    getPriceListById,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompanyContext() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error('useCompanyContext must be used inside CompanyProvider.');
  }

  return context;
}
