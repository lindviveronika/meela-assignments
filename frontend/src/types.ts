import type { JSX } from "react/jsx-runtime";

type SubmissionStatus = "draft" | "submitted";

export type OnboardingStepId = "patient-age" | "patient-gender";

export type OnboardingStep = {
  stepId: OnboardingStepId;
  label: string;
  element: JSX.Element;
};

export type SubmissionId = string;

export interface SubmissionSummary {
  id: SubmissionId;
  status: SubmissionStatus;
  createdAt: string;
  currentStep: OnboardingStepId | null;
}

export interface SubmissionDetails {
  id: SubmissionId;
  status: SubmissionStatus;
  createdAt: string;
  answers: Record<string, unknown>;
  currentStep: OnboardingStepId | null;
}

export interface CreateOnboardingSubmissionResponse {
  id: SubmissionId;
}

export type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };
