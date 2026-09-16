import type { JSX } from "react/jsx-runtime";
import z from "zod";

export const ageRangeSchema = z.enum([
  "18-25",
  "26-35",
  "36-45",
  "46-55",
  "56-65",
  "65+",
]);

export const genderSchema = z.enum(["male", "female", "non-binary"]);

export const minorityCompetenceSchema = z.enum([
  "lgbtq+",
  "minority-stress",
  "neurodivergent",
  "polyamorous-relationships",
  "rbts",
  "transgender-knowledge",
]);

export const onboardingAnswerSchema = z.object({
  "patient-age": ageRangeSchema.optional(),
  "patient-gender": genderSchema.optional(),
  "therapist-minority-competence": z.array(minorityCompetenceSchema).optional(),
});

const onboardingStepIdSchema = onboardingAnswerSchema.keyof();

const submissionStatusSchema = z.enum(["draft", "submitted"]);

const submissionSummarySchema = z.object({
  id: z.string(),
  status: submissionStatusSchema,
  createdAt: z.string(),
  currentStep: onboardingStepIdSchema.nullable(),
});

export const submissionDetailsSchema = z.object({
  id: z.string(),
  status: submissionStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  answers: onboardingAnswerSchema,
  currentStep: onboardingStepIdSchema.nullable(),
});

export const submissionSummaryResponseSchema = z.array(submissionSummarySchema);

export const createSubmissionResponseSchema = z.object({ id: z.string() });

export type MinorityCompetence = z.infer<typeof minorityCompetenceSchema>;
export type SubmissionDetails = z.infer<typeof submissionDetailsSchema>;
export type SubmissionSummary = z.infer<typeof submissionSummarySchema>;
export type OnboardingAnswers = z.infer<typeof onboardingAnswerSchema>;
type OnboardingStepId = z.infer<typeof onboardingStepIdSchema>;

export type StepProps = {
  answers: OnboardingAnswers;
  setAnswer: <K extends OnboardingStepId>(
    key: K,
    value: OnboardingAnswers[K],
  ) => void;
};

export type OnboardingStep = {
  stepId: OnboardingStepId;
  question: string;
  element: (props: StepProps) => JSX.Element;
};

export type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };
