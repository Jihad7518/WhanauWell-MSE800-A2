
import { Telemetry } from '../decorators/telemetry.decorator'; // Ensure this path is correct

/**
 * StressService Class
 * Handles the business logic for calculating and classifying stress levels.
 * Separates core logic from the route handlers.
 */
export class StressService {
  public static questions = [
    { id: 'q1', text: 'In the last month, how often have you been upset because of something that happened unexpectedly?', category: 'Unexpected' },
    { id: 'q2', text: 'In the last month, how often have you felt that you were unable to control the important things in your life?', category: 'Control' },
    { id: 'q3', text: 'In the last month, how often have you felt nervous and "stressed"?', category: 'Nervousness' },
    { id: 'q4', text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?', category: 'Confidence' },
    { id: 'q5', text: 'In the last month, how often have you felt that things were going your way?', category: 'Success' },
    { id: 'q6', text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?', category: 'Coping' },
    { id: 'q7', text: 'In the last month, how often have you been able to control irritations in your life?', category: 'Irritation' },
    { id: 'q8', text: 'In the last month, how often have you felt that you were on top of things?', category: 'Control' },
    { id: 'q9', text: 'In the last month, how often have you been angered because of things that were outside of your control?', category: 'Anger' },
    { id: 'q10', text: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?', category: 'Overwhelmed' },
  ];

  /**
   * Calculate stress score and classification based on user inputs (PSS-10)
   * Scale: 0-4 (Never to Very Often)
   * Inverted questions: q4, q5, q7, q8
   */
  public static calculateStress(responses: { questionId: string; value: number }[]) {
    const invertedQuestions = ['q4', 'q5', 'q7', 'q8'];
    
    let totalScore = 0;
    responses.forEach(r => {
      if (invertedQuestions.includes(r.questionId)) {
        totalScore += (4 - r.value);
      } else {
        totalScore += r.value;
      }
    });

    // PSS-10 Scoring:
    // 0-13: Low Stress
    // 14-26: Moderate Stress
    // 27-40: High Perceived Stress
    let classification: 'Low' | 'Moderate' | 'High';
    if (totalScore <= 13) {
      classification = 'Low';
    } else if (totalScore <= 26) {
      classification = 'Moderate';
    } else {
      classification = 'High';
    }

    const explanation = this.getExplanation(classification, responses);
    const recommendations = this.getRecommendations(classification);

    return {
      score: totalScore,
      classification,
      explanation,
      recommendations,
      timestamp: new Date()
    };
  }

  private static getExplanation(classification: 'Low' | 'Moderate' | 'High', responses: { questionId: string; value: number }[]): string {
    const highCoping = responses.find(r => r.questionId === 'q6' && r.value >= 3);
    const lowConfidence = responses.find(r => r.questionId === 'q4' && r.value <= 1);
    
    let detail = "";
    if (highCoping && lowConfidence) detail = " due to feeling unable to cope and low confidence in handling problems";
    else if (highCoping) detail = " primarily due to feeling overwhelmed by responsibilities";
    else if (lowConfidence) detail = " influenced by a lack of confidence in managing personal challenges";

    switch (classification) {
      case 'Low':
        return `Your PSS-10 score suggests a healthy level of perceived stress${detail}. You seem to be managing life's challenges well.`;
      case 'Moderate':
        return `You are experiencing moderate levels of stress${detail}. It might be helpful to practice some stress-reduction techniques.`;
      case 'High':
        return `High levels of perceived stress detected${detail}. We strongly recommend reaching out for support from a professional or your community coordinator.`;
      default:
        return "Assessment complete.";
    }
  }

  private static getRecommendations(classification: 'Low' | 'Moderate' | 'High'): string[] {
    const base = ["This is not medical advice. Please consult a professional for health concerns."];
    switch (classification) {
      case 'Low':
        return [...base, "Continue your current wellness practices.", "Consider mentoring others in the community."];
      case 'Moderate':
        return [...base, "Try the 'Mindfulness Basics' module.", "Consider joining 'Tech-Free Whānau Connect'.", "Schedule a short walk outdoors today."];
      case 'High':
        return [...base, "Reach out to a coordinator for 1-on-1 support.", "Join a 'Breathing Session' programme.", "Prioritize rest and reduce non-essential screen time."];
      default:
        return base;
    }
  }

  @Telemetry()
  public static getAggregatedStats(records: any[]) {
    const total = records.length;
    if (total === 0) return { low: 0, moderate: 0, high: 0, averageScore: 0, total: 0 };

    let totalScore = 0;
    const counts = records.reduce((acc, record) => {
      totalScore += record.score || 0;
      const cat = record.classification.toLowerCase();
      if (acc[cat] !== undefined) acc[cat]++;
      return acc;
    }, { low: 0, moderate: 0, high: 0 });

    return {
      total,
      low: counts.low,
      moderate: counts.moderate,
      high: counts.high,
      averageScore: totalScore / total,
      lowPercentage: (counts.low / total) * 100,
      moderatePercentage: (counts.moderate / total) * 100,
      highPercentage: (counts.high / total) * 100
    };
  }
}
