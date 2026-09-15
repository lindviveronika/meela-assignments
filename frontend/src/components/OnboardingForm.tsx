import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../constants";
import { useSendData } from "../hooks/useSendData";
import {
  submissionDetailsSchema,
  type OnboardingAnswers,
  type SubmissionDetails,
} from "../types";
import { Button } from "./Button";
import styles from "./OnboardingForm.module.css";
import {
  firstOnboardingStepId,
  getOnboardingStepById,
  onboardingSteps,
} from "./steps";

function OnboardingForm({ data }: { data: SubmissionDetails }) {
  const { id, stepId } = useParams();
  const navigate = useNavigate();
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>(
    data.answers,
  );

  const { sendData } = useSendData(
    `${ONBOARDING_SUBMISSIONS_API}/${id}`,
    submissionDetailsSchema,
  );

  const onboardingStep = getOnboardingStepById(stepId);
  if (!onboardingStep) {
    return (
      <Navigate to={`/onboarding/${id}/${firstOnboardingStepId}`} replace />
    );
  }

  const currentIndex = onboardingSteps.findIndex(
    (step) => step.stepId === stepId,
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
  const handleSaveProgress = () => {
    // TODO: Handle errors and loading state and show an indication of that it has been saved
    sendData({
      method: "PATCH",
      body: JSON.stringify({ currentStep: stepId, answers: onboardingAnswers }),
    });
  };

  const handleUpdate = <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K],
  ) => setOnboardingAnswers((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    // TODO: Implement form submission logic
    event.preventDefault();
    console.log("submit form");
  };

  const OnboardingStep = onboardingStep.element;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.question}>
        <h2>{onboardingStep.question}</h2>
        <OnboardingStep answers={onboardingAnswers} setAnswer={handleUpdate} />
      </div>
      <div className={styles.formNavigation}>
        <Button
          variant="secondary"
          onClick={handlePreviousClick}
          disabled={isFirstQuestion}
        >
          Back
        </Button>
        <Button variant="secondary" onClick={handleSaveProgress}>
          Save and continue later
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

export default OnboardingForm;
