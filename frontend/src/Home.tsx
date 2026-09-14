import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./Home.module.css";

interface SubmissionSummary {
  id: string;
  status: "draft" | "submitted";
  createdAt: string;
}

function Home() {
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);

  const fetchSubmissions = useCallback(async () => {
    const response = await fetch("/api/onboarding-submissions");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch onboarding submissions: ${response.statusText}`,
      );
    }
    const data = await response.json();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    const loadInitialSubmissions = async () => {
      await fetchSubmissions();
    };
    loadInitialSubmissions();
  }, [fetchSubmissions]);

  async function handleCreateOnboardingSubmission() {
    const response = await fetch("/api/onboarding-submissions", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create onboarding submission: ${response.statusText}`,
      );
    }

    await fetchSubmissions();
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
        {submissions.map((submission) => (
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
