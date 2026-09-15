import { Link } from "react-router";
import type { OnboardingStepId, SubmissionSummary } from "../types";
import { firstOnboardingStepId, onboardingSteps } from "./Onboarding/steps";

import styles from "./SubmissionCard.module.css";

const dateOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

function getStepLink(submissionId: string, stepId: OnboardingStepId | null) {
  const currentStep = stepId ?? firstOnboardingStepId;
  return `/onboarding/${submissionId}/${currentStep}`;
}

function getStatusText(
  status: SubmissionSummary["status"],
  currentStepNumber: number,
) {
  if (currentStepNumber === 0) {
    return "Not Started";
  }

  switch (status) {
    case "submitted":
      return "Submitted";
    case "draft":
      return "In Progress";
    default:
      return "Unknown";
  }
}

export function SubmissionCard({
  submission,
}: {
  submission: SubmissionSummary;
}) {
  const currentStepNumber =
    onboardingSteps.findIndex(
      (step) => step.stepId === submission.currentStep,
    ) + 1;
  const totalSteps = onboardingSteps.length;

  return (
    <Link
      className={styles.link}
      to={getStepLink(submission.id, submission.currentStep)}
    >
      <span className={styles.status}>
        {getStatusText(submission.status, currentStepNumber)}
      </span>
      <span className={styles.info}>{submission.id.split("-")[0]} </span>
      <span className={styles.info}>
        {new Date(submission.createdAt).toLocaleString(undefined, dateOptions)}
      </span>
      <span className={styles.info}>
        {currentStepNumber > 0
          ? `Step ${currentStepNumber} of ${totalSteps}`
          : null}
      </span>
    </Link>
  );
}
