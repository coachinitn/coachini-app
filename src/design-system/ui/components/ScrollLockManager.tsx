"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { atom, useAtom } from "jotai";

// Global atom to track scroll lock state
export const scrollLockAtom = atom(false);

interface ScrollLockManagerProps {
  disableScrollOnPaths?: string[];
}

export default function ScrollLockManager({ 
  disableScrollOnPaths = [] 
}: ScrollLockManagerProps) {
  const [isLocked, setIsLocked] = useAtom(scrollLockAtom);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if the current path should have scroll locked
  useEffect(() => {
    // Determine if current path matches any of the paths to lock
    const shouldLock = disableScrollOnPaths.some(path => 
      pathname.includes(path)
    );
    
    setIsLocked(shouldLock);
  }, [pathname, searchParams, disableScrollOnPaths, setIsLocked]);

  // Apply the scroll lock when isLocked changes
  useEffect(() => {
    if (!document || !document.body) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    if (isLocked) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
      
      // Prevent layout shift by adding padding equal to scrollbar width
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      // Cleanup when component unmounts
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);

  // No UI needed - this is a utility component
  return null;
}

// Export a hook to programmatically control scroll lock
export function useScrollLock() {
  const [isLocked, setIsLocked] = useAtom(scrollLockAtom);
  
  return {
    isLocked,
    lockScroll: () => setIsLocked(true),
    unlockScroll: () => setIsLocked(false),
    toggleScrollLock: () => setIsLocked(!isLocked),
  };
} 