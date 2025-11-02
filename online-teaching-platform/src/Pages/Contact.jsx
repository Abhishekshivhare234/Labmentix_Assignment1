import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Section - Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Contact EduwithUs
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're here to help you with any questions about our courses, 
            learning programs, or platform support.  
            Reach out and let’s make your learning journey smoother!
          </p>

          <div className="space-y-4 text-gray-700">
            <p>
              🎓 <strong>Address:</strong> EduwithUs HQ, Bhopal, India
            </p>
            <p>
              📞 <strong>Phone:</strong> +91 98765 43210
            </p>
            <p>
              ✉️ <strong>Email:</strong> support@eduwithus.com
            </p>
            <p>
              🌐 <strong>Website:</strong> www.eduwithus.com
            </p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for contacting EduwithUs! We'll reach out soon.");
          }}
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Message
            </label>
            <textarea
              rows="4"
              placeholder="Write your message..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
