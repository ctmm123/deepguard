
export type Mood = "thinking" | "happy" | "serious" | "danger";

export enum AppStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  ASR = 'asr',
  DATA = 'data',
  CATEGORY = 'category',
  RISK = 'risk',
  FRAUD = 'fraud',
  STRATEGY = 'strategy',
  RESULT = 'result'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Message {
  id: string;
  sender: 'agent' | 'customer';
  text: string;
  timestamp: string;
}

export interface TranscriptLine {
  timestamp: string;
  role: "caller" | "callee";
  text: string;
}

export interface MultiDimensionData {
  platformDuration: number;
  enterpriseDuration: number;
  crossRegionCallRatio: number;
  callDiscreteness: string;
}

export interface CategoryResult {
  label: string;
  confidence: number;
  reasoning: string;
}

export interface RiskResult {
  level: RiskLevel;
  confidence: number;
  reasoning: string;
}

export interface FraudResult {
  probability: number;
  reasoning: string;
}

export interface StrategyResult {
  suggestion: string;
  confidence: number;
  reasoning: string;
}

export interface AnalysisResult {
  callId: string;
  transcript: TranscriptLine[];
  multiDimensionData: MultiDimensionData;
  category: CategoryResult;
  risk: RiskResult;
  fraud: FraudResult;
  strategy: StrategyResult;
}

export interface StepThought {
  phase: AppStatus;
  thought: string;
}

export interface InspectionResult {
  id: string;
  category: string;
  confidence: number;
  riskLevel: RiskLevel;
  strategy: string;
  summary: string;
}
