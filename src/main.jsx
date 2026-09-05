import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import { AuthProvider } from './auth/AuthContext';
import { router } from './router';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  const app = (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
  // GoogleOAuth is optional — backend /auth/google-sync works without it,
  // but the <GoogleLogin> button needs the provider.
  if (googleClientId) {
    return (
      <StrictMode>
        <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
      </StrictMode>
    );
  }
  return <StrictMode>{app}</StrictMode>;
}

createRoot(document.getElementById('root')).render(<App />);
