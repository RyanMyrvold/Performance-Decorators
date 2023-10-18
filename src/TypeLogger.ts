/**
 * @file TypeLogger.ts
 * Provides logging capabilities for type operations.
 */

/**
 * Type Logger for debugging and development.
 */
export class TypeLogger {
    private static isEnabled: boolean = true;
  
    /**
     * Enables or disables logging.
     * @param enabled - Whether logging should be enabled.
     */
    public static setLogging(enabled: boolean): void {
      this.isEnabled = enabled;
    }
  
    /**
     * Logs a message.
     * @param message - Message to log.
     */
    public static log(message: string): void {
        if (this.isEnabled) {
            console.log(typeof message === 'string' ? message : JSON.stringify(message));
          }
    }
  }
  