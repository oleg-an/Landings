export enum ProjectType {
  REMODEL = 'Remodel / Walk-In Shower',
  REPAIR = 'Repair Existing Shower'
}

export enum RepairCategory {
  LEAK = 'Water Leak',
  CLOG = 'Clog / Slow Drain',
  TEMPERATURE = 'Temperature Issue',
  BROKEN_PART = 'Broken Part / Tile',
  INSTALLATION = 'Installation / Replacement',
  OTHER = 'Other'
}

export enum RemodelGoal {
  SAFETY = 'Safety / Accessibility',
  TUB_TO_SHOWER = 'Tub-to-Shower Conversion',
  DESIGN = 'Modern Design Update',
  VALUE = 'Increase Home Value'
}

export enum Urgency {
  EMERGENCY = 'Emergency (Now)',
  THIS_WEEK = 'Within this week',
  FLEXIBLE = 'Flexible / Planning'
}

export interface LeadFormData {
  projectType: ProjectType | null;
  remodelGoal: RemodelGoal | null;
  repairCategory: RepairCategory | null;
  urgency: Urgency | null;
  description: string;
  image: File | null;
  name: string;
  phone: string;
  address: string;
  zipCode: string;
}

export interface AiAnalysisResult {
  title: string;
  content: string;
  highlight: string;
}