'use client';

import { useEffect, useCallback, useRef } from 'react';

import { useAuthStore } from '@/store/user-info';
import {
  isSessionExpired,
  clearSession,
  updateLastActivity,
} from '@/utils/session';

import useResetAllGlobalData from './use-reset-all-global-data';

interface UseSessionTimeoutOptions {
  checkInterval?: number; // How often to check session status (in milliseconds)
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const {
    checkInterval = 60000, // 1 minute default
  } = options;

  const { removeUserInfo } = useAuthStore();
  const { resetAllGlobalData } = useResetAllGlobalData();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  const handleSessionExpiry = useCallback(() => {
    resetAllGlobalData();
    clearSession();
    removeUserInfo();
    localStorage.removeItem('progress-step-storage');
    window.location.replace('/login');
  }, [removeUserInfo, resetAllGlobalData]);

  const checkSessionStatus = useCallback(() => {
    if (isSessionExpired()) {
      handleSessionExpiry();
    }

    // No warning needed - just redirect when session expires
  }, [handleSessionExpiry]);

  const startSessionMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(checkSessionStatus, checkInterval);
  }, [checkSessionStatus, checkInterval]);

  const stopSessionMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Only start monitoring if we have a valid session
    const token = localStorage.getItem('jwt');
    if (token && !isSessionExpired()) {
      startSessionMonitoring();
    }

    return () => {
      stopSessionMonitoring();
    };
  }, [startSessionMonitoring, stopSessionMonitoring]);

  // Update activity on user interactions
  useEffect(() => {
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = () => {
      updateLastActivity();
      warningShownRef.current = false; // Reset warning flag on activity
    };

    // Throttle activity updates to avoid excessive localStorage writes
    let lastUpdate = 0;
    const throttledHandleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 30000) {
        // Update at most every 30 seconds
        lastUpdate = now;
        handleActivity();
      }
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, throttledHandleActivity, true);
    });

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, throttledHandleActivity, true);
      });
    };
  }, []);

  return {
    checkSessionStatus,
    startSessionMonitoring,
    stopSessionMonitoring,
  };
};
