import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-yellow-500">StytchUp</h3>
            <p className="mt-2 text-gray-400">
              Your marketplace for custom textiles and designs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/designs" className="hover:text-yellow-500">
                  Designs
                </Link>
              </li>
              <li>
                <Link href="/designer" className="hover:text-yellow-500">
                  For Designers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/faq" className="hover:text-yellow-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-500">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-yellow-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500">
                <Twitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} StytchUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;