import { RouterProvider } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import router from "./src/router";
import ErrorBoundary from "./src/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary level="app">
      <RouterProvider router={router} />
      <SpeedInsights />
    </ErrorBoundary>
  );
}

export default App;
