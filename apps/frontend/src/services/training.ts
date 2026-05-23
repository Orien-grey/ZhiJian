import api from "@/services/api";

export interface TrainingCase {
  case_id: string;
  raw_text: string;
  category: string;
  airport: string;
  object_type: string;
  object_id: string;
  start_time: string;
  end_time: string;
  status: string;
  restriction: string;
  operational_impact: string;
  evidence: string[];
  reasoning: string;
}

export interface TrainingSubmission {
  case_id: string;
  student_answer: Record<string, unknown>;
}

export interface TrainingResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export const trainingAPI = {
  listCases() {
    return api.get<TrainingResponse<TrainingCase[]>>("/training/cases");
  },
  getCase(caseId: string) {
    return api.get<TrainingResponse<TrainingCase>>(`/training/cases/${caseId}`);
  },
  getProfile() {
    return api.get<TrainingResponse>("/training/profile");
  },
  submit(payload: TrainingSubmission) {
    return api.post<TrainingResponse>("/training/submit", payload);
  },
};
