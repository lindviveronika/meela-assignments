import { ONBOARDING_SUBMISSIONS_API } from "../constants";
import { useFetchData } from "../hooks/useFetchData";
import { submissionSummaryResponseSchema } from "../types";
import { SubmissionCard } from "./SubmissionCard";
import styles from "./SubmissionList.module.css";

export function SubmissionList() {
  const {
    data: submissions,
    error: loadSubmissionsError,
    isLoading,
  } = useFetchData(ONBOARDING_SUBMISSIONS_API, submissionSummaryResponseSchema);

  if (isLoading) return <div>Loading...</div>;

  if (loadSubmissionsError)
    return (
      <div>Something went wrong when loading the onboarding submissions</div>
    );

  if (submissions?.length === 0)
    return <div>No onboarding submissions found</div>;

  return (
    <ul className={styles.submissionContainer}>
      {submissions?.map((submission) => (
        <li className={styles.submission} key={submission.id}>
          <SubmissionCard submission={submission} />
        </li>
      ))}
    </ul>
  );
}
