import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white px-6 py-4 flex flex-wrap justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">EduWithUs</h1>

        <div className="flex flex-wrap items-center space-x-4 mt-2 md:mt-0">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          
          <Link to="/courses" className="hover:text-yellow-300">Courses</Link>

          <Link to="/contact" className="hover:text-yellow-300">Contact</Link>
          <Link
            to="/auth-register"
            className="bg-yellow-400 text-blue-800 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300"
          >
            Register
          </Link>
        </div>
      </nav>

      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
