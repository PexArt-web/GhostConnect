import { useLogin } from "../Hooks/useLogin";
export const LoginAction = async ({ request }) => {
  const pathname =
    new URL(request.url).searchParams.get("redirectTo") || "/lobby-layout";
  const { login, error } = useLogin();
  try {
    const formData = await request.formData();
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const data = await login(username, email, password);
    if (!error) {
      throw Error(error);
    }
    window.location.replace(pathname);
  } catch (error) {
    return error;
  }
};
