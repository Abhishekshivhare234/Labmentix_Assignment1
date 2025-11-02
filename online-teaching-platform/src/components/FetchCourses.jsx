import React, { useEffect, useState } from "react";
import axios from "axios";

const FetchCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses from backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses"); // 🔹 Your backend API URL
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center text-xl font-semibold mt-10">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 md:px-16">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Available Courses
      </h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600">No courses available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <img
                src={course.image || "https://via.placeholder.com/400x200"}
                alt={course.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {course.description?.substring(0, 80)}...
              </p>
              <p className="font-bold text-blue-600">₹{course.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchCourses;
