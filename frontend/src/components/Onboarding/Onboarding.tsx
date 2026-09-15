import { Navigate, useNavigate, useParams } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../../constants";
import { useFetchData } from "../../hooks/useFetchData";
import type { SubmissionDetails } from "../../types";
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

  return (
    <div>
      {onboardingStep.element}
      <button onClick={handlePreviousClick} disabled={isFirstQuestion}>
        Back
      </button>
      <button onClick={handleNextClick} disabled={isLastQuestion}>
        Next
      </button>
    </div>
  );
}

export default Onboarding;
