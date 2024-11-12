import { loginService } from "../../services/Auth/loginService";
import { loginSchema } from "../Schemas/loginSchema";

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(username, email, password, "formData: log in " + formData);
  try {
    loginSchema.parse({ email, password });
    const data = await loginService(username, email, password);

    return { user: data };
  } catch (error) {
    return { error: error.message };
  }
};
