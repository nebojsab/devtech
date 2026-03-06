const API_MODE = import.meta.env.VITE_CUSTOM_HOMEPAGE_API_MODE || 'mock';
const API_BASE_URL = import.meta.env.VITE_CUSTOM_HOMEPAGE_API_BASE_URL || '';
const STORAGE_KEY = 'devtech.customHomepageByReseller';

function getMockStore() {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function setMockStore(store) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getHomepageConfig(resellerId) {
  if (API_MODE === 'remote') {
    return request(`/api/resellers/${resellerId}/custom-homepage`, { method: 'GET' });
  }

  const store = getMockStore();
  return store[String(resellerId)] || null;
}

export async function upsertHomepageConfig({ resellerId, enabled, html }) {
  if (API_MODE === 'remote') {
    return request(`/api/resellers/${resellerId}/custom-homepage`, {
      method: 'PUT',
      body: JSON.stringify({ enabled, html }),
    });
  }

  const store = getMockStore();
  const nextConfig = {
    enabled: Boolean(enabled),
    html: typeof html === 'string' ? html : '',
    updatedAt: new Date().toISOString(),
  };

  setMockStore({
    ...store,
    [String(resellerId)]: nextConfig,
  });

  return nextConfig;
}

export async function deleteHomepageConfig(resellerId) {
  if (API_MODE === 'remote') {
    return request(`/api/resellers/${resellerId}/custom-homepage`, { method: 'DELETE' });
  }

  const store = getMockStore();
  const nextStore = { ...store };
  delete nextStore[String(resellerId)];
  setMockStore(nextStore);
}
