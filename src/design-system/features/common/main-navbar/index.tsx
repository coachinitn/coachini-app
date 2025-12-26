import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SuperButton } from '@/design-system/ui/base/super-button';
import { ButtonMedium } from '@/design-system/ui/base/Text';
import { useTypedTranslations } from '@/core/i18n/useTypedTranslations';
import { DemoRequestModal } from '@/design-system/features/demo-request';

interface MainNavbarProps {
    className?: string;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ className }) => {
    // Translations
    const t = useTypedTranslations('common.navbar');

    return (
        <header
            className={`w-full px-4 py-3 md:px-8 md:py-4 bg-[#FCFBF7] shadow-[0px_1px_4px_0px_rgba(9,2,3,0.3)] ${
                className || ''
            }`}>
            <div className='container mx-auto'>
                <nav className='flex items-center justify-between'>
                    {/* Logo Section */}
                    <div className='flex items-center'>
                        <Link href='/' className='flex items-center'>
                            {/* Small logo for mobile */}
                            <div className='block md:hidden'>
                                <Image
                                    src='/icons/layout/C-Logo-Sm.png'
                                    alt={t('logoAlt')}
                                    width={32}
                                    height={32}
                                    className='w-8 h-8'
                                    priority
                                />
                            </div>
                            {/* Large logo for desktop */}
                            <div className='hidden md:block'>
                                <Image
                                    src='/icons/layout/C-Logo-Big.svg'
                                    alt={t('logoAlt')}
                                    width={120}
                                    height={40}
                                    className='h-10 w-auto'
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Buttons Section */}
                    <div className='flex items-center space-x-2 md:space-x-4'>
                        {/* Login Button */}
                        <Link href='/auth/login'>
                            <SuperButton variant='action' intent='primary' size='md' className='px-3 md:px-6'>
                                <ButtonMedium>{t('login')}</ButtonMedium>
                            </SuperButton>
                        </Link>

                        {/* Demo Request Button - Desktop */}
                        <div className='hidden sm:block'>
                            <DemoRequestModal showRoleSelector={true}>
                                <SuperButton variant='action' intent='primary' size='md' className='px-3 md:px-6'>
                                    <ButtonMedium>{t('bookDemo')}</ButtonMedium>
                                </SuperButton>
                            </DemoRequestModal>
                        </div>

                        {/* Demo Request Button - Mobile (smaller, icon-like) */}
                        <div className='block sm:hidden'>
                            <DemoRequestModal showRoleSelector={true}>
                                <SuperButton variant='action' intent='primary' size='md' className='px-3 md:px-6'>
                                    <ButtonMedium>Démo</ButtonMedium>
                                </SuperButton>
                            </DemoRequestModal>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default MainNavbar;
