
/**
 * StressService Class
 * Handles the business logic for calculating and classifying stress levels.
 * Separates core logic from the route handlers.
 */
export class StressService {
  public static questions = [
    { id: 'q1', text: 'How would you rate your sleep quality over the last week?', category: 'Sleep' },
    { id: 'q2', text: 'How often have you felt overwhelmed by your workload?', category: 'Workload' },
    { id: 'q3', text: 'How would you rate your general mood lately?', category: 'Mood' },
    { id: 'q4', text: 'Have you experienced physical tension (e.g., headaches, tight shoulders)?', category: 'Physical' },
    { id: 'q5', text: 'How easy has it been for you to focus on tasks?', category: 'Focus' },
    { id: 'q6', text: 'How supported do you feel by your social circle?', category: 'Social' },
    { id: 'q7', text: 'Do you feel fatigued after using digital devices/screens?', category: 'Digital' },
    { id: 'q8', text: 'How often do you feel you have "no time for yourself"?', category: 'Personal' },
  ];

  /**
   * Calculate stress score and classification based on user inputs
   */
  public static calculateStress(responses: { questionId: string; value: number }[]) {
    // Simple scoring: sum of values (assuming 1-5 scale)
    // Some questions might be inverted (e.g., Sleep quality 5 is good, so we use 6-5=1 for stress)
    const invertedQuestions = ['q1', 'q3', 'q5', 'q6'];
    
    let totalScore = 0;
    responses.forEach(r => {
      if (invertedQuestions.includes(r.questionId)) {
        totalScore += (6 - r.value);
      } else {
        totalScore += r.value;
      }
    });

    // Max score is 8 * 5 = 40. Min is 8 * 1 = 8.
    let classification: 'Low' | 'Moderate' | 'High';
    if (totalScore <= 16) {
      classification = 'Low';
    } else if (totalScore <= 28) {
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
    const highWorkload = responses.find(r => r.questionId === 'q2' && r.value >= 4);
    const lowSleep = responses.find(r => r.questionId === 'q1' && r.value <= 2);
    
    let detail = "";
    if (highWorkload && lowSleep) detail = " due to high workload and low sleep quality";
    else if (highWorkload) detail = " primarily due to workload pressure";
    else if (lowSleep) detail = " influenced by poor sleep quality";

    switch (classification) {
      case 'Low':
        return `Your current indicators suggest a healthy balance${detail}. Keep maintaining your healthy routines!`;
      case 'Moderate':
        return `You are reporting elevated stress markers${detail}. Consider taking a short break or engaging in a social activity.`;
      case 'High':
        return `Significant stress levels detected${detail}. We strongly recommend reaching out to your programme coordinator or a health professional.`;
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
