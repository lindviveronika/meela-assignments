import { Route, Routes } from "react-router";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Onboarding from "./components/Onboarding";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="onboarding/:id/:stepId?" element={<Onboarding />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
