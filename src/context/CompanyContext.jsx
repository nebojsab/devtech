/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { deleteHomepageConfig, getHomepageConfig, upsertHomepageConfig as upsertHomepageConfigApi } from '../api/customHomepageApi';
import { sanitizeCustomHomepageHtml } from '../utils/sanitizeCustomHomepageHtml';

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
    parentResellerId: 2,
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
    parentResellerId: 3,
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

const initialSessionUser = {
  id: 'ppa-1',
  displayName: 'Erica Thomson',
  initials: 'ET',
  role: 'PPA',
  companyId: 6,
};

const initialResellerHomepageById = {
  2: {
    enabled: true,
    html: `
<section style="font-family: Arial, sans-serif; padding: 24px; max-width: 820px; margin: 0 auto;">
  <h1 style="margin-bottom: 8px; color: #12385b;">Welcome to BluePeak Partner Hub</h1>
  <p style="margin-top: 0; color: #375066;">Important updates, onboarding links, and support resources for direct child companies.</p>
  <div style="margin: 20px 0; padding: 16px; border: 1px solid #dbe7f1; border-radius: 8px; background: #f4f8fc;">
    <h2 style="margin: 0 0 8px; color: #12385b;">What to do first</h2>
    <ul style="margin: 0; padding-left: 20px; color: #2c3f52;">
      <li>Review migration checklist.</li>
      <li>Confirm your primary technical contact details.</li>
      <li>Open a support ticket for branding onboarding.</li>
    </ul>
  </div>
  <p style="margin-bottom: 0;"><a href="https://example.com/partner-help" target="_blank" rel="noreferrer">Partner Help Center</a></p>
</section>
`.trim(),
    updatedAt: '2026-03-06T09:00:00Z',
  },
};

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [moveHistoryByCustomer, setMoveHistoryByCustomer] = useState(initialMoveHistory);
  const [sessionUser, setSessionUser] = useState(initialSessionUser);
  const [resellerHomepageById, setResellerHomepageById] = useState(initialResellerHomepageById);
  const [homepageConfigLoading, setHomepageConfigLoading] = useState(false);

  const resellers = useMemo(() => companies.filter((company) => company.type === 'Reseller'), [companies]);

  const findCompanyById = (companyId) => companies.find((company) => company.id === Number(companyId));

  const getPriceListById = (resellerId, priceListId) => {
    const reseller = findCompanyById(resellerId);
    return reseller?.priceLists?.find((priceList) => priceList.id === priceListId);
  };

  useEffect(() => {
    let cancelled = false;

    const syncHomepageConfigs = async () => {
      setHomepageConfigLoading(true);

      try {
        const configs = await Promise.all(
          resellers.map(async (reseller) => {
            try {
              const config = await getHomepageConfig(reseller.id);
              return [reseller.id, config];
            } catch {
              return [reseller.id, null];
            }
          }),
        );

        if (cancelled) {
          return;
        }

        setResellerHomepageById((previous) => {
          const next = { ...previous };

          configs.forEach(([resellerId, config]) => {
            if (!config) {
              return;
            }

            next[Number(resellerId)] = {
              enabled: Boolean(config.enabled),
              html: typeof config.html === 'string' ? config.html : '',
              updatedAt: config.updatedAt || new Date().toISOString(),
            };
          });

          return next;
        });
      } finally {
        if (!cancelled) {
          setHomepageConfigLoading(false);
        }
      }
    };

    syncHomepageConfigs();

    return () => {
      cancelled = true;
    };
  }, [resellers]);

  const assertPpaPrivileges = () => {
    if (sessionUser.role !== 'PPA') {
      throw new Error('Only Platform Provider Admins can manage custom homepages.');
    }
  };

  const getResellerHomepageConfig = (resellerId) => resellerHomepageById[Number(resellerId)] || null;

  const upsertResellerHomepageConfig = async ({ resellerId, enabled, html }) => {
    assertPpaPrivileges();

    const reseller = findCompanyById(resellerId);

    if (!reseller || reseller.type !== 'Reseller') {
      throw new Error('Custom homepage can only be configured for reseller companies.');
    }

    const sanitizedHtml = sanitizeCustomHomepageHtml(html || '');
    const trimmedHtml = sanitizedHtml.trim();
    const canEnable = Boolean(enabled) && trimmedHtml.length > 0;

    const candidateConfig = {
      enabled: canEnable,
      html: trimmedHtml,
      updatedAt: new Date().toISOString(),
    };

    const persistedConfig = await upsertHomepageConfigApi({
      resellerId: reseller.id,
      enabled: candidateConfig.enabled,
      html: candidateConfig.html,
    });

    const nextConfig = {
      enabled: Boolean(persistedConfig?.enabled),
      html: typeof persistedConfig?.html === 'string' ? persistedConfig.html : candidateConfig.html,
      updatedAt: persistedConfig?.updatedAt || candidateConfig.updatedAt,
    };

    setResellerHomepageById((previous) => ({
      ...previous,
      [reseller.id]: nextConfig,
    }));

    return {
      config: nextConfig,
      warnings: sanitizedHtml !== (html || '').trim() ? ['Disallowed HTML content was removed during sanitization.'] : [],
    };
  };

  const clearResellerHomepageConfig = async (resellerId) => {
    assertPpaPrivileges();

    await deleteHomepageConfig(resellerId);

    setResellerHomepageById((previous) => {
      const next = { ...previous };
      delete next[Number(resellerId)];
      return next;
    });
  };

  const getDirectParentResellerId = (company) => {
    if (!company) {
      return null;
    }

    if (company.type === 'Customer') {
      return company.resellerId || null;
    }

    if (company.type === 'Reseller') {
      return company.parentResellerId || null;
    }

    return null;
  };

  const getLandingHomepageForCompany = (companyId) => {
    const company = findCompanyById(companyId);
    const parentResellerId = getDirectParentResellerId(company);

    if (!parentResellerId) {
      return null;
    }

    const parentConfig = getResellerHomepageConfig(parentResellerId);

    if (!parentConfig?.enabled || !parentConfig.html) {
      return null;
    }

    return {
      resellerId: parentResellerId,
      html: parentConfig.html,
      updatedAt: parentConfig.updatedAt,
    };
  };

  const impersonateSessionUser = ({ role, companyId }) => {
    const nextCompany = findCompanyById(companyId);

    if (!nextCompany) {
      throw new Error('Selected company is invalid.');
    }

    const normalizedRole = role === 'PPA' ? 'PPA' : 'ResellerAdmin';
    const initials = nextCompany.name
      .split(' ')
      .map((token) => token.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();

    setSessionUser((previous) => ({
      ...previous,
      role: normalizedRole,
      companyId: nextCompany.id,
      displayName: normalizedRole === 'PPA' ? 'Erica Thomson' : `${nextCompany.name} Admin`,
      initials: initials || 'NA',
    }));
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
    sessionUser,
    getResellerHomepageConfig,
    upsertResellerHomepageConfig,
    clearResellerHomepageConfig,
    getLandingHomepageForCompany,
    impersonateSessionUser,
    homepageConfigLoading,
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
