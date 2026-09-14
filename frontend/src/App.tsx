import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/hello/veronika");

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);
    }

    fetchData();
  }, []);

  return <>{JSON.stringify(data)}</>;
}

export default App;
