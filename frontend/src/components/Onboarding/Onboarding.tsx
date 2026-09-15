import { Link, Navigate, useNavigate, useParams } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../../constants";
import { useFetchData } from "../../hooks/useFetchData";
import { useSendData } from "../../hooks/useSendData";
import type { SubmissionDetails } from "../../types";
import styles from "./Onboarding.module.css";
import {
  firstOnboardingStepId,
  getOnboardingStepById,
  onboardingSteps,
} from "./steps";

function Onboarding() {
  const { id, stepId } = useParams();
  const navigate = useNavigate();

  const { isLoading, error } = useFetchData<SubmissionDetails>(
    `${ONBOARDING_SUBMISSIONS_API}/${id}`,
  );

  const { sendData } = useSendData<SubmissionDetails>(
    `${ONBOARDING_SUBMISSIONS_API}/${id}`,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
    sendData({
      method: "PATCH",
      body: JSON.stringify({ currentStep: stepId, answers: {} }), // TODO: Replace empty answers with actual answers from the form
    });
  };

  return (
    <div className={styles.container}>
      <Link to="/">Home</Link>
      <button onClick={handleSaveProgress}>Save and continue later</button>
      {onboardingStep.element}
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

export default Onboarding;
