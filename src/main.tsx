import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "./contexts/LanguageContext";
import { AdminProvider } from "./contexts/AdminContext";
import { AdminDataProvider } from "./contexts/AdminDataContext";
import { ProjectProvider } from "./contexts/ProjectContext";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AdminProvider>
      <AdminDataProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </AdminDataProvider>
    </AdminProvider>
  </LanguageProvider>
);
