import { Route, Routes } from "react-router";
import Home from "./Home";
import NotFound from "./NotFound";
import Onboarding from "./Onboarding";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="onboarding/:id" element={<Onboarding />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
