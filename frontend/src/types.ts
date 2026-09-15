type SubmissionStatus = "draft" | "submitted";

export type SubmissionId = string;

export interface SubmissionSummary {
  id: SubmissionId;
  status: SubmissionStatus;
  createdAt: string;
}

export interface SubmissionDetails {
  id: SubmissionId;
  status: SubmissionStatus;
  createdAt: string;
  answers: Record<string, unknown>;
  currentStep: string | null;
}

export interface CreateOnboardingSubmissionResponse {
  id: SubmissionId;
}

export type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };
