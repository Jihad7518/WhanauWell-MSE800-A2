
/**
 * StressService Class
 * Handles the business logic for calculating and classifying stress levels.
 * Separates core logic from the route handlers.
 */
export class StressService {
  /**
   * Calculate stress score and classification based on user inputs
   */
  public static calculateStress(sleep: number, workload: number, mood: number) {
    // Score Logic: (10 - sleep) + workload + mood
    // Lower sleep = higher stress contribution
    const score = (10 - sleep) + workload + mood;

    let classification: 'Low' | 'Moderate' | 'High';
    if (score <= 5) {
      classification = 'Low';
    } else if (score <= 10) {
      classification = 'Moderate';
    } else {
      classification = 'High';
    }

    const explanation = this.getExplanation(classification);

    return {
      score,
      classification,
      explanation,
      timestamp: new Date()
    };
  }

  /**
   * Provides contextual explanation text based on classification
   */
  private static getExplanation(classification: 'Low' | 'Moderate' | 'High'): string {
    switch (classification) {
      case 'Low':
        return "Your current indicators suggest a healthy balance. Continue with your present routine.";
      case 'Moderate':
        return "You are reporting elevated stress markers. Consider stress mitigation techniques or community engagement.";
      case 'High':
        return "Significant stress levels detected. We recommend contacting your programme coordinator for support resources.";
      default:
        return "Assessment complete.";
    }
  }

  /**
   * Helper to aggregate stress results for a specific organisation
   * ensuring privacy (no personal IDs returned in aggregated stats)
   */
  public static getAggregatedStats(records: any[]) {
    const total = records.length;
    if (total === 0) return { low: 0, moderate: 0, high: 0 };

    const counts = records.reduce((acc, record) => {
      acc[record.classification.toLowerCase()]++;
      return acc;
    }, { low: 0, moderate: 0, high: 0 });

    return {
      total,
      lowPercentage: (counts.low / total) * 100,
      moderatePercentage: (counts.moderate / total) * 100,
      highPercentage: (counts.high / total) * 100
    };
  }
}
