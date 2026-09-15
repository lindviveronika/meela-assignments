import { Link, useNavigate } from "react-router";
import { firstOnboardingStepId } from "./components/Onboarding/steps";
import { ONBOARDING_SUBMISSIONS_API } from "./constants";
import styles from "./Home.module.css";
import { useFetchData } from "./hooks/useFetchData";
import { useSendData } from "./hooks/useSendData";
import {
  createSubmissionResponseSchema,
  submissionSummaryResponseSchema,
  type OnboardingStepId,
} from "./types";

function getStepLink(submissionId: string, stepId: OnboardingStepId | null) {
  const currentStep = stepId ?? firstOnboardingStepId;
  return `/onboarding/${submissionId}/${currentStep}`;
}

function Home() {
  const navigate = useNavigate();

  const {
    data: submissions,
    error: loadSubmissionsError,
    isLoading,
  } = useFetchData(ONBOARDING_SUBMISSIONS_API, submissionSummaryResponseSchema);

  const {
    sendData,
    error: createSubmissionError,
    isLoading: isCreatingSubmission,
  } = useSendData(ONBOARDING_SUBMISSIONS_API, createSubmissionResponseSchema);

  async function handleCreateOnboardingSubmission() {
    const result = await sendData({
      method: "POST",
    });

    if (result.error) {
      return;
    }

    navigate(`/onboarding/${result.data.id}/${firstOnboardingStepId}`);
  }

  function renderSubmissionList() {
    if (isLoading) return <div>Loading...</div>;

    if (loadSubmissionsError)
      return (
        <div>Something went wrong when loading the onboarding submissions</div>
      );

    return (
      <ul className={styles.submissionContainer}>
        {submissions?.map((submission) => (
          <li className={styles.submission} key={submission.id}>
            <Link
              className={styles.link}
              to={getStepLink(submission.id, submission.currentStep)}
            >
              <span className={styles.status}>{submission.status}</span>
              <span className={styles.id}>{submission.id} </span>
              <span className={styles.createdAt}>
                {new Date(submission.createdAt).toLocaleString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleCreateOnboardingSubmission}
        disabled={isCreatingSubmission}
      >
        Create new onboarding submission
      </button>
      {createSubmissionError && (
        <div>
          Something went wrong when creating a new onboarding submission
        </div>
      )}
      {renderSubmissionList()}
    </div>
  );
}

export default Home;
