export function formatCompanyId(companyId) {
  if (companyId === null || companyId === undefined || companyId === '') {
    return '-';
  }

  const numericId = Number(companyId);
  if (Number.isNaN(numericId)) {
    return String(companyId);
  }

  return String(Math.trunc(numericId)).padStart(7, '0');
}
