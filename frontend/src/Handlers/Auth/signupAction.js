import { signupService } from "../../Utils/Auth/signupService";
import { signUpSchema } from "../Schemas/signUpSchema";

export const signupAction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    signUpSchema.parse({ username, email, password });
    if (!username || !email || !password) {
      throw Error("All fields are required");
    }
    const data = await signupService(username, email, password);
    return { user: data };
  } catch (error) {
    // error.message = "TypeError: Failed to fetch"
    //   ? (error.message =
    //       "Network error: Unable to connect. Please check your internet connection and try again.")
    //   : error.message;
    return { error: error.message };
  }
};
