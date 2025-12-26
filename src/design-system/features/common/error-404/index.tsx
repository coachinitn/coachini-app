import React from 'react';
import { SuperButton } from '@/design-system/ui/base/super-button';
import { DisplayMedium, HeadlineLarge, LabelLarge, ButtonMedium } from '@/design-system/ui/base/Text';
import AuthLayout from '../auth-layout';
import Link from 'next/link';
import Image from 'next/image';

interface Error404Props {
    onBackToHome?: () => void;
}

export const Error404: React.FC<Error404Props> = ({ onBackToHome }) => {
    return (
        <AuthLayout>
            <div className='rounded-lg p-8 text-left flex items-center justify-center'>
                <div className='flex flex-col md:flex-row items-center'>
                    <div className='space-y-4'>
                        <div className=''>
                            <DisplayMedium className='mb-2'>Oops....</DisplayMedium>
                            <HeadlineLarge className='text-gray-800 mb-4'>Page not found</HeadlineLarge>

                            <LabelLarge className='text-gray-600 mb-6'>
                                This Page doesn't exist or was removed!
                                <br />
                                We suggest you back to home.
                            </LabelLarge>
                        </div>

                        <Link href='/' passHref>
                            <SuperButton
                                onClick={onBackToHome}
                                className='flex items-center gap-2'
                                variant='action'
                                intent='primary'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M10 19l-7-7m0 0l7-7m-7 7h18'
                                    />
                                </svg>
                                <ButtonMedium>Back to home</ButtonMedium>
                            </SuperButton>
                        </Link>
                    </div>

                    <div className='flex justify-center'>
                        <Image
                            src='/misc/not-found.png'
                            alt='Page not found illustration'
                            width={526}
                            height={526}
                            className='pointer-events-none select-none'
                            priority
                        />
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Error404;
