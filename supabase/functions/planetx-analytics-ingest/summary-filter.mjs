// Shared analytics summaries must represent product/user activity, not CI probes.
// Raw ledger rows are intentionally retained; this filter is summary-only.
export function analyticsProperties(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      return {};
    }
  }
  return {};
}

function truthyAuditFlag(value) {
  return value === true || (typeof value === 'string' && value.trim().toLowerCase() === 'true');
}

export function isSyntheticAnalyticsRow(row) {
  const properties = analyticsProperties(row?.properties);
  return truthyAuditFlag(properties.synthetic) || truthyAuditFlag(properties.audit_probe);
}

export function filterSummaryRows(rows) {
  return rows.filter((row) => !isSyntheticAnalyticsRow(row));
}
