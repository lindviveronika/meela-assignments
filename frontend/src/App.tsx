import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { NotFound } from "./components/NotFound";
import { Onboarding } from "./components/Onboarding";
import { PageLayout } from "./components/PageLayout";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="onboarding/:id/:stepId?" element={<Onboarding />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
