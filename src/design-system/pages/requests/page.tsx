'use client';
import React from 'react';

import NavigationWrapper from '../../ui/layout/navigation-wrapper';
import SectionWrapper from '../../ui/layout/section-wrapper';
import PageTabNavigation from '../../ui/layout/page-tab-navigation';
import RequestsStatsHeader from './components/RequestsStatsHeader';
import { RequestActionsProvider } from './context/RequestActionsContext';
import RequestsPageTabs from './tabs/RequestsPageTabs';
import { mockCoachRequests, mockBusinessRequests, mockRequestsStats } from './data/mockData';
import { RequestStatus, DealProgress } from './types';

const ThemesPageSupervisor = () => {
    // Custom action implementations for this page
    const customActions = {
        onView: (request: any) => {
            console.log('View request details:', request);
            // TODO: Implement view details logic
        },
        onEdit: (request: any) => {
            console.log('Edit request:', request);
            // TODO: Implement edit logic
        },
        onDelete: (requestId: string) => {
            console.log('Delete request:', requestId);
            // TODO: Implement delete logic
        },
        onStatusChange: (requestId: string, newStatus: RequestStatus) => {
            console.log('Status change:', requestId, newStatus);
            // TODO: Implement status change logic
        },
        onDealProgressChange: (requestId: string, newProgress: DealProgress) => {
            console.log('Deal progress change:', requestId, newProgress);
            // TODO: Implement deal progress change logic
        },
        onCallStatusChange: (requestId: string, newCallStatus: 'call-made' | 'call-not-made') => {
            console.log('Call status change:', requestId, newCallStatus);
            // TODO: Implement call status change logic
        },
        onFileDownload: (fileId: string, fileName: string) => {
            console.log('Download file:', fileId, fileName);
            // TODO: Implement file download logic
        }
    };

    // Get tabs from the RequestsPageTabs component
    const tabs = RequestsPageTabs({
        coachRequests: mockCoachRequests,
        businessRequests: mockBusinessRequests
    });

    return (
        <RequestActionsProvider customActions={customActions}>
            <SectionWrapper className='py-0'>
                <div className='relative h-[calc(100vh-10rem)] overflow-hidden'>
                    {/* Stats Header */}
                    <RequestsStatsHeader stats={mockRequestsStats} />
                    {/* Main Content */}
                    <div className='h-full'>
                        <PageTabNavigation tabs={tabs} />
                    </div>
                </div>
            </SectionWrapper>
        </RequestActionsProvider>
    );
};

export default ThemesPageSupervisor;
