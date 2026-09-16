import { Navigate, useParams } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../constants";
import { useFetchData } from "../hooks/useFetchData";
import type { SubmissionDetails } from "../types";
import { submissionDetailsSchema } from "../types";
import { NotFound } from "./NotFound";
import styles from "./Onboarding.module.css";
import { OnboardingForm } from "./OnboardingForm";
import { firstOnboardingStepId, getOnboardingStepById } from "./steps";

export function Onboarding() {
  const { id, stepId } = useParams();

  const { isLoading, error, data } = useFetchData<SubmissionDetails>(
    `${ONBOARDING_SUBMISSIONS_API}/${id}`,
    submissionDetailsSchema,
  );

  if (isLoading) return <div className={styles.message}>Loading...</div>;
  if (error)
    return (
      <div className={styles.message}>
        Something went wrong when loading the onboarding submission
      </div>
    );
  if (!data || !id) return <NotFound />;

  const onboardingStep = getOnboardingStepById(stepId);

  if (!onboardingStep) {
    const stepFromApi = getOnboardingStepById(data.currentStep ?? undefined);
    const resumeStep = stepFromApi?.stepId ?? firstOnboardingStepId;
    return <Navigate to={`/onboarding/${id}/${resumeStep}`} replace />;
  }

  return (
    <OnboardingForm submission={data} id={id} onboardingStep={onboardingStep} />
  );
}
