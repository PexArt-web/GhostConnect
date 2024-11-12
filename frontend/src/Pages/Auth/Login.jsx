import { useEffect } from "react";
import {
  Form,
  NavLink,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import SharedInput from "@/shared/component/SharedInput";
import SharedButton from "@/shared/component/SharedButton";
import SharedAlert from "@/shared/component/SharedAlert";

const Login = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData();
  console.log(actionData, "login");
  const { dispatch } = useAuthContext();
  useEffect(() => {
    if (
      actionData &&
      actionData.error === "Error: Redirecting users to the sign up page"
    ) {
      <SharedAlert
        type={"Error"}
        label={"Account does not exist redirecting back to sign up page"}
      />;
      setTimeout(() => {
        navigate("/get-started?message=please login", { replace: true });
      }, 5000);
    }
    if (actionData && actionData?.user) {
      dispatch({ type: "LOGIN", payload: actionData.user });
      navigate("/lobby-layout", { replace: true });
    }
  }, [actionData, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back!
        </h2>

        <Form method="post">
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="email">
              Email
            </label>
            <SharedInput
              type={"email"}
              id={"email"}
              name={"email"}
              autoComplete={"email"}
              required={true}
              placeholder={"Email Address"}
              className={
                "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <SharedInput
              type={"password"}
              id={"password"}
              name={"password"}
              autoComplete={"current-password"}
              required={true}
              placeholder={"password"}
              className={
                "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            />
          </div>
          <SharedButton
            type={"submit"}
            className={
              "w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            }
            disabled={navigation.state === "submitting"}
            label={
              navigation.state === "submitting" ? "Please wait..." : "Log In"
            }
          />
          {actionData?.error && (
            <p style={{ color: "red" }} className="text-center">
              {actionData.error === "Error: read ECONNRESET" ? "Please check your network connection and try again" : actionData.error}
            </p>
          )}
        </Form>
        <p className="text-center mt-4 text-gray-600">
          New to GhostConnect?
          <NavLink
            to="/get-started"
            className="text-blue-500 hover:underline cursor-pointer font-medium"
          >
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
