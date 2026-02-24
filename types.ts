
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  COORDINATOR = 'COORDINATOR',
  MEMBER = 'MEMBER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organisationId: string;
}

export interface Organisation {
  id: string;
  name: string;
  code: string;
}

export interface Programme {
  id: string;
  title: string;
  description: string;
  organisationId: string;
  coordinatorId: string;
  startDate: string;
  location?: string;
  category?: string;
  participants: string[]; // User IDs
}

export interface StressQuestion {
  id: string;
  text: string;
  category: string;
}

export interface StressRecord {
  id: string;
  userId: string;
  organisationId: string;
  responses: { questionId: string; value: number }[];
  score: number;
  classification: 'Low' | 'Moderate' | 'High';
  explanation: string;
  timestamp: string;
  consentGiven: boolean;
}

export interface StressResult {
  score: number;
  classification: 'Low' | 'Moderate' | 'High';
  explanation: string;
  recommendations: string[];
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  organisation: Organisation | null;
  isAuthenticated: boolean;
}
