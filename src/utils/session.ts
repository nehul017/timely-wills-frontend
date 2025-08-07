/**
 * Session management utilities for handling JWT token expiration
 */

export interface SessionData {
  token: string;
  loginTime: number;
  lastActivity: number;
}

/**
 * Get session timeout duration from environment variables (in milliseconds)
 * Uses staging-specific timeout if in staging environment, otherwise uses default timeout
 * Default to 1 hour (3600000ms) if not set
 */
export const getSessionTimeout = (): number => {
  // Check if we're in staging environment
  const isStaging = process.env.NEXT_PUBLIC_NODE_ENV === 'staging';

  // Use staging-specific timeout if in staging, otherwise use default
  const timeout = isStaging
    ? process.env.NEXT_PUBLIC_SESSION_TIMEOUT_STAGING
    : process.env.NEXT_PUBLIC_SESSION_TIMEOUT;

  return timeout ? parseInt(timeout, 10) : 3600000; // 1 hour default
};

/**
 * Store session data in localStorage
 */
export const storeSession = (token: string): void => {
  const now = Date.now();
  const sessionDate: SessionData = {
    token,
    loginTime: now,
    lastActivity: now,
  };

  localStorage.setItem('jwt', token);
  localStorage.setItem('sessionData', JSON.stringify(sessionDate));
};

/**
 * Get Current session data
 */
export const getSessionData = (): SessionData | null => {
  try {
    const token = localStorage.getItem('jwt');
    const sessionDataStr = localStorage.getItem('sessionData');

    if (!token || !sessionDataStr) {
      return null;
    }

    const sessionData: SessionData = JSON.parse(sessionDataStr);
    return { ...sessionData, token };
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

/**
 * Update  last activity timestamp
 */
export const updateLastActivity = (): void => {
  const sessionData = getSessionData();
  if (sessionData) {
    const updateSessionData = {
      ...sessionData,
      lastActivity: Date.now(),
    };
    localStorage.setItem('sessionData', JSON.stringify(updateSessionData));
  }
};

/**
 * Check if current session is expired
 */
export const isSessionExpired = (): boolean => {
  const sessionData = getSessionData();
  if (!sessionData) {
    return true;
  }

  const now = Date.now();
  const timeout = getSessionTimeout();
  const timeSinceLastActivity = now - sessionData.loginTime;

  return timeSinceLastActivity > timeout;
};

/**
 * Clear Session data
 */
export const clearSession = (): void => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('sessionData');
};

/**
 * Get remaining session time in milliseconds
 */
export const getRemainingSessionTime = (): number => {
  const sessionData = getSessionData();
  if (!sessionData) {
    return 0;
  }

  const now = Date.now();
  const timeout = getSessionTimeout();
  const timeSinceLastActivity = now - sessionData.loginTime;

  return timeout - timeSinceLastActivity;
};

/**
 * Format remaining time as human readable string
 */
export const formatRemainingTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};
