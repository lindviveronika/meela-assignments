import type { JSX } from "react/jsx-runtime";
import z from "zod";

export const onboardingAnswerSchema = z.object({
  "patient-age": z
    .enum(["18-25", "26-35", "36-45", "46-55", "56-65", "65+"])
    .optional(),
  "patient-gender": z.enum(["male", "female", "non-binary"]).optional(),
  "therapist-minority-competence": z
    .enum([
      "lgbtq+",
      "minority-stress",
      "neurodivergent",
      "polyamorous-relationships",
      "rbts",
      "transgender-knowledge",
    ])
    .optional(),
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

export type OnboardingStepId = z.infer<typeof onboardingStepIdSchema>;

export type OnboardingAnswers = z.infer<typeof onboardingAnswerSchema>;

export type StepProps = {
  answers: OnboardingAnswers;
  setAnswer: <K extends OnboardingStepId>(
    key: K,
    value: OnboardingAnswers[K],
  ) => void;
};

export type OnboardingStep = {
  stepId: OnboardingStepId;
  label: string;
  element: (props: StepProps) => JSX.Element;
};

export type SubmissionDetails = z.infer<typeof submissionDetailsSchema>;

export type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };
