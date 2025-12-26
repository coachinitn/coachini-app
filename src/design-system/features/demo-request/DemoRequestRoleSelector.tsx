'use client';

import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { DemoRequestType } from '@/lib/api/demo/demo-request.types';
import { DisplayLarge, HeadlineLarge, HeadlineSmall, TitleLarge } from '@/design-system/ui/base/Text';
import { cn } from '@/core/utils';
import { useTypedTranslations } from '@/core/i18n';

interface DemoRequestRoleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: DemoRequestType) => void;
}

export function DemoRequestRoleSelector({
  isOpen,
  onClose,
  onSelectRole,
}: DemoRequestRoleSelectorProps) {
  const t = useTypedTranslations('pages.demo');

  if (!isOpen) return null;

  const handleRoleSelect = (role: DemoRequestType) => {
    onSelectRole(role);
  };

  return (
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

          {/* Modal */}
          <div className='relative bg-white rounded-3xl shadow-xl max-w-[1174px] max-h-[90vh] w-full mx-4 px-6 py-6 flex flex-col justify-start items-center gap-2 overflow-y-auto lg:px-10 lg:py-8 lg:gap-10'>
              {/* Close button */}
              {/* Header with close button */}
              <div className='flex justify-between w-full items-start mb-6 lg:mb-0'>
                  <div className='flex flex-col'>
                      <HeadlineLarge className='text-black'>{t('roleSelector.title')}</HeadlineLarge>
                      <HeadlineSmall className='text-black'>{t('roleSelector.subtitle')}</HeadlineSmall>
                  </div>
                  <button
                      onClick={onClose}
                      className='flex justify-center items-center hover:opacity-70 transition-opacity mt-1'>
                      <X className='w-[20px] h-[20px] text-[#170f49]' strokeWidth={2} />
                  </button>
              </div>

              {/* Role Options */}
              <div className={cn('flex justify-start items-center flex-col gap-8 lg:flex-row lg:gap-16 w-full')}>
                  {/* Coach Option */}
                  <div
                      onClick={() => handleRoleSelect(DemoRequestType.COACH)}
                      className={cn(
                          'w-full max-w-[515px] h-[280px] relative bg-white rounded-[14px] outline-1 outline-offset-[-1px] outline-[#094ba4] overflow-hidden cursor-pointer',
                          'hover:shadow-lg transition-all group',
                          'lg:h-[467px] lg:w-[515px]'
                      )}>
                      <div className='w-[calc(100%-46px)] left-[23px] top-[24px] absolute flex flex-col justify-start items-start gap-4 lg:top-[71px] lg:gap-6 lg:w-[303px]'>
                          <DisplayLarge className='text-black'>{t('roleSelector.coach.title')}</DisplayLarge>
                          <HeadlineSmall className='text-black'>
                              {t('roleSelector.coach.description')}
                          </HeadlineSmall>
                      </div>
                      <div className='left-[29px] bottom-[23px] lg:top-[379px] absolute flex justify-start items-center gap-3 group-hover:gap-4 transition-all'>
                          <TitleLarge className='text-[#094ba4]'>{t('roleSelector.coach.cta')}</TitleLarge>
                          <div className='w-8 h-8 relative'>
                              <ArrowRight
                                  className='w-8 h-8 text-[#094ba4] group-hover:translate-x-1 transition-transform'
                                  strokeWidth={1.5}
                              />
                          </div>
                      </div>
                  </div>

                  {/* Business Option */}
                  <div
                      onClick={() => handleRoleSelect(DemoRequestType.BUSINESS)}
                      className='w-full max-w-[515px] h-[280px] relative bg-white rounded-[14px] outline-1 outline-offset-[-1px] outline-[#094ba4] overflow-hidden cursor-pointer hover:shadow-lg transition-all group lg:h-[467px] lg:w-[515px]'>
                      <div className='w-[calc(100%-46px)] left-[23px] top-[24px] absolute flex flex-col justify-start items-start gap-4 lg:top-[71px] lg:gap-6 lg:w-[336px]'>
                          <DisplayLarge className='text-black'>{t('roleSelector.business.title')}</DisplayLarge>
                          <HeadlineSmall className='text-black'>
                              {t('roleSelector.business.description')}
                          </HeadlineSmall>
                      </div>
                      <div className='left-[29px] bottom-[23px] lg:top-[379px] absolute flex justify-start items-center gap-3 group-hover:gap-4 transition-all'>
                          <TitleLarge className='text-[#094ba4]'>{t('roleSelector.business.cta')}</TitleLarge>
                          <div className='w-8 h-8 relative'>
                              <ArrowRight
                                  className='w-8 h-8 text-[#094ba4] group-hover:translate-x-1 transition-transform'
                                  strokeWidth={1.5}
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
