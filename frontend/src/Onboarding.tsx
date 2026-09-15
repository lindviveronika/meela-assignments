import { useParams } from "react-router";
import { ONBOARDING_SUBMISSIONS_API } from "./constants";
import { useFetchData } from "./hooks/useFetchData";

function Onboarding() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchData(
    `${ONBOARDING_SUBMISSIONS_API}/${id}`,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("got data", data);
  return <div>Display onboarding form here</div>;
}

export default Onboarding;
