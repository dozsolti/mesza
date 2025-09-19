import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardPage from "./pages/home/dashboard";
import AddHabitPage from "./pages/add-habit/add-habit";
import { useUserStore } from "./store/useUser";
import SignUpPage from "./pages/sign-up/sign-up";
import SettingsPage from "./pages/settings/settings";
import NotFoundPage from "./pages/errors/not-found";
import ViewHabitPage from "./pages/view-habit/view-habit";
import ErrorWrapper from "./components/error-wrapper";
import EditHabitPage from "./pages/edit-habit/edit-habit";

function App() {
  const { user } = useUserStore();

  return (
    <ErrorWrapper>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme-mode">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {user.name ? (
              <>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/add" element={<AddHabitPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/habit/:id" element={<ViewHabitPage />} />
                <Route path="/habit/:id/edit" element={<EditHabitPage />} />
              </>
            ) : (
              <Route path="/" element={<SignUpPage />} />
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorWrapper>
  );
}

export default App;
