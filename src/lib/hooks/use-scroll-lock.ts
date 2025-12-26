'use client';

import * as React from 'react';

/**
 * Hook to prevent body scrolling
 * 
 * This hook locks and unlocks the scroll of the body,
 * preserving the scroll position and handling cleanup.
 * It is optimized for performance by avoiding layout thrashing.
 *
 * @returns [isLocked, { lockScroll, unlockScroll }] - Lock state and control functions
 * 
 * @example
 * ```tsx
 * const [isLocked, { lockScroll, unlockScroll }] = useScrollLock();
 * 
 * // Use in a component
 * React.useEffect(() => {
 *   if (someCondition) {
 *     lockScroll();
 *     return unlockScroll;
 *   }
 * }, [someCondition, lockScroll, unlockScroll]);
 * ```
 */
export function useScrollLock(): [
  boolean,
  { lockScroll: () => void; unlockScroll: () => void }
] {
  const [isLocked, setIsLocked] = React.useState(false);
  
  // Store original body style values to restore them later
  const originalStyles = React.useRef<{
    overflow: string;
    paddingRight: string;
    width: string;
  } | null>(null);
  
  // Store original scroll position
  const scrollPosition = React.useRef(0);
  
  // Lock scroll handler using requestAnimationFrame for performance
  const lockScroll = React.useCallback(() => {
    if (typeof window === 'undefined' || isLocked) return;
    
    // Store scroll position for later restoration
    scrollPosition.current = window.scrollY || window.pageYOffset;
    
    // Get the scrollbar width to prevent content shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Batch DOM reads and writes to prevent layout thrashing
    requestAnimationFrame(() => {
      // Store original styles to restore later
      const bodyStyle = window.getComputedStyle(document.body);
      originalStyles.current = {
        overflow: bodyStyle.overflow,
        paddingRight: bodyStyle.paddingRight,
        width: bodyStyle.width,
      };
      
      // Apply fixed position to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Fix the body in place to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      
      setIsLocked(true);
    });
  }, [isLocked]);
  
  // Unlock scroll handler
  const unlockScroll = React.useCallback(() => {
    if (typeof window === 'undefined' || !isLocked) return;
    
    // Batch DOM reads and writes to prevent layout thrashing
    requestAnimationFrame(() => {
      // Restore original body styles
      if (originalStyles.current) {
        document.body.style.overflow = originalStyles.current.overflow;
        document.body.style.paddingRight = originalStyles.current.paddingRight;
        document.body.style.width = originalStyles.current.width;
      }
      
      // Restore position
      document.body.style.position = '';
      document.body.style.top = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPosition.current);
      
      setIsLocked(false);
    });
  }, [isLocked]);
  
  // Ensure we clean up when component unmounts
  React.useEffect(() => {
    // In case the component unmounts while scroll is locked
    return () => {
      if (isLocked) {
        unlockScroll();
      }
    };
  }, [isLocked, unlockScroll]);
  
  return [isLocked, { lockScroll, unlockScroll }];
}

/**
 * Alternative API with state control built in
 * 
 * @param initialState - Initial lock state
 * @returns [isLocked, setIsLocked] - State and setter
 * 
 * @example
 * ```tsx
 * const [isLocked, setIsLocked] = useScrollLockState(false);
 * 
 * // Toggle the scroll lock
 * function toggleScrollLock() {
 *   setIsLocked(prev => !prev);
 * }
 * ```
 */
export function useScrollLockState(initialState = false): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [isLocked, setIsLockedState] = React.useState(initialState);
  const [, { lockScroll, unlockScroll }] = useScrollLock();
  
  React.useEffect(() => {
    if (isLocked) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [isLocked, lockScroll, unlockScroll]);
  
  return [isLocked, setIsLockedState];
}
