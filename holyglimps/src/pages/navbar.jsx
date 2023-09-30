import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-cyan-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold">
          HolyGlimps
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-current hover:text-cyan-50">Home</Link>

          <div className="group inline-block text-current hover:text-cyan-50 relative">
            <button> Account </button>
            <ul className="absolute hidden group-hover:block bg-slate-100 text-gray-800 rounded-lg">
              <li><Link to="/login" className="block px-4 py-2 hover:bg-gray-200">Login</Link></li>
              <li><Link to="/signup" className="block px-4 py-2 hover:bg-gray-200">Signup</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
