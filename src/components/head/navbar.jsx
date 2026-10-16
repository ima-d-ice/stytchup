import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, Search, ShoppingBag, Send } from 'lucide-react';
import UserMenu from './usermenu';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-yellow-500">
              StytchUp
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <Link to="/designs" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Designs
            </Link>
            <Link to="/designer" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Designer
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-yellow-500">
              <Search className="h-6 w-6" />
            </button>
            <div className="text-gray-600 hover:text-yellow-500">
              <UserMenu />
            </div>
            <button className="text-gray-600 hover:text-yellow-500">
              <Link to="/orders">
                <ShoppingBag className="h-6 w-6" />
              </Link>
            </button>
            <button className="text-gray-600 hover:text-yellow-500">
              <Link to="/inbox">
                <Send className="h-6 w-6" />
              </Link>
            </button>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <span className="text-gray-600 text-xl">✕</span> : <Menu className="h-6 w-6 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <Link to="/" className="text-gray-600 hover:text-yellow-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/designs" className="text-gray-600 hover:text-yellow-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Designs
            </Link>
            <Link to="/designer" className="text-gray-600 hover:text-yellow-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Designer
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
