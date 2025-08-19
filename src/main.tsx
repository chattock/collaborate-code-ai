import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "./contexts/LanguageContext";
import { AdminProvider } from "./contexts/AdminContext";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AdminProvider>
      <App />
    </AdminProvider>
  </LanguageProvider>
);
