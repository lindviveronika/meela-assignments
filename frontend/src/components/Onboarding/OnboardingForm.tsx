import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../../constants";
import { useSendData } from "../../hooks/useSendData";
import {
  submissionDetailsSchema,
  type OnboardingAnswers,
  type SubmissionDetails,
} from "../../types";
import styles from "./Onboarding.module.css";
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

  const OnboardingStep = onboardingStep.element;

  return (
    <div className={styles.container}>
      <Link to="/">Home</Link>
      <button onClick={handleSaveProgress}>Save and continue later</button>
      <OnboardingStep answers={onboardingAnswers} setAnswer={handleUpdate} />
      <div>
        <button onClick={handlePreviousClick} disabled={isFirstQuestion}>
          Back
        </button>
        <button onClick={handleNextClick} disabled={isLastQuestion}>
          Next
        </button>
      </div>
    </div>
  );
}

export default OnboardingForm;
