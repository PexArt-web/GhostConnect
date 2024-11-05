import { useEffect } from "react";
import {
  Form,
  NavLink,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useAuthContext } from "../../Hooks/useAuthContext";

const Signup = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const actionData = useActionData();
  console.log(actionData, "action error");
  useEffect(() => {
    if (actionData && actionData?.user) {
      dispatch({ type: "LOGIN", payload: actionData.user });
      navigate("/login", { replace: true });
    }
  }, [actionData, dispatch, navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <Form method="post">
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
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
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Please wait..." : "Sign Up"}
          </button>
          {actionData?.error && (
            <p style={{ color: "red" }} className="text-center">
              {actionData.error}
            </p>
          )}
        </Form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?
          <NavLink
            to="/login"
            className="text-blue-500 hover:underline cursor-pointer font-medium"
          >
            Log In
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
