import assert from 'node:assert/strict';
import { filterSummaryRows, isSyntheticAnalyticsRow } from '../supabase/functions/planetx-analytics-ingest/summary-filter.mjs';

const realPageView = {
  event: 'page_view',
  session_id: 'real-session',
  anonymous_user_id: 'real-user',
  properties: { referrer: 'direct' },
};
const syntheticProbe = {
  event: 'system_audit_probe',
  session_id: 'audit-session',
  anonymous_user_id: 'audit-user',
  properties: { synthetic: true, audit_probe: true, github_run_id: '123' },
};
const stringEncodedProbe = {
  event: 'system_audit_probe',
  session_id: 'audit-session-2',
  anonymous_user_id: 'audit-user-2',
  properties: JSON.stringify({ synthetic: 'true' }),
};
const ordinarySyntheticNamedEvent = {
  event: 'system_audit_probe',
  session_id: 'real-session-2',
  anonymous_user_id: 'real-user-2',
  properties: {},
};

assert.equal(isSyntheticAnalyticsRow(realPageView), false, 'real activity must remain eligible for summaries');
assert.equal(isSyntheticAnalyticsRow(syntheticProbe), true, 'boolean synthetic/audit flags must identify CI probes');
assert.equal(isSyntheticAnalyticsRow(stringEncodedProbe), true, 'string/serialized synthetic flags must be handled defensively');
assert.equal(isSyntheticAnalyticsRow(ordinarySyntheticNamedEvent), false, 'event names alone must not silently discard unflagged raw data');

const rawLedger = [realPageView, syntheticProbe, stringEncodedProbe, ordinarySyntheticNamedEvent];
const summaryRows = filterSummaryRows(rawLedger);
assert.equal(rawLedger.length, 4, 'raw ledger input must remain untouched');
assert.deepEqual(summaryRows, [realPageView, ordinarySyntheticNamedEvent], 'summary rows must exclude only explicitly flagged audit traffic');

console.log('Analytics summary hygiene contract passed: raw audit evidence retained, flagged synthetic rows excluded from aggregates.');
