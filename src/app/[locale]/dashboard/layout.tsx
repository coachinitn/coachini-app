import React from 'react';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata';
import { ChatLayout } from '@/design-system/ui/layout/chat-layout';
import { HelpCenterLayout } from '@/design-system/ui/layout/help-center-layout';
import { cn } from '../../../core/utils';
import RBACDashboardSidebar from '@/design-system/ui/components/dashboard-sidebar/rbac-sidebar';
import { DynamicNavHeader } from '@/design-system/ui/components/navbar/dynamic-nav-header';
import { SyncBaseProvider } from '@/core/syncbase/providers/SyncBaseProvider';
import { NotificationLayout } from '@/design-system/ui/layout/notification-layout';
import { SyncBaseReadyGuard } from '@/design-system/ui/components/syncbase-ready-guard';
import { DashboardSkeleton } from '@/design-system/ui/components/syncbase-ready-guard/DashboardSkeleton';
import { UserInfoLogger } from './UserInfoLogger';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return generatePageMetadata({
        locale,
        namespace: 'pages.dashboard'
    });
}

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    await params; 
    return (
        <>
            <SyncBaseProvider debug={process.env.NODE_ENV === 'development'}>
                <div className='relative flex'>
                    <RBACDashboardSidebar showPermissionCount showRoleIndicator />
                    <main className={cn('relative flex-1')}>
                        <SyncBaseReadyGuard>
                            <NotificationLayout>
                                <HelpCenterLayout>
                                <ChatLayout>
                                    {/* <DynamicNavHeader /> */}
                                    {/* Page content */}
                                        {children}
                                </ChatLayout>
                                </HelpCenterLayout>
                            </NotificationLayout>
                        {/* </SyncBaseReadyGuard> */}
                    </main>
                </div>
            </SyncBaseProvider>
        </>
    );
}
