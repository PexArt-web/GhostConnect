import { useEffect } from "react";
import { Form, NavLink, useActionData, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Hooks/useAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const actionData = useActionData()
  console.log(actionData, 'login')
  const { dispatch } = useAuthContext()
    useEffect(()=>{
      if(actionData && actionData?.user){
        dispatch({ type: 'LOGIN', payload: actionData.user });
      }
    },[actionData, dispatch])
  const handleSubmit = (e) => {
    e.preventDefault();
    return navigate("/lobby-layout");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back!
        </h2>

        <Form>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            onClick={handleSubmit}
          >
            Log In
          </button>
          {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
        </Form>
        <p className="text-center mt-4 text-gray-600">
          New to GhostConnect?
          <NavLink to='/get-started' className="text-blue-500 hover:underline cursor-pointer font-medium">
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;