import api from "@/services/api";

export type AnswerShape = "single_dict" | "rows_dict" | "list_of_dict";

export interface TrainingCase {
  case_id: string;
  category: string;
  source: string;
  original_id?: string;
  raw_text: string;
  answer_shape: AnswerShape;
  recommend_reason?: string;
}

export interface TrainingCategory {
  category: string;
  total_count: number;
  answered_count: number;
  remaining_count: number;
}

export interface AnswerUnit {
  unit_id: string;
  source_path?: string;
  fields: Record<string, string | number | boolean | null>;
}

export interface GoldAnswer {
  answer_shape: AnswerShape;
  gold_answer_original: unknown;
  gold_answer_units: AnswerUnit[];
}

export interface FieldResult {
  field: string;
  student_value: string | number | boolean | null;
  gold_value: string | number | boolean | null;
  score: number;
  is_correct: boolean;
  error_type?: string | null;
  message?: string;
}

export interface UnitResult {
  unit_id: string;
  field_results: FieldResult[];
}

export interface GradingResult {
  case_id?: string;
  total_score: number;
  summary?: {
    level: "excellent" | "good" | "partial" | "weak" | string;
    message: string;
    error_count: number;
    related_abilities: string[];
  };
  unit_results: UnitResult[];
  feedback: string[];
  suggestions: string[];
  student_answer_units: AnswerUnit[];
  gold_answer_units: AnswerUnit[];
}

export interface DiagnosisItem {
  field: string;
  diagnosis_type: string;
  ability?: string;
  message: string;
}

export interface DiagnosisResult {
  summary: string;
  diagnosis_items: DiagnosisItem[];
  weak_abilities: string[];
  suggestions: string[];
}

export interface TrainingProgress {
  total_cases: number;
  answered_count: number;
  correct_count: number;
  mistake_count: number;
  average_score: number;
  latest_score: number | null;
}

export interface MistakeRecord {
  record_id: string;
  case_id: string;
  case?: TrainingCase;
  student_answer_units: AnswerUnit[];
  grading_result: GradingResult;
  diagnosis_result?: DiagnosisResult;
  score: number;
  created_at: string;
}

export interface AbilityItem {
  ability: string;
  mastery: number;
  level: string;
  error_count: number;
}

export interface AbilityProfile {
  abilities: AbilityItem[];
  weakest_abilities: string[];
  recommended_cases: TrainingCase[];
}

export interface SubmitTrainingRequest {
  case_id: string;
  student_answer_units: AnswerUnit[];
}

export interface TrainingResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface CasesPayload {
  cases: TrainingCase[];
  total: number;
  returned: number;
  include_answered: boolean;
  category: string;
}

export interface CategoriesPayload {
  categories: TrainingCategory[];
  total_categories: number;
}

export interface CaseDetailPayload {
  case: TrainingCase;
  gold_answer: GoldAnswer;
}

export interface NextCasePayload {
  case: TrainingCase | null;
  gold_answer: GoldAnswer | null;
  remaining_count: number;
}

export interface MistakesPayload {
  records: MistakeRecord[];
}

export interface SubmitTrainingPayload {
  case: TrainingCase;
  grading_result: GradingResult;
  diagnosis_result: DiagnosisResult;
  record: MistakeRecord;
  progress: TrainingProgress;
  profile: AbilityProfile;
  recommended_cases: TrainingCase[];
}

const listCases = (params?: {
  category?: string;
  include_answered?: boolean;
  limit?: number;
  random_order?: boolean;
}) => api.get<TrainingResponse<CasesPayload>>("/training/cases", { params });

const listCategories = () => api.get<TrainingResponse<CategoriesPayload>>("/training/categories");

const getNextCase = (params?: { category?: string; current_case_id?: string }) =>
  api.get<TrainingResponse<NextCasePayload>>("/training/next", { params });

const getCase = (caseId: string) =>
  api.get<TrainingResponse<CaseDetailPayload>>(`/training/cases/${caseId}`);

const submit = (payload: SubmitTrainingRequest) =>
  api.post<TrainingResponse<SubmitTrainingPayload>>("/training/submit", payload);

const listMistakes = () => api.get<TrainingResponse<MistakesPayload>>("/training/mistakes");
const getProgress = () => api.get<TrainingResponse<TrainingProgress>>("/training/progress");
const getProfile = () => api.get<TrainingResponse<AbilityProfile>>("/training/profile");

export const trainingAPI = {
  listCases,
  listCategories,
  getNextCase,
  getCase,
  submit,
  listMistakes,
  getProgress,
  getProfile,
};
