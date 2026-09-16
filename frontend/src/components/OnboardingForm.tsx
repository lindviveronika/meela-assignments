import { useState } from "react";
import { useNavigate } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../constants";
import { useSendData } from "../hooks/useSendData";
import {
  submissionDetailsSchema,
  type OnboardingAnswers,
  type OnboardingStep,
  type SubmissionDetails,
} from "../types";
import { Button } from "./Button";
import styles from "./OnboardingForm.module.css";
import { onboardingSteps } from "./steps";

interface OnboardingFormProps {
  submission: SubmissionDetails;
  id: string;
  onboardingStep: OnboardingStep;
}

export const QUESTION_ID = "step-question";

export function OnboardingForm({
  submission,
  id,
  onboardingStep,
}: OnboardingFormProps) {
  const navigate = useNavigate();
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>(
    submission.answers,
  );
  const [savedStatus, setSavedStatus] = useState<{
    savedAt: number;
    type: "success" | "error";
  } | null>(null);

  const { sendData, isLoading } = useSendData(
    `${ONBOARDING_SUBMISSIONS_API}/${id}`,
    submissionDetailsSchema,
  );

  const currentIndex = onboardingSteps.findIndex(
    (step) => step.stepId === onboardingStep.stepId,
  );
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === onboardingSteps.length - 1;

  const goToStep = (offset: number) => {
    const newIndex = currentIndex + offset;
    if (newIndex < 0 || newIndex >= onboardingSteps.length) {
      return;
    }

    const newStepId = onboardingSteps[newIndex].stepId;
    navigate(`/onboarding/${id}/${newStepId}`);
  };

  const handleNextClick = () => goToStep(1);
  const handlePreviousClick = () => goToStep(-1);
  const handleSaveProgress = async () => {
    const result = await sendData({
      method: "PATCH",
      body: JSON.stringify({
        currentStep: onboardingStep.stepId,
        answers: onboardingAnswers,
      }),
    });

    setSavedStatus({
      savedAt: Date.now(),
      type: result.error ? "error" : "success",
    });
  };

  const handleUpdate = <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K],
  ) => setOnboardingAnswers((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    // TODO: Implement form submission logic
    event.preventDefault();
    alert("submit form");
  };

  const OnboardingStep = onboardingStep.element;

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      style={
        {
          "--progress": `${(currentIndex + 1) / onboardingSteps.length}`,
        } as React.CSSProperties
      }
    >
      {savedStatus && (
        <p role="status" key={savedStatus.savedAt} className={styles.message}>
          {savedStatus.type === "success"
            ? "✓ Progress saved"
            : "✗ Error saving progress"}
        </p>
      )}
      <div className={styles.question}>
        <h2 id={QUESTION_ID}>{onboardingStep.question}</h2>
        <p className={styles.stepIndicator}>
          Step {currentIndex + 1} of {onboardingSteps.length}
        </p>
        <OnboardingStep answers={onboardingAnswers} setAnswer={handleUpdate} />
      </div>
      <div className={styles.formNavigation}>
        <Button
          variant="link"
          onClick={handlePreviousClick}
          disabled={isFirstQuestion}
        >
          ← Back
        </Button>
        <Button
          disabled={isLoading}
          variant="secondary"
          onClick={handleSaveProgress}
        >
          Save for later
        </Button>
        <Button
          onClick={handleNextClick}
          type={isLastQuestion ? "submit" : "button"}
        >
          {isLastQuestion ? "Submit" : "Next"}
        </Button>
      </div>
    </form>
  );
}
