import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AcademicPage from "./pages/AcademicPage";
import PersonnelPage from "./pages/PersonnelPage";
import LibraryPage from "./pages/LibraryPage";
import FinancesPage from "./pages/FinancesPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="etudiants" element={<StudentsPage />} />
        <Route path="academique" element={<AcademicPage />} />
        <Route path="personnel" element={<PersonnelPage />} />
        <Route path="bibliotheque" element={<LibraryPage />} />
        <Route path="finances" element={<FinancesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="parametres" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
