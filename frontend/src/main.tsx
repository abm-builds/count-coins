import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as serviceWorkerRegistration from "./lib/serviceWorkerRegistration";
import { errorMonitoring, performanceMonitoring } from "./lib/errorMonitoring";

// Initialize error monitoring
errorMonitoring;

// Mark app start for performance monitoring
performanceMonitoring.mark("app-start");

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for offline support
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log("App is ready for offline use!");
  },
  onUpdate: () => {
    console.log("New version available! Please refresh.");
  },
});

// Log page load metrics
window.addEventListener("load", () => {
  performanceMonitoring.mark("app-loaded");
  const metrics = performanceMonitoring.getPageLoadMetrics();
  if (metrics) {
    console.log("Page load metrics:", metrics);
  }
});
