import { BrowserRouter, Route, Routes } from 'react-router';

import { ThemeProvider } from '@/components/theme-provider';

import AnimationLayout from './components/animated-layout';
import ErrorWrapper from './components/error-wrapper';
import AddHabitPage from './pages/add-habit/add-habit';
import EditHabitPage from './pages/edit-habit/edit-habit';
import NotFoundPage from './pages/errors/not-found';
import DashboardPage from './pages/home/dashboard';
import SettingsPage from './pages/settings/settings';
import SignUpPage from './pages/sign-up/sign-up';
import ViewHabitPage from './pages/view-habit/view-habit';
import { useUserStore } from './stores/use-user-store';

function App() {
  const { user } = useUserStore();

  return (
    <ErrorWrapper>
      <ThemeProvider
        defaultTheme={{ mode: "system", name: "default" }}
        storageKey="ui-theme-mode"
      >
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {user.name ? (
              <Route element={<AnimationLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/add" element={<AddHabitPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/habit/:id" element={<ViewHabitPage />} />
                <Route path="/habit/:id/edit" element={<EditHabitPage />} />
              </Route>
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
