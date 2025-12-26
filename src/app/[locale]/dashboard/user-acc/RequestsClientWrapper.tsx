'use client';

import React from 'react';
import { AdminPageWrapper } from '@/core/rbac/page-wrapper';
import { RBACUserAcc } from '../../../../design-system/pages/user-accounts';

export default function UserAccountsClientWrapper() {
  return (
    <AdminPageWrapper
      pagePath="/dashboard/user-acc"
      redirectOnDenied={false}
    >
      <RBACUserAcc />
    </AdminPageWrapper>
  );
}