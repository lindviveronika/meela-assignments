import { useNavigate } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "../constants";
import { useSendData } from "../hooks/useSendData";
import { createSubmissionResponseSchema } from "../types";
import { Button } from "./Button";
import styles from "./Home.module.css";
import { SubmissionList } from "./SubmissionList";
import { firstOnboardingStepId } from "./steps";

export function Home() {
  const navigate = useNavigate();

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Onboardings</h2>
        <Button
          onClick={handleCreateOnboardingSubmission}
          disabled={isCreatingSubmission}
        >
          + New
        </Button>
      </header>

      {createSubmissionError && (
        <div>
          Something went wrong when creating a new onboarding submission
        </div>
      )}
      <SubmissionList />
    </div>
  );
}
