// ============================================================
// Case Module Types (StratOS Runtime)
// ============================================================

// Mode de travail
export type CaseMode = 'on_paper' | 'on_screen';

// Types de step
export type StepType = 'clarification' | 'structure' | 'calculation' | 'brainstorming' | 'synthesis';

// Auto-évaluation
export type SelfRating = 'bad' | 'moyen' | 'bien' | 'tres_bien';

// ============================================================
// Case JSON Schema (Import)
// ============================================================

export interface CaseMeta {
  case_id: string;
  title: string;
  // Support both formats
  company?: string;
  firm_style?: string;
  industry?: string;
  topic?: string;
  difficulty: 1 | 2 | 3 | 'Intermediate' | 'Advanced' | 'Beginner';
  estimated_minutes?: number;
  estimated_time_min?: number;
  tags?: string[];
}

export interface CaseJson {
  meta: CaseMeta;
  steps: CaseStep[];
}

export interface CaseStep {
  step_id: number;
  type: StepType;
  phase_name?: string;
  intro_context?: string;
  instruction: string;
  context?: string;
  interaction_data: InteractionData;
}

// ============================================================
// Interaction Data Types (per step type)
// ============================================================

export type InteractionData =
  | ClarificationData
  | StructureData
  | CalculationData
  | BrainstormingData
  | SynthesisData;

export interface ClarificationOption {
  id?: string;
  text: string;
  is_correct: boolean;
  feedback: string;
}

export interface ClarificationData {
  options: ClarificationOption[];
  correct_explanation?: string;
}

export interface StructureData {
  gold_standard_text: string;
  gold_standard_image_desc?: string;
  keywords?: string[];
  expected_keywords?: string[];
}

export interface CalculationStepData {
  description: string;
  formula?: string;
  result: string;
}

export interface CalculationData {
  expected_value?: number;
  correct_value?: number;
  unit: string;
  tolerance_percent: number;
  steps?: CalculationStepData[];
  hint?: string;
  step_by_step_correction?: string;
}

export interface BrainstormingData {
  checklist_correct_items: string[];
  explanation: string;
}

export interface SynthesisData {
  model_answer_text: string;
  required_elements?: string[];
}

// ============================================================
// User Attempt (stored locally)
// ============================================================

export interface UserAttempt {
  id: string;
  case_id: string;
  step_id: number;
  timestamp: Date;
  mode: CaseMode;
  user_answer: unknown;
  revealed_correction: boolean;
  self_rating: SelfRating | null;
  memo?: string;
}

// ============================================================
// Case Flashcard
// ============================================================

export interface CaseFlashcard {
  id: string;
  deck_id: 'deck_revision_cas';
  case_id: string;
  step_id: number;
  step_type: StepType;
  front: string;
  back: string;
  info_note: string;
  return_to_case_ref: {
    route: string;
    deeplink: string;
  };
  created_at: Date;
  updated_at: Date;
}

// ============================================================
// Type Guards
// ============================================================

export function isClarificationData(data: InteractionData): data is ClarificationData {
  return 'options' in data && Array.isArray((data as ClarificationData).options);
}

export function isStructureData(data: InteractionData): data is StructureData {
  return 'gold_standard_text' in data;
}

export function isCalculationData(data: InteractionData): data is CalculationData {
  return ('expected_value' in data || 'correct_value' in data) && 'tolerance_percent' in data;
}

export function isBrainstormingData(data: InteractionData): data is BrainstormingData {
  return 'checklist_correct_items' in data;
}

export function isSynthesisData(data: InteractionData): data is SynthesisData {
  return 'model_answer_text' in data;
}

// ============================================================
// Helper Functions
// ============================================================

export function createFlashcardFromStep(
  caseData: CaseJson,
  step: CaseStep,
  attempt: UserAttempt
): CaseFlashcard {
  const front = `[${caseData.meta.title}] Étape ${step.step_id}: ${step.instruction.slice(0, 100)}${step.instruction.length > 100 ? '...' : ''}`;

  let back = '';
  const data = step.interaction_data;

  if (isClarificationData(data)) {
    const correct = data.options.find((o) => o.is_correct);
    back = `${correct?.text || ''}${data.correct_explanation ? '\n\n' + data.correct_explanation : ''}`;
  } else if (isStructureData(data)) {
    back = data.gold_standard_text;
  } else if (isCalculationData(data)) {
    if (data.steps && data.steps.length > 0) {
      back = data.steps.map((s) => `${s.description}: ${s.result}`).join('\n');
    } else if (data.step_by_step_correction) {
      back = data.step_by_step_correction;
    } else {
      const value = data.expected_value ?? data.correct_value;
      back = `${value} ${data.unit}`;
    }
  } else if (isBrainstormingData(data)) {
    back = '• ' + data.checklist_correct_items.join('\n• ');
  } else if (isSynthesisData(data)) {
    back = data.model_answer_text;
  }

  return {
    id: `fc_${caseData.meta.case_id}_${step.step_id}_${Date.now()}`,
    deck_id: 'deck_revision_cas',
    case_id: caseData.meta.case_id,
    step_id: step.step_id,
    step_type: step.type,
    front,
    back,
    info_note: attempt.memo || (typeof attempt.user_answer === 'string' ? attempt.user_answer : JSON.stringify(attempt.user_answer)),
    return_to_case_ref: {
      route: `/case?id=${caseData.meta.case_id}&step=${step.step_id}`,
      deeplink: `stratos://case/${caseData.meta.case_id}/step/${step.step_id}`,
    },
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export function getSelfRatingLabel(rating: SelfRating): string {
  const labels: Record<SelfRating, string> = {
    bad: 'Pas du tout',
    moyen: 'Moyen',
    bien: 'Bien',
    tres_bien: 'Très bien',
  };
  return labels[rating];
}

export function getSelfRatingColor(rating: SelfRating): string {
  const colors: Record<SelfRating, string> = {
    bad: 'bg-red-500 hover:bg-red-600',
    moyen: 'bg-orange-500 hover:bg-orange-600',
    bien: 'bg-green-500 hover:bg-green-600',
    tres_bien: 'bg-emerald-500 hover:bg-emerald-600',
  };
  return colors[rating];
}
