import React from "react";
import CourseSlider from "./CourseSlider";
import FetchCourses from "../components/FetchCourses";
import Footer from "./Footer";
import Contact from "./Contact";
import { AuthContext } from "../components/Layout";

const Home = () => {
  return (
<>
    <div className="flex flex-col md:flex-row justify-between items-center flex-grow bg-gray-50 px-6 md:px-20 py-16">
      <div className="text-center md:text-left max-w-xl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight">
          Learn Anytime, Anywhere with <span className="text-yellow-500">EduWithUs</span>
        </h2>
        <p className="mt-4 text-gray-600 text-lg">
          Access top-quality courses, expert mentors, and a vibrant learning community — all in one place.
        </p>
        <button className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700">
          Get Started
        </button>
      </div>

      <div className="mt-10 md:mt-0">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1161/1161388.png"
          alt="Online Learning"
          className="w-72 md:w-96 mx-auto"
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-blue-700">Why Choose Us?</h3>
        <ul className="mt-4 list-disc list-inside">
          <li className="text-gray-600">Expert Instructors</li>
          <li className="text-gray-600">Flexible Learning</li>
          <li className="text-gray-600">Community Support</li>
        </ul>
      </div>
    
    </div>

      <h3 className="text-2xl font-bold text-blue-700">Our Popular Courses</h3>
      <CourseSlider />
      <div className="mt-6">
        {/* Course list */}
        <FetchCourses />
      </div>
      <Contact />
</>
  );
};

export default Home;
