import { z } from 'zod';

// ============================================================
// Zod Schemas for Case JSON Validation
// ============================================================

// Clarification step data
const clarificationOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  is_correct: z.boolean(),
  feedback: z.string(),
});

const clarificationDataSchema = z.object({
  options: z.array(clarificationOptionSchema).min(2),
  correct_explanation: z.string().optional(),
});

// Structure step data
const structureDataSchema = z.object({
  gold_standard_text: z.string(),
  gold_standard_image_desc: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  expected_keywords: z.array(z.string()).optional(),
});

// Calculation step data
const calculationStepSchema = z.object({
  description: z.string(),
  formula: z.string().optional(),
  result: z.string(),
});

const calculationDataSchema = z.object({
  expected_value: z.number().optional(),
  correct_value: z.number().optional(),
  unit: z.string(),
  tolerance_percent: z.number().min(0).max(100),
  steps: z.array(calculationStepSchema).optional(),
  hint: z.string().optional(),
  step_by_step_correction: z.string().optional(),
});

// Brainstorming step data
const brainstormingDataSchema = z.object({
  checklist_correct_items: z.array(z.string()).min(1),
  explanation: z.string(),
});

// Synthesis step data
const synthesisDataSchema = z.object({
  model_answer_text: z.string(),
  required_elements: z.array(z.string()).optional(),
});

// Base step fields that all steps share
const baseStepFields = {
  step_id: z.number().int().positive(),
  instruction: z.string().min(1),
  context: z.string().optional(),
  phase_name: z.string().optional(),
  intro_context: z.string().optional(),
};

// Case step schema with discriminated union based on type
const caseStepSchema = z.discriminatedUnion('type', [
  z.object({
    ...baseStepFields,
    type: z.literal('clarification'),
    interaction_data: clarificationDataSchema,
  }),
  z.object({
    ...baseStepFields,
    type: z.literal('structure'),
    interaction_data: structureDataSchema,
  }),
  z.object({
    ...baseStepFields,
    type: z.literal('calculation'),
    interaction_data: calculationDataSchema,
  }),
  z.object({
    ...baseStepFields,
    type: z.literal('brainstorming'),
    interaction_data: brainstormingDataSchema,
  }),
  z.object({
    ...baseStepFields,
    type: z.literal('synthesis'),
    interaction_data: synthesisDataSchema,
  }),
]);

// Case meta schema - flexible to support multiple formats
const caseMetaSchema = z.object({
  case_id: z.string().min(1),
  title: z.string().min(1),
  // Support both naming conventions
  company: z.string().optional(),
  firm_style: z.string().optional(),
  industry: z.string().optional(),
  topic: z.string().optional(),
  // Support multiple difficulty formats
  difficulty: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal('Beginner'),
    z.literal('Intermediate'),
    z.literal('Advanced'),
  ]),
  // Support both time field names
  estimated_minutes: z.number().positive().optional(),
  estimated_time_min: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
});

// Main case JSON schema
export const caseJsonSchema = z.object({
  meta: caseMetaSchema,
  steps: z.array(caseStepSchema).min(1),
});

// Type inference from schema
export type ValidatedCaseJson = z.infer<typeof caseJsonSchema>;
export type ValidatedCaseStep = z.infer<typeof caseStepSchema>;
export type ValidatedCaseMeta = z.infer<typeof caseMetaSchema>;

// ============================================================
// Validation Helper Functions
// ============================================================

export interface ValidationResult {
  success: boolean;
  data?: ValidatedCaseJson;
  error?: string;
  details?: z.ZodError;
}

export function validateCaseJson(json: unknown): ValidationResult {
  try {
    const result = caseJsonSchema.safeParse(json);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    // Format error messages
    const errorMessages = result.error.issues.map((err) => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    });

    return {
      success: false,
      error: `Validation failed:\n${errorMessages.join('\n')}`,
      details: result.error,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown validation error',
    };
  }
}

export function parseJsonFile(content: string): { success: boolean; data?: unknown; error?: string } {
  try {
    const data = JSON.parse(content);
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? `JSON parse error: ${e.message}` : 'Invalid JSON format',
    };
  }
}
