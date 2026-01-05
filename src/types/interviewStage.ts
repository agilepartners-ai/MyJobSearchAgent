export enum InterviewStage {
  APPLICATION = 'application',
  OA = 'oa', // Online Assessment
  PHONE_SCREEN = 'phone_screen',
  TECHNICAL_INTERVIEW = 'technical_interview',
  BEHAVIORAL_INTERVIEW = 'behavioral_interview',
  FINAL_INTERVIEW = 'final_interview',
  OFFER = 'offer',
  REJECTION = 'rejection'
}

export interface InterviewStageData {
  stage: InterviewStage;
  status: 'pending' | 'scheduled' | 'completed' | 'passed' | 'failed' | 'cancelled';
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  interviewer?: string;
  nextSteps?: string[];
  result?: 'passed' | 'failed' | 'pending';
}

export interface InterviewFlow {
  applicationId: string;
  currentStage: InterviewStage;
  stages: InterviewStageData[];
  createdAt: string;
  updatedAt: string;
}

export const InterviewStageOrder: InterviewStage[] = [
  InterviewStage.APPLICATION,
  InterviewStage.OA,
  InterviewStage.PHONE_SCREEN,
  InterviewStage.TECHNICAL_INTERVIEW,
  InterviewStage.BEHAVIORAL_INTERVIEW,
  InterviewStage.FINAL_INTERVIEW,
  InterviewStage.OFFER,
  InterviewStage.REJECTION
];

export const InterviewStageLabels: Record<InterviewStage, string> = {
  [InterviewStage.APPLICATION]: 'Application Submitted',
  [InterviewStage.OA]: 'Online Assessment',
  [InterviewStage.PHONE_SCREEN]: 'Phone Screen',
  [InterviewStage.TECHNICAL_INTERVIEW]: 'Technical Interview',
  [InterviewStage.BEHAVIORAL_INTERVIEW]: 'Behavioral Interview',
  [InterviewStage.FINAL_INTERVIEW]: 'Final Interview',
  [InterviewStage.OFFER]: 'Offer Received',
  [InterviewStage.REJECTION]: 'Rejected'
};

export const InterviewStageNextSteps: Record<InterviewStage, string[]> = {
  [InterviewStage.APPLICATION]: [
    'Wait for application review',
    'Prepare for potential OA or phone screen',
    'Research the company and role'
  ],
  [InterviewStage.OA]: [
    'Complete the assessment within deadline',
    'Practice coding problems if technical',
    'Review company values and culture',
    'Prepare for next stage (phone screen)'
  ],
  [InterviewStage.PHONE_SCREEN]: [
    'Schedule phone screen if not done',
    'Prepare answers to common questions',
    'Research the interviewer on LinkedIn',
    'Prepare questions about the role'
  ],
  [InterviewStage.TECHNICAL_INTERVIEW]: [
    'Review technical concepts for the role',
    'Practice coding problems',
    'Prepare system design examples',
    'Review your past projects'
  ],
  [InterviewStage.BEHAVIORAL_INTERVIEW]: [
    'Prepare STAR method examples',
    'Review company culture and values',
    'Prepare questions about team dynamics',
    'Research the interviewer'
  ],
  [InterviewStage.FINAL_INTERVIEW]: [
    'Prepare final questions about the role',
    'Review all previous interview notes',
    'Prepare salary negotiation points',
    'Send thank you notes after interview'
  ],
  [InterviewStage.OFFER]: [
    'Review offer details carefully',
    'Negotiate salary and benefits if needed',
    'Accept or decline the offer',
    'Notify other companies if accepting'
  ],
  [InterviewStage.REJECTION]: [
    'Request feedback if possible',
    'Learn from the experience',
    'Continue applying to other positions',
    'Stay in touch with the recruiter'
  ]
};

