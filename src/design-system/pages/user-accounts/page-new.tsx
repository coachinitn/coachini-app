'use client';
import React from 'react';

import NavigationWrapper from '../../ui/layout/navigation-wrapper';
import SectionWrapper from '../../ui/layout/section-wrapper';
import PageTabNavigation from '../../ui/layout/page-tab-navigation';
import UserAccountsStatsHeader from './components/UserAccountsStatsHeader';
import { UserAccountActionsProvider } from './context/UserAccountActionsContext';
import UserAccountsPageTabsNew from './tabs/UserAccountsPageTabsNew';
import { mockCoachAccounts, mockBusinessAccounts, mockUserAccountsStats } from './data/mockData';
import { AccountStatus } from './types';

const UserAccountsPageAdminNew = () => {
    // Custom action implementations for this page
    const customActions = {
        onView: (account: any) => {
            console.log('View account details:', account);
            // TODO: Implement view details logic
        },
        onEdit: (account: any) => {
            console.log('Edit account:', account);
            // TODO: Implement edit logic
        },
        onDelete: (accountId: string) => {
            console.log('Delete account:', accountId);
            // TODO: Implement delete logic
        },
        onCreateAccount: (account: any) => {
            console.log('Create account:', account);
            // TODO: Implement create account logic
        },
        onStatusChange: (accountId: string, newStatus: AccountStatus) => {
            console.log('Status change:', accountId, newStatus);
            // TODO: Implement status change logic
        },
        onDealStatusChange: (accountId: string, newStatus: 'deal-won' | 'pending' | 'on-hold' | 'deal-lost') => {
            console.log('Deal status change:', accountId, newStatus);
            // TODO: Implement deal status change logic
        },
        onFileDownload: (fileId: string, fileName: string) => {
            console.log('Download file:', fileId, fileName);
            // TODO: Implement file download logic
        },
        onCustomAction: (actionType: string, accountId: string, payload?: any) => {
            console.log('Custom action:', actionType, accountId, payload);
            // TODO: Implement custom actions
        }
    };

    // Generate tabs using the NEW UserAccountsPageTabsNew function
    const tabs = UserAccountsPageTabsNew({
        coachAccounts: mockCoachAccounts,
        businessAccounts: mockBusinessAccounts
    });

    return (
        <UserAccountActionsProvider customActions={customActions}>
            {/* <NavigationWrapper> */}
                <SectionWrapper className='py-0'>
                    <div className='relative h-[calc(100vh-10rem)] overflow-hidden'>
                        {/* Stats Header */}
                        <UserAccountsStatsHeader stats={mockUserAccountsStats} />
                        {/* Main Content */}
                        <div className='h-full'>
                            <PageTabNavigation tabs={tabs} />
                        </div>
                    </div>
                </SectionWrapper>
            {/* </NavigationWrapper> */}
        </UserAccountActionsProvider>
    );
};

export default UserAccountsPageAdminNew;
