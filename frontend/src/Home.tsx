import { Link } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "./constants";
import styles from "./Home.module.css";
import { useFetchData } from "./hooks/useFetchData";
import { fetchData } from "./utils/fetchData";

interface SubmissionSummary {
  id: string;
  status: "draft" | "submitted";
  createdAt: string;
}

function Home() {
  const {
    data: submissions,
    error,
    isLoading,
  } = useFetchData<SubmissionSummary[]>(ONBOARDING_SUBMISSIONS_API);

  async function handleCreateOnboardingSubmission() {
    await fetchData(ONBOARDING_SUBMISSIONS_API, {
      method: "POST",
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleCreateOnboardingSubmission}
      >
        Create new onboarding submission
      </button>
      <ul className={styles.submissionContainer}>
        {submissions?.map((submission) => (
          <li className={styles.submission} key={submission.id}>
            <Link className={styles.link} to={`/onboarding/${submission.id}`}>
              <span className={styles.status}>{submission.status}</span>
              <span className={styles.id}>{submission.id} </span>
              <span className={styles.createdAt}>
                {new Date(submission.createdAt).toLocaleString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
