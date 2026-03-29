// telemetry.decorator.ts
import * as fs from 'fs';
import * as path from 'path';

/**
 * Method Decorator for performance tracking and error logging.
 * It measures execution time and records results to telemetry.log.
 */
export function Telemetry() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const startTime = performance.now();
      const timestamp = new Date().toISOString();
      const logPath = path.join(__dirname, 'telemetry.log');

      try {
        // Execute the original business logic (e.g., getAggregatedStats)
        const result = originalMethod.apply(this, args);
        
        const duration = (performance.now() - startTime).toFixed(4);
        const logEntry = `[${timestamp}] SUCCESS: Method ${propertyKey} executed in ${duration}ms\n`;
        
        // Append log entry to file
        fs.appendFileSync(logPath, logEntry);
        return result;

      } catch (error) {
        const duration = (performance.now() - startTime).toFixed(4);
        const logEntry = `[${timestamp}] ERROR: Method ${propertyKey} failed after ${duration}ms - Error: ${error.message}\n`;
        
        // Record the failure to the log file
        fs.appendFileSync(logPath, logEntry);
        
        // Re-throw the error so it can be handled by the controller/route
        throw error;
      }
    };

    return descriptor;
  };
}