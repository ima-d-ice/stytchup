import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import { RequireAuth, RequireAdmin } from './components/RequireAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Designs from './pages/Designs';
import DesignDetail from './pages/DesignDetail';
import Designers from './pages/Designers';
import DesignerDetail from './pages/DesignerDetail';
import NotFound from './pages/NotFound';

// Guarded pages (dynamic imports not needed for resume-scale bundle)
import Dashboard from './pages/Dashboard';
import AddDesign from './pages/AddDesign';
import Orders from './pages/Orders';
import SubmitRequirements from './pages/SubmitRequirements';
import Inbox from './pages/Inbox';
import Chat from './pages/Chat';
import AccountSettings from './pages/AccountSettings';
import Admin from './pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'designs', element: <Designs /> },
      { path: 'designs/:id', element: <DesignDetail /> },
      { path: 'designer', element: <Designers /> },
      { path: 'designer/:id', element: <DesignerDetail /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'designs/add', element: <AddDesign /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:id/submit-requirements', element: <SubmitRequirements /> },
          { path: 'inbox', element: <Inbox /> },
          { path: 'inbox/:id', element: <Chat /> },
          { path: 'account-settings', element: <AccountSettings /> },
        ],
      },
      {
        element: <RequireAdmin />,
        children: [{ path: 'admin', element: <Admin /> }],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
