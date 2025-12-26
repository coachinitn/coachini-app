// Export types
export * from './types';

// Export components
export { default as CoachAccountsTable } from './components/CoachAccountsTable';
export { default as BusinessAccountsTable } from './components/BusinessAccountsTable';
export { default as AccountStatusBadge } from './components/AccountStatusBadge';
export { default as UserAccountsStatsHeader } from './components/UserAccountsStatsHeader';

// Export context and hooks
export {
  UserAccountActionsProvider,
  useUserAccountActions,
  useBusinessAccountActions,
  useCoachAccountActions,
} from './context/UserAccountActionsContext';

// Export tab components
export {
  CoachAccountsTabs,
  BusinessAccountsTabs,
  UserAccountsPageTabs,
} from './tabs';

// Export main page
export { default as UserAccountsPageAdmin } from './page';

// Export mock data
export {
  mockCoachAccounts,
  mockBusinessAccounts,
  mockUserAccountsStats,
} from './data/mockData';
