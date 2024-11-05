import { loginService } from "../../Utils/Auth/loginService";

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(username, email, password, "formData: log in " + formData);
  try {
    const data = await loginService(username, email, password);

    return { user: data };
  } catch (error) {
    return { error: error.message };
  }
};
