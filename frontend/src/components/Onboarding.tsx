import { Navigate, useParams } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../constants";
import { useFetchData } from "../hooks/useFetchData";
import type { SubmissionDetails } from "../types";
import { submissionDetailsSchema } from "../types";
import NotFound from "./NotFound";
import OnboardingForm from "./OnboardingForm";
import { firstOnboardingStepId, getOnboardingStepById } from "./steps";

function Onboarding() {
  const { id, stepId } = useParams();

  const { isLoading, error, data } = useFetchData<SubmissionDetails>(
    `${ONBOARDING_SUBMISSIONS_API}/${id}`,
    submissionDetailsSchema,
  );

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>Something went wrong when loading the onboarding submission</div>
    );
  if (!data) return <NotFound />;

  const onboardingStep = getOnboardingStepById(stepId);
  if (!onboardingStep) {
    return (
      <Navigate to={`/onboarding/${id}/${firstOnboardingStepId}`} replace />
    );
  }

  return <OnboardingForm data={data} />;
}

export default Onboarding;
