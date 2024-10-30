import { FiAlertTriangle } from "react-icons/fi";
import { NavLink } from "react-router-dom";


const AllRoutesError = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center p-4">
          <FiAlertTriangle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-6">
            Oops! The page you're looking for doesn't exist or may have been moved.
          </p>
          <NavLink
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-200"
          >
            Back to Home
          </NavLink>
        </div>
      );
}

export default AllRoutesError
