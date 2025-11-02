import React, { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login as:", role);
    } else {
      console.log("Register as:", role);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      {/* Card Container */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        {/* Toggle Buttons */}
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 font-semibold rounded-lg transition ${
              isLogin
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 font-semibold rounded-lg transition ${
              !isLogin
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            Register
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {isLogin ? "Welcome Back 👋" : "Join EduWithUs ✨"}
        </h2>

        {/* Role Selection (Always visible now) */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-2 text-center">
            Select your role:
          </p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                role === "student"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
            >
              Student 👨‍🎓
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                role === "teacher"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
            >
              Teacher 👩‍🏫
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-600 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isLogin ? `Login as ${role}` : `Register as ${role}`}
          </button>
        </form>

        {/* Bottom Text */}
        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
