import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './head/navbar';
import Footer from './head/footer';

export default function RootLayout() {
  const location = useLocation();
  const isChat = /^\/inbox\/[^/]+/.test(location.pathname);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      {!isChat && <Footer />}
    </div>
  );
}
