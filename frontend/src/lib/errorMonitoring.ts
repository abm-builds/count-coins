// Error Monitoring Setup
// This is a generic error monitoring setup that can be integrated with services like Sentry, LogRocket, etc.

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class ErrorMonitoring {
  private static instance: ErrorMonitoring;
  private errors: ErrorInfo[] = [];
  private maxErrors = 50; // Keep last 50 errors in memory
  private isProduction = import.meta.env.PROD;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorMonitoring {
    if (!ErrorMonitoring.instance) {
      ErrorMonitoring.instance = new ErrorMonitoring();
    }
    return ErrorMonitoring.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
      });
    });
  }

  logError(error: Partial<ErrorInfo>) {
    const errorInfo: ErrorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      componentStack: error.componentStack,
      url: error.url || window.location.href,
      userAgent: navigator.userAgent,
      timestamp: error.timestamp || new Date().toISOString(),
      userId: error.userId,
      sessionId: this.sessionId,
    };

    // Store error in memory
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Log to console in development
    if (!this.isProduction) {
      console.error('Error logged:', errorInfo);
    }

    // TODO: Send to error monitoring service in production
    if (this.isProduction) {
      this.sendToMonitoringService(errorInfo);
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('last-error', JSON.stringify(errorInfo));
    } catch (e) {
      // Ignore storage errors
    }
  }

  private async sendToMonitoringService(error: ErrorInfo) {
    // TODO: Integrate with your preferred error monitoring service
    // Examples:
    // - Sentry: Sentry.captureException(error)
    // - LogRocket: LogRocket.captureException(error)
    // - Custom endpoint: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) })
    
    // For now, just log to console in production
    console.error('[Error Monitoring]', error);
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('last-error');
  }

  // Set user context for error tracking
  setUser(userId: string, email?: string) {
    this.errors.forEach(error => {
      error.userId = userId;
    });
  }

  // Clear user context on logout
  clearUser() {
    this.errors.forEach(error => {
      delete error.userId;
    });
  }
}

// React Error Boundary helper
export class ErrorBoundaryHelper {
  static logComponentError(error: Error, errorInfo: { componentStack?: string }) {
    const monitoring = ErrorMonitoring.getInstance();
    monitoring.logError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const errorMonitoring = ErrorMonitoring.getInstance();

// Performance monitoring
export const performanceMonitoring = {
  // Mark start of an operation
  mark: (name: string) => {
    if (performance && performance.mark) {
      performance.mark(name);
    }
  },

  // Measure time between two marks
  measure: (name: string, startMark: string, endMark: string) => {
    if (performance && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        
        // Log slow operations
        if (measure && measure.duration > 1000) {
          console.warn(`Slow operation detected: ${name} took ${measure.duration}ms`);
        }
        
        return measure?.duration;
      } catch (e) {
        // Marks might not exist
      }
    }
  },

  // Get page load metrics
  getPageLoadMetrics: () => {
    if (performance && performance.timing) {
      const timing = performance.timing;
      return {
        pageLoadTime: timing.loadEventEnd - timing.navigationStart,
        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstByteTime: timing.responseStart - timing.navigationStart,
      };
    }
    return null;
  },
};

