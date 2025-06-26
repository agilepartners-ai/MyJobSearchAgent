import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Workflow from './components/Workflow';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyPhone from './components/auth/VerifyPhone';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import JobSearchPage from './components/pages/JobSearchPage';
import JobListingsPage from './components/pages/JobListingsPage';
import Dashboard from './components/dashboard/DashboardMain';
<<<<<<< darcy-tavus
import MockInterviewPage from './components/dashboard/MockInterviewPage';
import { useAuth } from './hooks/useAuth';
import { TavusProvider } from './contexts/TavusContext';
=======
import AIInterviewPage from './components/pages/AIInterviewPage';
import ErrorBoundary from './components/dashboard/ErrorBoundary';
>>>>>>> main

function App() {
  useEffect(() => {
    document.title = 'MyJobSearchAgent | AI-Powered Career Success Platform';
    
    // Remove forced dark mode - let system preference handle it
    // The CSS will automatically handle light/dark mode switching
  }, []);
  return (
<<<<<<< darcy-tavus
    <TavusProvider>      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mock_interview" element={<MockInterviewPage />} />
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-white dark:bg-gray-900">
=======
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/verify-phone" element={
            <PublicRoute>
              <VerifyPhone />
            </PublicRoute>
          } />
          <Route path="/job-search" element={
            <ProtectedRoute>
              <JobSearchPage />
            </ProtectedRoute>
          } />
          <Route path="/job-listings" element={
            <ProtectedRoute>
              <JobListingsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/ai-interview" element={
            <ProtectedRoute>
              <AIInterviewPage />
            </ProtectedRoute>
          } />
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-white dark:bg-gray-900 theme-transition">
>>>>>>> main
                <Header />
                <main>
                  <Hero />
                  <Services />
<<<<<<< darcy-tavus
=======
                  <Workflow />
>>>>>>> main
                  <Testimonials />
                  <Team />
                  <Contact />
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
<<<<<<< darcy-tavus
    </TavusProvider>
=======
    </ErrorBoundary>
>>>>>>> main
  );
}

export default App;
