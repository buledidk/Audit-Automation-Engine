import { RouterProvider } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import router from "./src/router";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { AuthProvider } from "./src/context/AuthContext";

function App() {
  return (
    <ErrorBoundary level="app">
      <AuthProvider>
        <RouterProvider router={router} />
        <SpeedInsights />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
